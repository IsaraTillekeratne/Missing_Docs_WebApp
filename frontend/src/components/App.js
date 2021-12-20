import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import Signup from '../Pages/Signup';
import Signin from '../Pages/Signin';
import ErrorPage from '../Pages/ErrorPage';
import AdminHome from '../Pages/AdminHome';
import AdminCreateTeams from '../Pages/AdminCreateTeams';
import AdminRequests from '../Pages/AdminRequests';
import AdminDocs from '../Pages/AdminDocs';
import LeaderHome from '../Pages/LeaderHome';
import LeaderMembers from '../Pages/LeaderMembers';
import LeaderClientRequest from '../Pages/LeaderClientRequest';
import MemberHome from '../Pages/MemberHome';
import MemberClientRequest from '../Pages/MemberClientRequest';
import ClientHome from '../Pages/ClientHome';
import ClientProvided from '../Pages/ClientProvided';
import NoUserRole from '../Pages/NoUserRole';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AdminTeams" element={<AdminHome />} />
                <Route path="/AdminCreateTeams" element={<AdminCreateTeams />} />
                <Route path="/AdminRequests" element={<AdminRequests />} />
                <Route path="/AdminDocs" element={<AdminDocs />} />
                <Route path="/LeaderHome" element={<LeaderHome />} />
                <Route path="/LeaderClients" element={<LeaderHome />} />
                <Route path="/LeaderClientRequest" element={<LeaderClientRequest />} />
                <Route path="/LeaderMembers" element={<LeaderMembers />} />
                <Route path="/MemberHome" element={<MemberHome />} />
                <Route path="/MemberClientRequest" element={<MemberClientRequest />} />
                <Route path="/ClientHome" element={<ClientHome />} />
                <Route path="/ClientActual" element={<ClientHome />} />
                <Route path="/ClientProvided" element={<ClientProvided />} />
                <Route path="/NoUserRole" element={<NoUserRole />} />

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    )
}

export default App;