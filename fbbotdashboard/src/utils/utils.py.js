export const parseDate = (data) => {
    if (!data) return [];

    return [...data.map(obj => {
        if (obj.hasOwnProperty('date')) {
            obj.date = new Date(obj.date);
        }
        return obj;
    })];
}

export const orderedAcumValues = (acumValues, indexValues) => {
    const dict = indexValues.reduce((acc, indexVal, index) => {
        acc[indexVal] = acumValues[index];
        return acc;
    }, {});

    return indexValues.slice().sort().map(indexVal => dict[indexVal]);

}