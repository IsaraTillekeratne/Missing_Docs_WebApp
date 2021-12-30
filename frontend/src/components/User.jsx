import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import userImg from '../images/user.png'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({

    user: {
        margin: 'auto',
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    text: {

        textAlign: 'center'

    }

}));

// export default function User(props) {
export default function User() {
    const navigate = useNavigate()
    const classes = useStyles();
    let name = localStorage.getItem("name")

    const goBack = () => {
        navigate(-1);
    }

    return (<div>
        <Avatar className={classes.user} alt={name} src={userImg} />
        <div className={classes.text}>
            <IconButton title="Back" onClick={goBack}><ArrowBackRoundedIcon></ArrowBackRoundedIcon></IconButton>
            <h3>{name}</h3>
        </div>

    </div >);
}
