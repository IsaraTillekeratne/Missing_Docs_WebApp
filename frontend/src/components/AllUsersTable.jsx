import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import BasicSelect from './BasicSelect';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import IconButton from '@mui/material/IconButton';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'id', label: 'User Id', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 170, align: 'left', },
    { id: 'role', label: 'Role', minWidth: 150, align: 'left', },
    { id: 'icon', label: 'Set Role', minWidth: 170, align: 'right', },
    { id: 'delete', label: 'Delete User', minWidth: 170, align: 'right', },
];

const showIcon = (id, role) => {
    return (<BasicSelect userId={id} userRole={role} title="click to save" />);
}

export default function AllUsersTable() {

    let navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/allUsers`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {
                setUsers(response.data);
            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);

    const showIconDel = (id) => {

        const deleteUser = () => {
            Axios.delete(`${process.env.REACT_APP_SERVER}/Admin/deleteUser?id=${id}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
                .then((response) => {
                    alert(response.data);
                    window.location.reload(true);
                }).catch((e) => {
                    alert(e.response.data.error);
                    if (e.response.data.auth === false) {
                        alert("Please sign in again!");
                        navigate('/Signin');
                    }
                })
        }

        return (<IconButton onClick={deleteUser} title="Click to delete user"><DeleteRoundedIcon /></IconButton>);
    }

    users.map((user) => {
        if (user.role === 'A') user.role = 'Admin';
        else if (user.role === 'L') user.role = 'Team Leader';
        else if (user.role === 'M') user.role = 'Team Member';
        else if (user.role === 'C') user.role = 'Client';
        if (user.role !== 'Admin') {
            user.icon = showIcon(user.id, user.role);
            user.delete = showIconDel(user.id);
        }

    })

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 520 }}>
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
                        {users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                                        {columns.map((column) => {
                                            const value = user[column.id];
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
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

