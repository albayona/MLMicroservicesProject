import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from "@mui/material";
import {CustomThemeOptions} from "./styles/CustomTheme";
import MainPage from "./pages/MainPage";
import UserProvider from "./contexts/UserContext";
import LogInPage from "./pages/LogInPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardLayout from "./layouts/dashboard/Layout";
import ProtectedRoute from "./utils/ProtectedRoute";
import NotAuthorizedPage from "./pages/NotAuthorizedPage";
import Bar from "./layouts/Bar";
import StartPage from "./pages/StartPage";

function App() {
    return (

        <Router>
            <UserProvider>
                <ThemeProvider theme={CustomThemeOptions}>
                    <div className="App">
                        <Bar/>
                        <div className="content">
                            <Routes>
                                <Route path="/login" element={<LogInPage/>}/>
                                <Route element={<ProtectedRoute requiredRole='admin'/>}>
                                    <Route element={<DashboardLayout/>}>
                                        <Route path="/user" element={<NotFoundPage/>}/>
                                        <Route path="/settings" element={<NotFoundPage/>}/>
                                        <Route path="/support" element={<NotFoundPage/>}/>
                                        <Route path="/home" element={<MainPage/>}/>
                                    </Route>
                                </Route>
                                <Route path="/unauthorized" element={<NotAuthorizedPage/>}/>
                                <Route path="/" element={<StartPage/>}/>
                            </Routes>
                        </div>
                    </div>
                </ThemeProvider>
            </UserProvider>
        </Router>

    );
}


export default App;
