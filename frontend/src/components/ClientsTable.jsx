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

export default function ClientsTable(props) {
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

    const showIcon = (clientId) => {
        let nextPage = '';
        if (props.user === 'M') nextPage = `./MemberClientRequest/${clientId}`;
        else if (props.user === 'L') nextPage = `./LeaderClientRequest/${clientId}`;
        return (<IconButton component="a" href={nextPage}>
            <ArrowForwardIosRoundedIcon />
        </IconButton>);
    }

    let request = '';

    if (props.user === 'L') request = `${process.env.REACT_APP_SERVER}/Leader/assignedClients`;
    else if (props.user === 'M') request = `${process.env.REACT_APP_SERVER}/Member/clients`;

    useEffect(() => {
        Axios.get(request, {
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

