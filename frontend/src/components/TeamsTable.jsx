import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import IconButton from '@mui/material/IconButton';
import TeamMembersList from './TeamMembersList';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'id', label: 'Number', minWidth: 170 },
    { id: 'name', label: 'Leader Name', minWidth: 100 },
    { id: 'email', label: 'Leader Email', minWidth: 170, align: 'right', },
    { id: 'members', label: 'Team Members', minWidth: 170, align: 'right', },
    { id: 'icon', label: 'Delete Team', minWidth: 170, align: 'right', },
];

const showIcon = (leaderId) => {



    const deleteTeam = () => {
        Axios.put(`${process.env.REACT_APP_SERVER}/Admin/deleteTeam`, {
            leaderId: leaderId
        }, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {
                if (response.data.error) {
                    alert(response.data.error);

                } else {
                    alert(response.data);
                    window.location.reload(true);
                }
            })
    }
    return (<IconButton onClick={deleteTeam}><DeleteRoundedIcon /></IconButton>);
}

const showMembersList = (leaderId) => {
    return (<TeamMembersList teamNumber={leaderId} />);
}

export default function StickyHeadTable() {
    let navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    let [leaders, setLeaders] = React.useState([]);

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/leaders`, {
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
                    setLeaders(response.data);
                }
            })
    }, []);

    leaders.map((leader) => {
        leader.members = showMembersList(leader.id);
        leader.icon = showIcon(leader.id);
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
                        {leaders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((leader) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={leader.id} >
                                        {columns.map((column) => {
                                            const value = leader[column.id];
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
                count={leaders.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

