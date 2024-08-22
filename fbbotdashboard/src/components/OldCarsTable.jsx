import {useAuth} from "../contexts/UserContext";
import {CONTENT_HOST, useFetchContentAPI} from "../hooks/UseFetch";
import {useState} from "react";
import {CarTable} from "./CarTable";
import {parseDate} from "../utils/utils.py";

export default function OldCarsTable({type}) {

    const [cars, setCars] = useState([]);
    const [actionTrigger, setActionTrigger] = useState(true);

    const {token} = useAuth();
    const {user} = useAuth();

    const endpoint = (type === 'Favs') ? "list-liked" :"list-old";
    // console.log("OldCarsTable", endpoint);

    const updateTable = {
        triggerRequest: actionTrigger,
        callback: (data) => { setActionTrigger(false); setCars(parseDate(data));},
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Consumer-Custom-Id': user,
        },
        endpoint: `${CONTENT_HOST}/${endpoint}/`,
        payload: null,
    }

    const [error] = useFetchContentAPI(updateTable);

    return (<CarTable type={type} cars={cars} setOldActionTrigger={setActionTrigger} pagination={true}/>);

}