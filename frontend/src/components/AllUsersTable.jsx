import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import BasicSelect from './BasicSelect';

const columns = [
    { id: 'userId', label: 'User Id', minWidth: 170 },
    { id: 'name', label: 'Name', minWidth: 100 },
    { id: 'email', label: 'Email', minWidth: 170, align: 'left', },
    { id: 'icon', label: 'User Role', minWidth: 170, align: 'right', },
];

const showIcon = () => {
    return (<BasicSelect isLogin='true' />);
}

const rows = [
    { userId: '1', name: 'IN', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '2', name: 'CN', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '3', name: 'IT', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '4', name: 'US', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '5', name: 'CA', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '6', name: 'AU', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '7', name: 'DE', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '8', name: 'IE', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '9', name: 'MX', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '10', name: 'JP', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '11', name: 'FR', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '12', name: 'GB', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '13', name: 'RU', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '14', name: 'NG', email: 'isara@gmail.com', icon: showIcon() },
    { userId: '15', name: 'BR', email: 'isara@gmail.com', icon: showIcon() },
];

export default function AllUsersTable() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
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

