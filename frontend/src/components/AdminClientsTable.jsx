import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import LeaderSelect from './LeaderSelect';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Grid from '@mui/material/Grid';
import leader from '../features/leader';

const columns = [
    { id: 'name', label: 'Client Name', minWidth: 80 },
    { id: 'email', label: 'Client Email', minWidth: 80, align: 'left', },
    { id: 'leader_id', label: 'Current Leader Id', minWidth: 100, align: 'left', },
    { id: 'changeLeader', label: 'Change Leader', minWidth: 120, align: 'right', },
];

export default function AdminClientsTable(props) {
    const selectedLeader = useSelector((state) => state.leader.value);
    let navigate = useNavigate();
    let [clients, setClients] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/clients`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {

                setClients(response.data);

            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);


    const changeLeader = (clientId) => {
        const saveLeader = () => {
            if (selectedLeader === "") alert('Please select a leader');
            else {
                Axios.put(`${process.env.REACT_APP_SERVER}/Admin/reassignClient`, {
                    leaderId: selectedLeader,
                    clientId: clientId,
                }, {
                    headers: {
                        "x-access-token": localStorage.getItem("token")
                    }
                })
                    .then((response) => {
                        alert(response.data);
                        window.location.reload(true);
                        //setCurrentLeader(response.data[0].name + ' (' + response.data[0].email + ')')

                    }).catch((e) => {
                        alert(e.response.data.error);
                        if (e.response.data.auth === false) {
                            alert("Please sign in again!");
                            navigate('/Signin');
                        }
                    })


            }
        }
        return (<div><Grid container>
            <Grid item xs={10}>
                <LeaderSelect />
            </Grid>
            <Grid item xs={2}>
                <IconButton onClick={saveLeader}>
                    <SaveRoundedIcon />
                </IconButton>
            </Grid>
        </Grid>
        </div>);
    }

    clients.map((client) => {
        client.changeLeader = changeLeader(client.id);

    })


    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((client) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={client.id}>
                                        {columns.map((column) => {
                                            const value = client[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

