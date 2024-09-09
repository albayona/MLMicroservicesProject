import {useAuth} from "./UserContext";
import {createContext, useContext, useEffect, useState} from "react";
import {fetchEventSource} from "@microsoft/fetch-event-source";
import {SSE_HOST} from "../hooks/UseFetch";

export const UpdateContext = createContext(null);


export const UpdateProvider = ({children}) => {
    const {token} = useAuth();
    const {user} = useAuth();
    const [subscribersToUpdate, setSubscribersToUpdate] = useState(['root']);
    const [subscribers, setSubscribers] = useState([]);

    console.log("subscribers", subscribers);
    console.log("subscribersToUpdate", subscribersToUpdate);


    const extractUpdate = (message) => {
        const prefix = "data: ";
        if (message.startsWith(prefix)) {
            const rawData = message.slice(prefix.length).trim();
            if (rawData.startsWith("b'") && rawData.endsWith("'")) {
                return rawData.slice(2, -1);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    const addSubscriber = (id) => {
        if (id) {
            setSubscribers(prev => [...prev, id]);
        }

    };

    const removeSubscriber = (id) => {
        if (id) {
            setSubscribers(prev => prev.filter(sub => sub !== id));
            setSubscribersToUpdate(prev => prev.filter(subToUpdate => subToUpdate !== id));
        }
    };

    const addSubscriberToUpdate = (data, includeRoot = true) => {
        if (!data) return;

        let subToUpdate = ['root'];

        if (!includeRoot) {
            subToUpdate = [];
        }

        subscribers.forEach(sub => {
            if (data.includes(sub)) {
                subToUpdate.push(sub);
            }
        });

        setSubscribersToUpdate(prev => [...new Set([...prev, ...subToUpdate])]);
    }

    const needUpdate = (sub) => {
        return subscribersToUpdate.includes(sub);
    }

    const removeSubscriberToUpdate = (sub) => {
        setSubscribersToUpdate(prev => prev.filter(subToUpdate => subToUpdate !== sub));
    }


    const processSSEUpdateData = (event) => {
        if (event.data.startsWith('data') && extractUpdate(event.data)) {
            addSubscriberToUpdate(extractUpdate(event.data));
        }
    }

    useEffect(() => {
            const fetchData = async () => {
                    await fetchEventSource(`${SSE_HOST}/subscribe/user`, {
                        method: "GET",
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'X-Consumer-Custom-Id': user,
                        },
                        onopen(res) {
                            if (res.ok && res.status === 200) {
                                // console.log("Connection made ", res);
                            } else if (
                                res.status >= 400 &&
                                res.status < 500 &&
                                res.status !== 429
                            ) {
                                console.log("Client side error ", res);
                            }
                        },
                        onmessage(event) {

                            console.log(">>>", event.data);
                            processSSEUpdateData(event);
                        }
                        ,
                        onclose() {
                            console.log("Connection closed by the server");
                        }
                        ,
                        onerror(err) {
                            console.log("There was an error from server", err);
                        }
                        ,
                    });
                }
            ;

            fetchData();
        }, []
    );

    return (
        <UpdateContext.Provider value={{
            subscribers,
            subscribersToUpdate,
            setSubscribersToUpdate,
            addSubscriber,
            removeSubscriber,
            needUpdate,
            removeSubscriberToUpdate,
            addSubscriberToUpdate
        }}>
            {children}
        </UpdateContext.Provider>
    );
}

export const useUpdate = () => {
    return useContext(UpdateContext);
};