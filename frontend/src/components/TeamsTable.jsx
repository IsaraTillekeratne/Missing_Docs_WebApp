import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import IconButton from '@mui/material/IconButton';
import TeamMembersList from './TeamMembersList';
import ClientListDropDown from './ClientListDropDown';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'id', label: 'Number', minWidth: 50 },
    { id: 'name', label: 'Leader Name', minWidth: 100 },
    { id: 'email', label: 'Leader Email', minWidth: 100, align: 'right', },
    { id: 'members', label: 'Team Members', minWidth: 100, align: 'right', },
    { id: 'assignClients', label: 'Assign Clients', minWidth: 100, align: 'right', },
    { id: 'icon', label: 'Delete Team', minWidth: 50, align: 'right', },
    { id: 'arrow', label: 'Show Requests', minWidth: 50, align: 'right', },
];

export default function StickyHeadTable() {
    let navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    let [leaders, setLeaders] = React.useState([]);

    const showReqs = (leaderId) => {
        let nextPage = `./AdminLeaderRequest/${leaderId}`;
        return (<IconButton component="a" href={nextPage}>
            <ArrowForwardIosRoundedIcon />
        </IconButton>);
    }

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
        return (<IconButton onClick={deleteTeam}><DeleteRoundedIcon /></IconButton>);
    }

    const showMembersList = (leaderId) => {
        return (<TeamMembersList teamNumber={leaderId} />);
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Admin/leaders`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {

                setLeaders(response.data);

            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);

    const assignClients = (leaderId) => {
        return (<ClientListDropDown user='A' leaderId={leaderId} />);
    }

    leaders.map((leader) => {
        leader.members = showMembersList(leader.id);
        leader.icon = showIcon(leader.id);
        leader.arrow = showReqs(leader.id);
        leader.assignClients = assignClients(leader.id);
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

