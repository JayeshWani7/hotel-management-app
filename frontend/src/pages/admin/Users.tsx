import React from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_USERS } from '../../graphql/userQueries';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
} from '@mui/material';

const AdminUsers: React.FC = () => {
  const { data, loading, error } = useQuery(GET_USERS);
  const users = data?.users || [];

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">Failed to load users: {error.message}</Typography>
      ) : (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.firstName} {u.lastName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={String(u.role)} size="small" />
                    </TableCell>
                    <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AdminUsers;



