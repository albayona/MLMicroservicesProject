import {useAuth} from "../contexts/UserContext";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedRoute = ({
                            requiredRole,
                            children,
                        }) => {

    const {role}  = useAuth();
    const {user}  = useAuth();
    const {token}  = useAuth();


    console.log(user);

    if (!user) {
        return <Navigate to={'/login'} replace = {true}/>;
    }
    else if (requiredRole && requiredRole !== role) {
        return <Navigate to={'/unauthorized'} replace = {true}/>;
    }

    return children ? children : <Outlet/>;
};

export default ProtectedRoute;