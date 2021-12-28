import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const columns = [
    { id: 'doc_date', label: 'Document Date', minWidth: 120 },
    { id: 'amount', label: 'Amount', minWidth: 150 },
    { id: 'partner', label: 'Partner', minWidth: 100, align: 'left', },
    { id: 'comments', label: 'Comments', minWidth: 200, align: 'left', },
    { id: 'received', label: 'Received', minWidth: 120, align: 'right', },
    { id: 'upload', label: 'Upload', minWidth: 150, align: 'right', },
];

export default function ActualRequestsTable() {
    let navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [reqs, setReqs] = useState([]);
    const [file, setFile] = useState(null);
    const [fileUploadReqId, setFileUploadReqId] = useState(null);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const showIconUpload = (requestid) => {

        const selectFile = (e) => {
            setFile(e.target.files[0]);
            setFileUploadReqId(requestid);
        }
        const submitFile = (e) => {
            const formData = new FormData();
            formData.append('file', file);

            Axios.put(`${process.env.REACT_APP_SERVER}/Client/uploadFile?reqId=${fileUploadReqId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
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
                    window.location.reload(true);
                })
        }
        return (<div>
            <input type="file" onChange={selectFile} ></input>
            <IconButton size="small" onClick={submitFile}>
                <FileUploadRoundedIcon />
            </IconButton>
        </div>);
    }

    const showIconMark = (requestid) => {
        const markProvided = () => {
            Axios.put(`${process.env.REACT_APP_SERVER}/Client/mark`, {
                reqId: requestid
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
                    window.location.reload(true);
                })
        }
        return (<IconButton title="Click to mark as provided" onClick={markProvided}>
            <CheckCircleRoundedIcon />
        </IconButton>);
    }

    useEffect(() => {
        Axios.get(`${process.env.REACT_APP_SERVER}/Client/requests`, {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
            .then((response) => {
                setReqs(response.data);
            }).catch((e) => {
                alert(e.response.data.error);
                if (e.response.data.auth === false) {
                    alert("Please sign in again!");
                    navigate('/Signin');
                }
            })
    }, []);

    reqs.map((req) => {
        req.received = showIconMark(req.requestid)
        req.upload = showIconUpload(req.requestid);
    })

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
                        {reqs
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((req) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={req.requestid}>
                                        {columns.map((column) => {
                                            const value = req[column.id];
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
                count={reqs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

