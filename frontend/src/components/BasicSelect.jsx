import * as React from 'react';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function BasicSelect(props) {
    let navigate = useNavigate();
    let [userRole, setUserRole] = React.useState('');
    let [isRoleChange, setIsRoleChange] = React.useState(false);

    const handleChange = (event) => {
        setUserRole(event.target.value);
        setIsRoleChange(true);
        if (props.userRole === 'Team Leader')
            alert("You are about to make changes to a team leader role. Please note that removing a leader role will also delete the team (if any) associated with the leader!");
        else if (props.userRole === 'Team Member')
            alert("You are about to make changes to a team member role. Please note that removing a member role will also result in losing its connections (if any) to teams, clients, and requests!");
        else if (props.userRole === 'Client')
            alert("You are about to make changes to a client role. Please note that removing a client role will also result in losing its connections (if any) to members, and requests!");
    };

    const saveRole = () => {
        if (isRoleChange) {
            let changeFrom = '';
            if (props.userRole === 'Client') changeFrom = 'C';
            else if (props.userRole === 'Team Member') changeFrom = 'M';
            else if (props.userRole === 'Team Leader') changeFrom = 'L';
            if (changeFrom === userRole) {
                alert('No changes done since the same user was selected!')
            } else {
                Axios.put(`${process.env.REACT_APP_SERVER}/Admin/changeRole`, {
                    userRole: userRole,
                    userId: props.userId,
                    currentRole: props.userRole
                }, {
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    }
                })
                    .then((response) => {
                        alert(response.data)
                        window.location.reload(true);
                    }).catch((e) => {
                        alert(e.response.data.error);
                        if (e.response.data.auth === false) {
                            alert("Please sign in again!");
                            navigate('/Signin');
                        }
                    })
            }

        }
    }

    return (<div>
        <Grid container spacing={2}>
            <Grid item xs={10}>
                <FormControl fullWidth>
                    <InputLabel id="select-label">
                        User Role
                    </InputLabel>
                    <Select
                        labelId="select-label"
                        id="simple-select"
                        value={userRole}
                        label="User Role"
                        onChange={handleChange}
                    >
                        <MenuItem value="C">Client</MenuItem>
                        <MenuItem value="L">Team Leader</MenuItem>
                        <MenuItem value="M">Team Member</MenuItem>
                    </Select>

                </FormControl>
            </Grid>
            <Grid item xs={2}>
                <IconButton onClick={saveRole}><SaveIcon /></IconButton>
            </Grid>

        </Grid>



    </div>
    );
}
