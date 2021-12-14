import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

export default function Home() {
    return (<React.Fragment>
        <CssBaseline />
        <Container maxWidth="md">

            <Box sx={{
                bgcolor: '#DDDDDD', height: '100vh', display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{ marginTop: "50px", fontSize: "2.5em" }}>
                    <h1>Missing Documents</h1>
                    <Skeleton
                        sx={{ bgcolor: 'grey.900' }}
                        variant="rectangular"
                        width={712}
                        height={40}
                    />
                    <div style={{ marginLeft: "165px" }}>

                        <Button variant="contained" size="large" style={{ margin: "50px", backgroundColor: "#30475E" }}>
                            Sign Up
                        </Button>
                        <Button variant="contained" size="large" style={{ backgroundColor: "#30475E" }}>
                            Sign in
                        </Button>
                    </div>
                </div>

            </Box>



        </Container>
    </React.Fragment>);
}



