import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function TextBox() {
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



    return (<TextField
        id="outlined-multiline-static"
        label="Paste Here"
        multiline
        fullWidth
        rows={10}
        columns={50}
        value={value}
        onChange={handleChange}
    />);

}