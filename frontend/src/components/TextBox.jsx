import * as React from 'react';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

export default function TextBox(props) {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    //var array = value.split('\t', '\n');
    var array = value.split(/\t|\n/);

    var n = 0;

    while (n < array.length) {
        var row = [];
        for (var i = 0; i < 6; i++) {
            row.push(array[n]);
            n = n + 1;
        }
        console.log(row);
    }

    console.log(props.clientId)

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
        <Fab color="primary" aria-label="add" sx={{ marginTop: '20px' }}>
            <AddIcon />
        </Fab>
    </div>);

}