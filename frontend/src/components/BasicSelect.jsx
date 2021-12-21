import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { set } from '../features/user'

export default function BasicSelect(props) {
    let navigate = useNavigate();
    let [userRole, setUserRole] = React.useState('');
    // const dispatch = useDispatch();

    const handleChange = (event) => {
        setUserRole(event.target.value);
        // dispatch(set(event.target.value));
    };

    const saveRole = () => {

        Axios.put("http://localhost:3001/Admin/changeRole", {
            userRole: userRole,
            userId: props.userId,
        }, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);
                    if ((response.data.auth) && (response.data.auth === false)) {
                        navigate('/Signin');
                    }
                } else {
                    // console.log(response.data);
                    window.location.reload(true);
                }
            })
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
