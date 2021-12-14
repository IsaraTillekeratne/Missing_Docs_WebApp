import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Pages/Home';
import Signup from '../Pages/Signup';
import Signin from '../Pages/Signin';
import ErrorPage from '../Pages/ErrorPage';
import AdminHome from '../Pages/AdminHome';
import AdminTeams from '../Pages/AdminTeams';
import AdminCreateTeams from '../Pages/AdminCreateTeams';
import AdminRequests from '../Pages/AdminRequests';
import AdminDocs from '../Pages/AdminDocs';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Signup" element={<Signup />} />
                <Route path="/Signin" element={<Signin />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AdminTeams" element={<AdminTeams />} />
                <Route path="/AdminCreateTeams" element={<AdminCreateTeams />} />
                <Route path="/AdminRequests" element={<AdminRequests />} />
                <Route path="/AdminDocs" element={<AdminDocs />} />

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    )
}

export default App;