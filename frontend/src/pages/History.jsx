import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getTransactionHistory, getAllTransactions } from '../api';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../api';

export default function History() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    loadTransactions();
    if (isAdmin) {
      loadUsers();
    }
  }, [selectedUserId]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = isAdmin && selectedUserId ? await getAllTransactions(selectedUserId) : await getTransactionHistory();
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 0 }}>
          Transaction History
        </Typography>
        {isAdmin && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              label="Select User"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <MenuItem value="">My Transactions</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Symbol</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total Amount</TableCell>
                  <TableCell align="right">Fee</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>{tx.orderId}</TableCell>
                    <TableCell>
                      <Box component="span" sx={{ color: tx.transactionType === 'BUY' ? 'success.main' : 'error.main', fontWeight: 'bold' }}>
                        {tx.transactionType}
                      </Box>
                    </TableCell>
                    <TableCell component="th" scope="row" fontWeight="bold">
                      {tx.symbol}
                    </TableCell>
                    <TableCell align="right">{tx.quantity}</TableCell>
                    <TableCell align="right">${tx.price?.toFixed(2)}</TableCell>
                    <TableCell align="right">${tx.totalAmount?.toFixed(2)}</TableCell>
                    <TableCell align="right">${tx.fee?.toFixed(2)}</TableCell>
                    <TableCell>{new Date(tx.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography color="text.secondary">No transactions found</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
