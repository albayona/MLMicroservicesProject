import {useState, useEffect} from 'react';
import {useAuth} from "../conntexts/UserContext";

export const CONTENT_HOST = 'http://localhost:8000'
export const SSE_HOST = 'http://localhost:8004'
export const SCRAPE_HOST = 'http://localhost:8002'




export const useFetchAPI = (httpMethodType, apiEndpoint, fetchCondition, setFetchCondition) => {
    const [done, setDone] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {
        if (fetchCondition) {
            fetch(apiEndpoint, {
                method: `${httpMethodType}`, headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }

            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('Could not update car');
                    }
                    return response.json();
                })
                .then(() => {
                    setDone(false);
                    setData(data);
                    setFetchCondition(false);
                    setError(null);
                })
                .catch(err => {
                    setDone(false);
                    setFetchCondition(false);
                    setError(err.message);
                })
        }
    }, [fetchCondition])

    return [done, error, data];
}


export const useFetchGroups = (url, setModels) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Consumer-Custom-Id': user,
            }
        })
            .then(response => {
                if (!response.ok) {
                    // error coming back from server
                    throw Error('could not fetch the data for that resource');
                }
                return response.json();
            })
            .then(data => {
                setIsLoading(false);
                setModels(data);
                setError(null);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.message);
            })
    }, [url])

    return [isLoading, error];
}


export const useFetchRefreshGroups = (url, setGroups, newEvent, setNewEvent, setRefreshEvent) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {

        if (newEvent) {
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('could not fetch the data for that resource');
                    }
                    return response.json();
                })
                .then(data => {
                    setIsLoading(false);
                    console.log(data)
                    setGroups(data);

                    setRefreshEvent(newEvent);
                    setNewEvent("");
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
    }, [url, newEvent])

    return [isLoading, error];
}


export const useFetchRefreshGroups2 = (url, setGroups, newEvent, setNewEvent) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {

        if (newEvent) {
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('could not fetch the data for that resource');
                    }
                    return response.json();
                })
                .then(data => {
                    setIsLoading(false);
                    console.log(data)
                    setGroups(data);
                    setNewEvent(false);
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
    }, [url, newEvent])

    return [isLoading, error];
}


export const useFetchCars = (url, setCars) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'X-Consumer-Custom-Id': user,
            }
        })
            .then(response => {
                if (!response.ok) {
                    // error coming back from server
                    throw Error('could not fetch the data for that resource');
                }
                return response.json();
            })
            .then(data => {
                setIsLoading(false);

                data = [...data.map(car => {
                    car.date = new Date(car.date);
                    car.new = false;
                    return car;
                })]

                setCars(data);
                setError(null);
            })
            .catch(err => {
                setIsLoading(false);
                setError(err.message);
            })
    }, [url])

    return [isLoading, error];
}


export const useFetchRefreshCars = (url, cars, setCars, actionDone, setActionDone) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {

        if (actionDone) {
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('could not fetch the data for that resource');
                    }
                    return response.json();
                })
                .then(data => {
                    setIsLoading(false);

                    data = [...data.map(new_car => {
                        new_car.date = new Date(new_car.date);
                        new_car.new = cars.some(car => car.id === new_car.id);
                        return new_car;
                    })]


                    setCars(data);

                    setActionDone(false);
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
    }, [url, actionDone])

    return [isLoading, error];
}



export const useFetchRefreshNewCars = (url, type, cars, setCars, group, groupValue, newEvent, setNewEvent) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {

        if (type === 'New' &&  (groupValue === newEvent || (newEvent && group === 'None'))) {
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('could not fetch the data for that resource');
                    }
                    return response.json();
                })
                .then(data => {
                    setIsLoading(false);

                    data = [...data.map(new_car => {
                        new_car.date = new Date(new_car.date);
                        new_car.new = cars.some(car => car.id === new_car.id);
                        return new_car;
                    })]


                    setCars(data);

                    setNewEvent('');
                    setError(null);
                })
                .catch(err => {
                    setIsLoading(false);
                    setError(err.message);
                })
        }
    }, [url, newEvent])

    return [isLoading, error];
}

export const useFetchPutCars = (url, setActionDone) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {
        if (url) {
            fetch(url, {
                method: 'PUT', headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }

            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('Could not update car');
                    }
                    setActionDone(true);
                    return response.json();
                })
                .then(() => {
                    setError(null);
                })
                .catch(err => {
                    setActionDone(false);
                    setIsLoading(false);
                    setError(err.message);
                })
        }
    }, [url])

    return [isLoading, error];
}

export const useFetchGetCars = (refresh, setRefresh) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const {token} = useAuth();
    const {user} = useAuth();

    useEffect(() => {
        if (refresh) {
            fetch(`${CONTENT_HOST}/list-new/`, {
                method: 'GET', headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'X-Consumer-Custom-Id': user,
                }
            })
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error('Could not update car');
                    }
                    setRefresh(false);
                    return response.json();
                })
                .then(() => {
                    setError(null);

                })
                .catch(err => {
                    setRefresh(false);
                    setIsLoading(false);
                    setError(err.message);
                })
        }
    }, [refresh])

    return [isLoading, error];
}
