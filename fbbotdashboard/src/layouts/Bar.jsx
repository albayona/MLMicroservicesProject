import {useAuth} from "../contexts/UserContext";
import AdminNav from "./AdminBar";
import LandingBar from "./LandingBar";

const Bar = () => {

    const {user}  = useAuth();
    return user ? <AdminNav/> : <LandingBar/>;
};

export default Bar;