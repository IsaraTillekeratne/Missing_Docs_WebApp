import * as React from 'react';
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

const columnsLeader = [
    { id: 'requestId', label: 'Request Id', minWidth: 120 },
    { id: 'docName', label: 'Document Name', minWidth: 150 },
    { id: 'price', label: 'Price', minWidth: 150, align: 'left', },
    { id: 'comments', label: 'Comments', minWidth: 200, align: 'left', },
    { id: 'docDate', label: 'Document Date', minWidth: 150, align: 'right', },
    { id: 'placedDate', label: 'Placed Date', minWidth: 150, align: 'right', },
    { id: 'memberEmail', label: 'Member Email', minWidth: 150, align: 'right', },
];


const rowsLeader = [
    { requestId: '1', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '2', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '3', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '4', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '5', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '6', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '7', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '8', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
    { requestId: '9', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', memberEmail: 'isara@gmail.com' },
];

const showIconEdit = () => {
    return (<IconButton>
        <EditRoundedIcon />
    </IconButton>);
}

const showIconDel = () => {
    return (<IconButton>
        <DeleteRoundedIcon />
    </IconButton>);
}

const columnsMember = [
    { id: 'requestId', label: 'Request Id', minWidth: 50 },
    { id: 'docName', label: 'Document Name', minWidth: 120 },
    { id: 'price', label: 'Price', minWidth: 100, align: 'left', },
    { id: 'comments', label: 'Comments', minWidth: 200, align: 'left', },
    { id: 'docDate', label: 'Document Date', minWidth: 150, align: 'right', },
    { id: 'placedDate', label: 'Placed Date', minWidth: 150, align: 'right', },
    { id: 'doc', label: 'Document', minWidth: 150 },
    { id: 'edit', label: '', minWidth: 50 },
    { id: 'delete', label: '', minWidth: 50 },

];


const rowsMember = [
    { requestId: '1', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '2', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '3', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '4', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '5', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '6', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '7', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '8', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
    { requestId: '9', docName: 'IN', price: '1200.00', comments: 'Upload soon', docDate: '2021/12/03', placedDate: '2021/07/12', doc: 'Dummy Doc', edit: showIconEdit(), delete: showIconDel() },
];

export default function RequestsTable(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    let columns = [];
    let rows = [];

    if (props.user === 'L') {
        columns = columnsLeader;
        rows = rowsLeader
    } else if (props.user === 'M') {
        columns = columnsMember;
        rows = rowsMember;
    }

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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.requestId}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

