import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import IconButton from '@mui/material/IconButton';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'id', label: 'Client Id', minWidth: 100 },
    { id: 'name', label: 'Client Name', minWidth: 100 },
    { id: 'email', label: 'Client Email', minWidth: 170, align: 'right', },
    { id: 'icon', label: 'Show Requests', minWidth: 170, align: 'right', },
];

// should change href for ./MemberClientRequest too
const showIcon = (clientId) => {
    return (<IconButton component="a" href='./MemberClientRequest'>
        <ArrowForwardIosRoundedIcon />
    </IconButton>);
}

const rows = [
    { clientId: '1', name: 'IN', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '2', name: 'CN', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '3', name: 'IT', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '4', name: 'US', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '5', name: 'CA', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '6', name: 'AU', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '7', name: 'DE', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '8', name: 'IE', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '9', name: 'MX', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '10', name: 'JP', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '11', name: 'FR', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '12', name: 'GB', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '13', name: 'RU', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '14', name: 'NG', email: 'isara@gmail.com', icon: showIcon() },
    { clientId: '15', name: 'BR', email: 'isara@gmail.com', icon: showIcon() },
];

export default function ClientsTable() {
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
        Axios.get(`${process.env.REACT_APP_SERVER}/Leader/assignedClients`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {
                if (response.data.error) {
                    console.log(response)
                    alert(response.data.error);
                    // redirection didnt work
                    if ((response.data.auth) && (response.data.auth === false)) {
                        navigate('/Signin');
                    }
                } else {
                    setClients(response.data);
                }
            })
    }, []);

    clients.map((client) => {
        client.icon = showIcon(client.id);
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

