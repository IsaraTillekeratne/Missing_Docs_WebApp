import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import FileDownload from 'js-file-download';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import MenuItem from '@mui/material/MenuItem';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

// this is for admin and leader views

const columns = [
    { id: 'doc_date', label: 'Document Date', minWidth: 120 },
    { id: 'placed_date', label: 'Placed Date', minWidth: 120, align: 'left', },
    { id: 'amount', label: 'Amount', minWidth: 120, align: 'left', },
    { id: 'partner', label: 'Partner', minWidth: 100, align: 'left', },
    { id: 'comments', label: 'Comments', minWidth: 150, align: 'left', },
    { id: 'document', label: 'Document', minWidth: 150, align: 'right', },
];

export default function RequestsTable(props) {
    let navigate = useNavigate();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [reqs, setReqs] = useState([]);
    const [doc, setDoc] = useState(null);
    const [view, setView] = useState("A"); // for actual and provided toggle

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        let endPoint = '';
        if (props.user === 'A') endPoint = `${process.env.REACT_APP_SERVER}/Admin/requests?type=${view}`;
        else if (props.user === 'L') endPoint = `${process.env.REACT_APP_SERVER}/Leader/requests?clientId=${props.clientId}&type=${view}`;
        Axios.get(endPoint, {
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
    }, [view]);

    const showDownload = (id) => {
        const getDocument = () => {
            let docEndPoint = '';
            if (props.user === 'A') docEndPoint = `${process.env.REACT_APP_SERVER}/Admin/document?reqId=${id}`;
            else if (props.user === 'L') docEndPoint = "";
            Axios.get(docEndPoint, {
                headers: {
                    "x-access-token": localStorage.getItem("token")
                }
            })
                .then((response) => {



                    if (response.data[0].document === null) alert("File is not provided yet!")
                    else {
                        let fileName = response.data[0].document;
                        let url = "";
                        if (props.user === 'A') url = `${process.env.REACT_APP_SERVER}/Admin/download?fileName=${fileName}`;
                        else if (props.user === 'L') url = "";
                        Axios({
                            url: url,
                            method: "GET",
                            responseType: "blob",
                            headers: {
                                "x-access-token": localStorage.getItem("token")
                            }
                        }).then((response) => {
                            FileDownload(response.data, fileName);
                        }).catch((e) => {
                            alert(e.response.data.error);
                            if (e.response.data.auth === false) {
                                alert("Please sign in again!");
                                navigate('/Signin');
                            }
                        })

                    }

                }).catch((e) => {
                    alert(e.response.data.error);
                    if (e.response.data.auth === false) {
                        alert("Please sign in again!");
                        navigate('/Signin');
                    }
                })
        }
        const markNotProvided = () => {
            Axios.put(`${process.env.REACT_APP_SERVER}/Leader/unMark`, {
                reqId: id
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
        return (<div>
            {view === 'P' ? <Button onClick={getDocument} variant="outlined">
                Download
            </Button> : null}
            {view === 'P' && props.user === 'L' ? <IconButton title="Click to mark as not provided" onClick={markNotProvided}>
                <CancelRoundedIcon />
            </IconButton> : null}
        </div>)
    }


    reqs.map((req) => {
        req.document = showDownload(req.id);
    })

    const handleView = (event) => {
        setView(event.target.value);
    };


    return (<div>
        <Select
            labelId="select-label"
            id="simple-select"
            value={view}
            label="View"
            onChange={handleView}
            sx={{ marginBottom: "10px" }}
        >
            <MenuItem value="A">Actual</MenuItem>
            <MenuItem value="P">Provided</MenuItem>
        </Select>
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={req.id}>
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
    </div>
    );
}

