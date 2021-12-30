import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
//import SideBar from '../components/SideBar';
import RequestsTable from '../components/RequestsTable';
import User from '../components/User';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Helpers/AuthContext';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

function AdminLeaderRequest(props) {
    let { leaderId } = useParams();
    let navigate = useNavigate();
    const { authState, setAuthState } = useContext(AuthContext);
    const { window } = props;
    //const { mobileOpen, handleDrawerToggle } = SideBarLogic();
    const container = window !== undefined ? () => window().document.body : undefined;
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const signout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setAuthState(false);
        navigate('/');
    }

    const backupDB = () => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/backupDB`, {
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

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: '#DDDDDD'
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" color={"#222831"}>
                        Requests
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },

                    }}
                ><User />
                    {/* <SideBar user='A' /> */}
                    {authState === true ? <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        onClick={signout}
                    >
                        Log out
                    </Button> :
                        null}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },

                    }}
                    open
                ><User />
                    {/* <SideBar user='A' /> */}
                    {authState === true ? <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        onClick={signout}
                    >
                        Log out
                    </Button> :
                        null}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <RequestsTable user='A' leaderId={leaderId} />
                <br></br>
                <Button variant='outlined' size="large" onClick={backupDB}
                >BACK UP DATABASE</Button>
            </Box>
        </Box>
    );
}



export default AdminLeaderRequest;
