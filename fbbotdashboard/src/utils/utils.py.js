export const parseDate = (data) => {
    return [...data.map(obj => {
        if (obj.hasOwnProperty('date')) {
            obj.date = new Date(obj.date);
        }
        return obj;
    })];
}