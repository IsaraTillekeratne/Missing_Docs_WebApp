import React, { useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
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

        let url = `${process.env.REACT_APP_SERVER}/Leader/clients?memberId=${props.memberId}`;
        if (props.user === 'A') url = `${process.env.REACT_APP_SERVER}/Admin/clients`;

        Axios.get(url, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {

                setClients(response.data);

            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);

    const addClients = () => {

        if (selectedClients.length === 0) alert("Please select clients");

        else {

            if (props.user === 'A') {

                Axios.put(`${process.env.REACT_APP_SERVER}/Admin/assignClients`, {
                    leaderId: props.leaderId,
                    clients: selectedClients,
                }, {
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    }
                })
                    .then((response) => {

                        alert(response.data);

                    }).catch((e) => {
                        alert(e.response.data.error);
                        if (e.response.data.auth === false) {
                            alert("Please sign in again!");
                            navigate('/Signin');
                        }
                    })

            }
            else {
                Axios.post(`${process.env.REACT_APP_SERVER}/Leader/assignClients`, {
                    memberId: props.memberId,
                    clients: selectedClients,
                }, {
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    }
                })
                    .then((response) => {

                        alert(response.data);
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

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <FormControl sx={{ m: 1, width: 350 }}>
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
                    <IconButton onClick={addClients}><AddCircleOutlineRoundedIcon /></IconButton>
                </Grid>
            </Grid>
        </div >
    );
}
