import React, { useContext } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';
import Button from '@mui/material/Button';
import { AuthContext } from '../Helpers/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function SideBar(props) {
    let navigate = useNavigate();
    const { authState, setAuthState } = useContext(AuthContext);

    let links;
    let icons;
    let titles;

    if (props.user === 'A') {
        links = ['./AdminTeams', './AdminCreateTeams', './AdminRequests', './AdminDocs']
        icons = [<GroupsRoundedIcon />, <AddCircleRoundedIcon />, <SendRoundedIcon />, <DocumentScannerRoundedIcon />]
        titles = ['Teams', 'Create Teams', 'Requests', 'Documents']
    } else if (props.user === 'L') {
        links = ['./LeaderClients', './LeaderMembers']
        icons = [<DocumentScannerRoundedIcon />, <GroupsRoundedIcon />]
        titles = ['Clients', 'Team Members']
    } else if (props.user === 'M') {
        links = []
        icons = []
        titles = []
    } else if (props.user === 'C' || props.user === 'CP') {
        links = ['./ClientActual', './ClientProvided']
        icons = [<DocumentScannerRoundedIcon />, <DocumentScannerRoundedIcon />]
        titles = ['Actual Requests', 'Provided Requests']
    }

    function renderIcon(index) {
        return icons[index];
    }

    const signout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("name");
        setAuthState(false);
        navigate('/');
    }

    return (
        <div>

            <Divider />
            <List>
                {titles.map((text, index) => (
                    <ListItem button key={text} component="a" href={links[index]}>
                        <ListItemIcon>{renderIcon(index)}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            {authState === true ? <Button
                variant="contained"
                fullWidth
                size="small"
                onClick={signout}
            >
                Log out
            </Button> :
                null}
        </div>
    );
}