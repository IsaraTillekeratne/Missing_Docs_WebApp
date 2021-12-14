import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect(props) {
    const [userType, setUserType] = React.useState('');

    const handleChange = (event) => {
        setUserType(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="select-label">
                    {props.isLogin === 'true' ? 'User Type' : 'Select'}
                </InputLabel>
                <Select
                    labelId="select-label"
                    id="simple-select"
                    value={userType}
                    label="User Type"
                    onChange={handleChange}
                >
                    <MenuItem value={'client'}>Client</MenuItem>
                    <MenuItem value={'member'}>Team Leader</MenuItem>
                    <MenuItem value={'leader'}>Team Member</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
