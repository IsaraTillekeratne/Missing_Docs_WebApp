import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
];

export default function ClientListDropDown(props) {
    let navigate = useNavigate();
    const [clients, setClients] = React.useState([]);
    const [selectedClients, setSelectedClients] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedClients(
            // On autofill we get a the stringified value.
            //typeof value === 'string' ? value.split(',') : value,
            value
        );
    };

    useEffect(() => {

        Axios.get(`${process.env.REACT_APP_SERVER}/Leader/clients?memberId=${props.memberId}`, {
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
                    setClients(response.data);
                }
            })
    }, []);

    const addClients = () => {

        Axios.post(`${process.env.REACT_APP_SERVER}/Leader/assignClients`, {
            memberId: props.memberId,
            clients: selectedClients,
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
                    alert(response.data);
                    window.location.reload(true);
                }
            })
    }

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <FormControl sx={{ m: 1, width: 400 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Add</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={selectedClients}
                            onChange={handleChange}
                            input={<OutlinedInput label="Add" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {clients.map((client) => (
                                <MenuItem key={client.id} value={client.id}>
                                    <Checkbox checked={selectedClients.indexOf(client.id) > -1} />
                                    <ListItemText primary={client.name + ' (' + client.email + ')'} />
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <IconButton onClick={addClients}><SaveIcon /></IconButton>
                </Grid>
            </Grid>
        </div >
    );
}
