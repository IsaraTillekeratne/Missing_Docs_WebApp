import React, { useContext } from 'react';
import { AuthContext } from '../Helpers/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

export default function NoUserRole() {
    let navigate = useNavigate();
    const { authState, setAuthState } = useContext(AuthContext);

    const signout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setAuthState(false);
        navigate('/');
    }

    return <div>
        <h3>You are not assigned to a role. Please try later.</h3>
        <a href="/">Go back to home page</a>
        <br></br>
        {authState === true ? <Button
            variant="text"
            size="small"
            onClick={signout}
        >
            Log out
        </Button> :
            null}
    </div>
}