import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'doc_date', label: 'Document Date', minWidth: 120 },
    { id: 'amount', label: 'Amount', minWidth: 150 },
    { id: 'partner', label: 'Partner', minWidth: 100, align: 'left', },
    { id: 'comments', label: 'Comments', minWidth: 200, align: 'left', },
    { id: 'document', label: 'Document', minWidth: 120, align: 'right', },
    { id: 'edit', label: 'Edit', minWidth: 120, align: 'right', },
    { id: 'delete', label: 'Delete', minWidth: 150, align: 'right', },
];



export default function MemberRequestsTable(props) {
    let navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [clickEdit, setClickEdit] = useState(false);
    const [reqs, setReqs] = useState([]);
    const [editReqId, setEditReqId] = useState(null);
    const [editReqIndex, setEditReqIndex] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSave = () => {
        if (clickEdit) {
            console.log(reqs[editReqIndex]);
            // SEND THE AXIOS REQUEST TO UPDATE REQUEST
        };
    }

    let client_id = props.clientId;

    const showIconEdit = (requestId) => {
        return (<div>
            <IconButton onClick={() => {
                setClickEdit(true);
                setEditReqId(requestId);
            }}>
                <EditRoundedIcon />
            </IconButton>
            <IconButton onClick={handleSave}>
                <SaveRoundedIcon />
            </IconButton>
        </div>);
    }
    const showIconDel = (requestId) => {

        const delReq = () => {
            Axios.delete(`${process.env.REACT_APP_SERVER}/Member/deleteRequest?requestId=${requestId}`, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
                .then((response) => {
                    if (response.data.error) {

                        alert(response.data.error);

                    } else if (response.status === 400) {
                        alert("Error 400 Bad Request!")
                    }
                    else {
                        alert(response.data);
                        window.location.reload(true);
                    }
                })
        }

        return (<IconButton onClick={delReq}>
            <DeleteRoundedIcon />
        </IconButton>);
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Member/requests?clientId=${client_id}`, {
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
                } else if (response.status === 400) {
                    alert("Error 400 Bad Request!")
                }
                else {
                    setReqs(response.data);
                }
            })
    }, []);

    reqs.map((req) => {
        req.edit = showIconEdit(req.requestid);
        req.delete = showIconDel(req.requestid);
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
                        {reqs
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((req, i) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={req.requestid}>
                                        {columns.map((column, index) => {
                                            const value = req[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {req.requestid === editReqId && index < 4 ?
                                                        <TextField placeholder={value} onChange={(e) => {
                                                            setEditReqIndex(i);
                                                            req[column.id] = e.target.value;
                                                        }}></TextField>
                                                        : value}
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
                count={reqs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

