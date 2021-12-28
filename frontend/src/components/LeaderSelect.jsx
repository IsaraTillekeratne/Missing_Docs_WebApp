import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set } from '../features/leader'

export default function LeaderSelect() {
    let navigate = useNavigate();
    let [leaders, setLeaders] = useState([]);
    let [selectedLeader, setSelectedLeader] = useState('');
    const dispatch = useDispatch();

    const handleChange = (event) => {
        setSelectedLeader(event.target.value);
        dispatch(set(event.target.value));
    };

    useEffect(() => {

        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/leaders`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {

                setLeaders(response.data);

            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);

    return (<div>

        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="select-label">
                    Select
                </InputLabel>
                <Select
                    labelId="select-label"
                    id="simple-select"
                    value={selectedLeader}
                    label="User Role"
                    onChange={handleChange}
                >
                    {leaders.map((leader) => {
                        return <MenuItem value={leader.id} key={leader.id}>{leader.name} ({leader.email})</MenuItem>
                    })}
                </Select>

            </FormControl>
        </Box>
    </div>
    );
}
