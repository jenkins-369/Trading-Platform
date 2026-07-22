import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getWalletBalance, deposit, withdraw, getTransactionHistory, getAllUsers } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Wallet() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [processing, setProcessing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    loadWallet();
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, selectedUserId]);

  const loadWallet = async () => {
    setLoading(true);
    setError('');
    try {
      const [walletData, txData] = await Promise.all([
        getWalletBalance(isAdmin ? selectedUserId : undefined),
        getTransactionHistory(isAdmin ? selectedUserId : undefined),
      ]);
      setWallet(walletData);
      setTransactions(txData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wallet');
    } finally {
      setLoading(false);
      setTransactionsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await deposit(parseFloat(amount), currency, isAdmin ? selectedUserId : undefined);
      setAmount('');
      setDepositOpen(false);
      loadWallet();
    } catch (err) {
      alert(err.response?.data?.message || 'Deposit failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      await withdraw(parseFloat(amount), currency, isAdmin ? selectedUserId : undefined);
      setAmount('');
      setWithdrawOpen(false);
      loadWallet();
    } catch (err) {
      alert(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Wallet
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Available Balance
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {wallet?.currency || 'USD'} {wallet?.availableBalance?.toFixed(2) || '0.00'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {isAdmin && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" variant="body2" gutterBottom>
                  Manage User Wallet
                </Typography>
                <FormControl fullWidth margin="normal" size="small">
                  <InputLabel>Select User</InputLabel>
                  <Select
                    value={selectedUserId}
                    label="Select User"
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    <MenuItem value=""><em>Select a user</em></MenuItem>
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, height: '100%', alignItems: 'center' }}>
                  <Button variant="contained" size="large" fullWidth onClick={() => setDepositOpen(true)} disabled={!selectedUserId}>
                    Deposit
                  </Button>
                  <Button variant="outlined" size="large" fullWidth onClick={() => setWithdrawOpen(true)} disabled={!selectedUserId}>
                    Withdraw
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Transactions
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactionsLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">No transactions yet</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx) => (
                        <TableRow key={tx.id} hover>
                          <TableCell>{tx.id}</TableCell>
                          <TableCell>{tx.transactionType}</TableCell>
                          <TableCell>{tx.symbol}</TableCell>
                          <TableCell align="right">{tx.quantity}</TableCell>
                          <TableCell align="right">${tx.price?.toFixed(2)}</TableCell>
                          <TableCell align="right">${tx.totalAmount?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={depositOpen} onClose={() => setDepositOpen(false)} disableRestoreFocus>
        <form onSubmit={handleDeposit}>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ step: '0.01', min: '0.01' }}
            />
            <TextField
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 3 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDepositOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={processing}>
              {processing ? 'Processing...' : 'Deposit'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={withdrawOpen} onClose={() => setWithdrawOpen(false)} disableRestoreFocus>
        <form onSubmit={handleWithdraw}>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ step: '0.01', min: '0.01' }}
            />
            <TextField
              label="Currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 3 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setWithdrawOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={processing}>
              {processing ? 'Processing...' : 'Withdraw'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
