import {useEffect, useState} from 'react';

export const CONTENT_HOST = 'http://localhost:8000'
export const SSE_HOST = 'http://localhost:8004'
export const SCRAPE_HOST = 'http://localhost:8002'


export const useFetchContentAPI = (request) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        let ignore = false;
        if (request.triggerRequest) {
            // console.log('useFetchContentAPI', request.endpoint);
            setIsLoading(true);

            let req = {
                method: request.method, headers: request.headers,
            };

            if (request.method === 'POST' || request.method === 'PUT') {
                req.body = JSON.stringify(request.payload);
            }

            fetch(request.endpoint, req)
                .then(response => {
                    if (!response.ok) {
                        // error coming back from server
                        throw Error(`Content API error: ${response}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    if (!ignore) {
                        request.callback(data);
                        setError(null);
                        setIsLoading(false);
                    }
                })
                .catch(err => {
                    setError(err.message);
                    setIsLoading(false);
                    console.error(err);
                })
        }

        return () => {
            ignore = true;
        };
    }, [request])

    return [error, isLoading];
}





