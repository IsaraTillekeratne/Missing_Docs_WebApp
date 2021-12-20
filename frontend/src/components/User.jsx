import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import userImg from '../images/user.png'

const useStyles = makeStyles((theme) => ({

    user: {


        margin: 'auto',
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(1),
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    text: {

        textAlign: 'center'

    }

}));

// export default function User(props) {
export default function User() {

    const classes = useStyles();
    let name = localStorage.getItem("name")

    return (<div><Avatar className={classes.user} alt={name} src={userImg} />
        <h3 className={classes.text}>{name}</h3></div >);
}
