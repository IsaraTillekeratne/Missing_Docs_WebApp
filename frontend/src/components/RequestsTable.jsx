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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        let endPoint = '';
        if (props.user === 'A') endPoint = `${process.env.REACT_APP_SERVER}/Admin/requests`;
        else if (props.user === 'L') endPoint = '';
        Axios.get(endPoint, {
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
            }).catch((err) => {
                alert("Bad Request!");
            })
    }, []);

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
                            }).then((res) => {
                                FileDownload(res.data, fileName);
                            }).catch((err) => {
                                alert("Bad Request!")
                            })

                        }
                    }
                }).catch((err) => {
                    alert("Bad Request!");
                })
        }
        return (<Button onClick={getDocument} variant="outlined">
            Download
        </Button>)
    }


    reqs.map((req) => {
        req.document = showDownload(req.id);
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
    );
}

