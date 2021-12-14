import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';

const columns = [
    { id: 'number', label: 'Number', minWidth: 170 },
    { id: 'leaderName', label: 'Leader Name', minWidth: 100 },
    { id: 'leaderEmail', label: 'Leader Email', minWidth: 170, align: 'right', },
    { id: 'members', label: 'Team Members', minWidth: 170, align: 'right', },
    { id: 'delete', label: 'Delete Team', minWidth: 170, align: 'right', },
];


const rows = [
    { number: '1', leaderName: 'IN', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '2', leaderName: 'CN', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '3', leaderName: 'IT', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '4', leaderName: 'US', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '5', leaderName: 'CA', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '6', leaderName: 'AU', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '7', leaderName: 'DE', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '8', leaderName: 'IE', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '9', leaderName: 'MX', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '10', leaderName: 'JP', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '11', leaderName: 'FR', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '12', leaderName: 'GB', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '13', leaderName: 'RU', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '14', leaderName: 'NG', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
    { number: '15', leaderName: 'BR', leaderEmail: 'isara@gmail.com', members: 'dummy data', delete: <DeleteRoundedIcon /> },
];

export default function StickyHeadTable() {
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
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
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
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

