import {createContext, useContext, useState} from "react";
import {RegExGroup} from "../components/RegExGroup";
import * as React from "react";

export const RegexContext = createContext(null);


export function RegexProvider({children}) {
    const initialRegex = "{\"regex\":[{\"regexClass\":\"\\\\D\"},{\"regexClass\":\"regex\",\"regex\":[{\"match\":\"hello\"}],\"quantifier\":\"?\"},{\"quantifier\":\"?\",\"m\":null,\"n\":null,\"match\":\"woww\"}]}";
    // const initialRegex = "{\"regex\":[{}]}";
    const [strRegex, setStrRegex] = useState(initialRegex);

    function getInitialRegexGroupStateLength(nestedLevel) {
        const r = JSON.parse(strRegex);
        const indexes = nestedLevel.split(',').map(Number);
        const groupList = nestedLevel ? indexes.reduce((acc, index) => acc[index].regex, r.regex) : r.regex;
        return groupList.length;

    }


    function getInitialRegexState(nestedLevel, index, isRoot = false) {
        const r = JSON.parse(strRegex);
        if (isRoot) return r;

        const indexes = nestedLevel.split(',').map(Number);
        const groupList = nestedLevel ? indexes.reduce((acc, i) => acc[i].regex, r.regex) : r.regex;

        if (index >= groupList.length) {
            return null;
        }
        return groupList[index];
    }

    function updateNestedRegexObject(obj, index, nestedLevel, spread = true, isRoot = false) {

        let r = JSON.parse(strRegex);

        if (isRoot) {
            r = {...r, ...obj};
            setStrRegex(JSON.stringify(r));

        } else {
            console.log(obj, index, nestedLevel);
            const indexes = nestedLevel.split(',').map(Number);

            let toUpdate = nestedLevel ? indexes.reduce((acc, index) => acc[index].regex, r.regex) : r.regex;

            if (spread) {
                toUpdate[parseInt(index)] = {...toUpdate[index], ...obj};
            } else {
                toUpdate[parseInt(index)] = obj;
            }

            setStrRegex(JSON.stringify(r));
        }
    }

    function removeNestedRegexObject(nestedLevel, index) {
        const indexes = nestedLevel.split(',').map(Number);
        const r = JSON.parse(strRegex);
        let toUpdate = nestedLevel ? indexes.reduce((acc, index) => acc[index].regex, r.regex) : r.regex;
        toUpdate.splice(parseInt(index), 1);
        setStrRegex(JSON.stringify(r));
    }


    function addNestedRegexObject(nestedLevel) {
        const indexes = nestedLevel.split(',').map(Number);
        const r = JSON.parse(strRegex);
        let toUpdate = nestedLevel ? indexes.reduce((acc, index) => acc[index].regex, r.regex) : r.regex;
        toUpdate.push({});
        setStrRegex(JSON.stringify(r));
    }

    return (
        <RegexContext.Provider value={{
            updateNestedRegexObject,
            removeNestedRegexObject,
            addNestedRegexObject,
            strRegex,
            getInitialRegexGroupStateLength,
            getInitialRegexState
        }}>
            {children}
        </RegexContext.Provider>
    );
}

export function useRegexContext() {
    return useContext(RegexContext);
}

