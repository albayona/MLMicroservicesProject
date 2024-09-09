import {useAuth} from "../../contexts/UserContext";
import {CONTENT_HOST, useFetchContentAPI} from "../../hooks/UseFetch";
import {useState} from "react";
import {useUpdate} from "../../contexts/UpdateContext";
import PaginatedCarTable from "./PaginatedCarTable";


export default function ArchiveCarsTable({type}) {

    const [carsPage, setCarsPage] = useState({});
    const [updateTrigger, setUpdateTrigger] = useState(true);
    const {addSubscriberToUpdate} = useUpdate();

    const {token} = useAuth();
    const {user} = useAuth();

    const [queryParams, setQueryParams] = useState("");
    const endpoint = (type === 'Favs') ? "list-liked" : "list-old";

    const tableUpdateRequest = generateRequest(updateTrigger,
        setUpdateTrigger, setCarsPage, token, user, endpoint, queryParams);


    const [error, isLoading] = useFetchContentAPI(tableUpdateRequest);


    return (<PaginatedCarTable type={type}
                               setQueryParams={setQueryParams}
                               carsPage={carsPage}
                               isLoading={isLoading}
                               addSubscriberToUpdate={addSubscriberToUpdate}
                               setUpdateArchiveTrigger={setUpdateTrigger}
    />);

}

function generateRequest(updateTrigger, setUpdateTrigger, setCarsPage, token, user, endpoint, queryParams) {

    return {
        triggerRequest: updateTrigger,
        callback: (data) => {
            setUpdateTrigger(false);
            setCarsPage(data);
        },
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Consumer-Custom-Id': user,
        },
        endpoint: `${CONTENT_HOST}/${endpoint}?${queryParams}`,
        payload: null,
    };
}

