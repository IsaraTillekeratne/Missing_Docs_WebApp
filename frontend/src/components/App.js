import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import Signup from '../Pages/Signup';
import Signin from '../Pages/Signin';
import ErrorPage from '../Pages/ErrorPage';
import AdminHome from '../Pages/AdminHome';
import AdminCreateTeams from '../Pages/AdminCreateTeams';
import AdminRequests from '../Pages/AdminRequests';
import LeaderHome from '../Pages/LeaderHome';
import LeaderMembers from '../Pages/LeaderMembers';
import LeaderClientRequest from '../Pages/LeaderClientRequest';
import MemberHome from '../Pages/MemberHome';
import MemberClientRequest from '../Pages/MemberClientRequest';
import ClientHome from '../Pages/ClientHome';
import ClientProvided from '../Pages/ClientProvided';
import NoUserRole from '../Pages/NoUserRole';
import { AuthContext } from '../Helpers/AuthContext';
import { useState, useEffect } from 'react';
import Axios from 'axios';

function App() {

    const [authState, setAuthState] = useState(false);

    useEffect(() => {
        Axios.get("http://localhost:3001/Auth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {

                setAuthState(true);

            }).catch((e) => {
                setAuthState(false);
            })

    }, [])
    return (
        <AuthContext.Provider value={{ authState, setAuthState }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/Signup" element={<Signup />} />
                    <Route path="/Signin" element={<Signin />} />
                    <Route path="/AdminHome" element={<AdminHome />} />
                    <Route path="/AdminTeams" element={<AdminHome />} />
                    <Route path="/AdminCreateTeams" element={<AdminCreateTeams />} />
                    <Route path="/AdminRequests" element={<AdminRequests />} />
                    <Route path="/LeaderHome" element={<LeaderHome />} />
                    <Route path="/LeaderClients" element={<LeaderHome />} />
                    <Route path="/LeaderClientRequest/:clientId" element={<LeaderClientRequest />} />
                    <Route path="/LeaderMembers" element={<LeaderMembers />} />
                    <Route path="/MemberHome" element={<MemberHome />} />
                    <Route path="/MemberClientRequest/:clientId" element={<MemberClientRequest />} />
                    <Route path="/ClientHome" element={<ClientHome />} />
                    <Route path="/ClientActual" element={<ClientHome />} />
                    <Route path="/ClientProvided" element={<ClientProvided />} />
                    <Route path="/NoUserRole" element={<NoUserRole />} />

                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Router>
        </AuthContext.Provider>
    )
}

export default App;