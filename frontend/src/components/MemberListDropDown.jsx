import React, { useState, useEffect } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set } from '../features/members'


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

export default function MemberListDropDown() {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    let [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedMembers(
            // On autofill we get a the stringified value.
            //typeof value === 'string' ? value.split(',') : value,
            value
        );
        dispatch(set(value));

    };


    useEffect(() => {

        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/unassignedmembers`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {

                setMembers(response.data);

            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);


    return (
        <div>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">Add</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={selectedMembers}
                    onChange={handleChange}
                    input={<OutlinedInput label="Add" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {members.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                            <Checkbox checked={selectedMembers.indexOf(member.id) > -1} />
                            <ListItemText primary={member.name + ' (' + member.email + ')'} />
                        </MenuItem>
                    ))}
                </Select>

            </FormControl>
        </div>
    );
}
