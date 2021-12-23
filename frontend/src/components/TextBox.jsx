import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TextBox(props) {
    let navigate = useNavigate();
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    var array = value.split(/\t|\n/);

    var n = 0;
    let data = [];

    while (n < array.length) {
        var row = [];
        for (var i = 0; i < 4; i++) {
            row.push(array[n]);
            n = n + 1;
        }
        data.push(row);
    }

    const uploadRequests = () => {
        if (data.length === 0) alert("Paste the requests!");
        else if ((data.length === 1) && (data[0][0] === '')) {
            alert("Paste the requests!");
        }
        else {
            Axios.post(`${process.env.REACT_APP_SERVER}/Member/sendRequests`, {
                clientId: props.clientId,
                requests: data
            }, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
                .then((response) => {
                    if (response.data.error) {
                        console.log(response)
                        alert(response.data.error);
                        // redirection didnt work
                        if ((response.data.auth) && (response.data.auth === false)) {
                            navigate('/Signin');
                        }
                    } else {
                        alert(response.data);
                        window.location.reload(true);
                    }
                })
        }

    }

    return (<div><TextField
        id="outlined-multiline-static"
        label="Paste Here"
        multiline
        fullWidth
        rows={10}
        columns={50}
        value={value}
        onChange={handleChange}
    />
        <Fab color="primary" aria-label="add" sx={{ marginTop: '20px' }} onClick={uploadRequests}>
            <AddIcon />
        </Fab>
    </div>);

}