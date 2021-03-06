import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Helpers/AuthContext';

const theme = createTheme();

export default function Signin() {
    const { authState, setAuthState } = useContext(AuthContext);
    let navigate = useNavigate();
    // if user is already signed in -> redirect to his home page
    if (authState === true) {
        Axios.get(`${process.env.REACT_APP_SERVER}/UserRoles/getRole`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        }).then((response) => {
            let role = response.data.role;
            if (role === 'A') navigate("/AdminHome")
            else if (role === 'C') navigate("/ClientHome")
            else if (role === 'L') navigate("/LeaderHome")
            else if (role === 'M') navigate("/MemberHome")
        }).catch((e) => {
            alert(e.response.data.error);
            if (e.response.data.auth === false) {
                alert("Please sign in again!");
                navigate('/Signin');
            } else {
                navigate("/NoUserRole")
            }
        })
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        let email = data.get('email');
        let password = data.get('password');

        // try to do validations using yup & react hook form
        if ((email === '') || (password === '')) {
            alert('Please fill all the fields');
        } else {

            Axios.post(`${process.env.REACT_APP_SERVER}/Signin`, {
                userEmail: email,
                userPassword: password,
            }).then((response) => {

                localStorage.setItem("token", response.data.token);
                localStorage.setItem("name", response.data.name);
                setAuthState(true);

                // navigate based on user role *************************************
                Axios.get(`${process.env.REACT_APP_SERVER}/UserRoles/getRole`, {
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    }
                }).then((response) => {
                    let role = response.data.role;
                    if (role === 'A') navigate("/AdminHome")
                    else if (role === 'C') navigate("/ClientHome")
                    else if (role === 'L') navigate("/LeaderHome")
                    else if (role === 'M') navigate("/MemberHome")
                }).catch((e) => {
                    alert(e.response.data.error);
                    if (e.response.data.auth === false) {
                        alert("Please sign in again!");
                        navigate('/Signin');
                    } else {
                        navigate("/NoUserRole")
                    }
                })

            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: '#30475E' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, bgcolor: '#30475E' }}
                        >
                            Sign In
                        </Button>
                        <Grid container>

                            <Grid item>
                                <Link href="/Signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}