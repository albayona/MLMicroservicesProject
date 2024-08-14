import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

const UserProvider = ({ children }) => {
 const [user, setUser] = useState(localStorage.getItem("user") || null);
 const [role, setRole] = useState(localStorage.getItem("role") || null);
 const [grouping, setGrouping] = useState(localStorage.getItem("group") || "");
 const [token, setToken] = useState(localStorage.getItem("site") || "");

 const navigate = useNavigate();
 const loginAction = (data) => {
  try {
   if (data) {
    setUser(data.user.email);
    setToken(data.token);
    setRole(data.user.role)
    localStorage.setItem("site", data.token);
    localStorage.setItem("user", data.user.email);
    localStorage.setItem("role", data.user.role);
    navigate("/home");
    return;
   }
   throw new Error(data);
  } catch (err) {
   console.error(err);
  }
 };

 const groupAction = (data) => {
  try {
   if (data) {
    localStorage.setItem("group", data);
    setGrouping(data);
    return;
   }
   throw new Error(data);
  } catch (err) {
   console.error(err);
  }
 };

 const logOut = () => {
  setUser(null);
  setToken("");
  localStorage.removeItem("site");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("group");
  navigate("/login");
 };

 return (
     <UserContext.Provider value={{ token, user, role, grouping, loginAction, logOut, groupAction }}>
      {children}
     </UserContext.Provider>
 );

};

export default UserProvider;

export const useAuth = () => {
 return useContext(UserContext);
};