import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ListItemText from '@mui/material/ListItemText';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TeamMembersList(props) {
    let navigate = useNavigate();
    let [members, setMembers] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/assignedMembers?leaderId=${props.teamNumber}`, {
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
                    setMembers(response.data);
                }
            })
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="demo-customized-button"
                aria-controls="demo-customized-menu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="outlined"
                disableElevation
                onClick={handleClick}
                endIcon={<KeyboardArrowDownIcon />}
                size="small"
            >
                Show Members
            </Button>
            <Menu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {members.map((member) => (
                    <MenuItem key={member.id} value={member.id} onClick={handleClose} disableRipple>
                        <ListItemText primary={member.name + ' (' + member.email + ')'} />
                    </MenuItem>
                ))}
                {/* <MenuItem onClick={handleClose} disableRipple>
                    Member 1
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    Member 2
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    Member 3
                </MenuItem>
                <MenuItem onClick={handleClose} disableRipple>
                    Member 4
                </MenuItem> */}
            </Menu>
        </div>
    );
}

