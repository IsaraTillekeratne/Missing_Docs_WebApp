import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import SideBar from '../components/SideBar';
import TopBar from '../components/TopBar';
import SideBarLogic from './SideBarLogic';
import SaveIcon from '@mui/icons-material/Save';
import MembersTable from '../components/MembersTable';
import Button from '@mui/material/Button';

const drawerWidth = 240;

function LeaderMembers(props) {
    const { window } = props;
    const { mobileOpen, handleDrawerToggle } = SideBarLogic();
    const container = window !== undefined ? () => window().document.body : undefined;

    return (<div>
        <Box sx={{ display: 'flex' }}>
            <TopBar title="Team Members" />
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
                >
                    <SideBar user='L' />
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },

                    }}
                    open
                >
                    <SideBar user='L' />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <MembersTable />
                <Button variant="contained" endIcon={<SaveIcon />} sx={{ marginTop: '20px' }}>
                    Save Changes
                </Button>
            </Box>

        </Box>

    </div>
    );
}

LeaderMembers.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default LeaderMembers;