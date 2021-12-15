import * as React from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';
import User from './User';

export default function SideBar(props) {

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
    }

    function renderIcon(index) {
        return icons[index];
    }

    return (
        <div>
            <User />
            <Divider />
            <List>
                {titles.map((text, index) => (
                    <ListItem button key={text} component="a" href={links[index]}>
                        <ListItemIcon>{renderIcon(index)}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
}