import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import SideBarLogic from './SideBarLogic';
import ActualRequestsTable from '../components/ActualRequestsTable';
import User from '../components/User';

const drawerWidth = 240;

function ClientHome(props) {
    const { window } = props;
    const { mobileOpen, handleDrawerToggle } = SideBarLogic();
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <TopBar title="Actual Requests" />
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
                    <SideBar user='C' />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },

                    }}
                    open
                ><User />
                    <SideBar user='C' />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <ActualRequestsTable />

            </Box>
        </Box>
    );
}

export default ClientHome;
