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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import {
  placeOrder,
  getOrders,
  cancelOrder,
  getAllMarketData,
  getMarketData,
  getOrdersByUser,
  forceCancelOrder,
} from '../api';
import { useAuth } from '../context/AuthContext';
import { getAllUsers } from '../api';

export default function Trade() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');
  const [orderType, setOrderType] = useState('BUY');
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [useMarketPrice, setUseMarketPrice] = useState(true);
  const [marketPrice, setMarketPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orders, setOrders] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    loadData();
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, selectedUserId]);

  useEffect(() => {
    let isMounted = true;
    if (useMarketPrice && symbol) {
      getMarketData(symbol.toUpperCase()).then((data) => {
        if (isMounted) {
          setMarketPrice(data.currentPrice);
        }
      }).catch(() => {
        if (isMounted) {
          setMarketPrice(null);
        }
      });
    } else {
      setMarketPrice(null);
    }
    return () => {
      isMounted = false;
    };
  }, [symbol, useMarketPrice]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, marketRes] = await Promise.all([
        isAdmin && selectedUserId ? getOrdersByUser(selectedUserId) : getOrders(),
        getAllMarketData(),
      ]);
      setOrders(ordersRes);
      setMarketData(marketRes);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load trade data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const orderPrice = useMarketPrice ? marketPrice : parseFloat(price);
      if (!orderPrice) throw new Error('Price is required');
      const res = await placeOrder(orderType, symbol.toUpperCase(), parseFloat(quantity), orderPrice);
      setSuccess(`Order placed successfully! Order ID: ${res.id}`);
      setSymbol('');
      setQuantity('');
      setPrice('');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    }
  };

  const handleForceCancelOrder = async (orderId) => {
    if (!window.confirm('Force cancel this order?')) return;
    try {
      await forceCancelOrder(orderId);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to force cancel order');
    }
  };

  if (loading && !orders.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 0 }}>
          Trading
        </Typography>
        {isAdmin && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              label="Select User"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <MenuItem value="">My Orders</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {orderType === 'BUY' ? 'Buy' : 'Sell'} Order
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Order Type</InputLabel>
                  <Select value={orderType} label="Order Type" onChange={(e) => setOrderType(e.target.value)}>
                    <MenuItem value="BUY">Buy</MenuItem>
                    <MenuItem value="SELL">Sell</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  label="Symbol"
                  fullWidth
                  margin="normal"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  required
                  placeholder="AAPL"
                />
                <FormControlLabel
                  control={<Switch checked={useMarketPrice} onChange={(e) => setUseMarketPrice(e.target.checked)} />}
                  label="Use Market Price"
                />
                {!useMarketPrice && (
                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    inputProps={{ step: '0.01', min: '0' }}
                  />
                )}
                {useMarketPrice && symbol && (
                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    Market Price: ${marketPrice ? marketPrice.toFixed(2) : 'Loading...'}
                  </Typography>
                )}
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  inputProps={{ step: '1', min: '1' }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ mt: 2 }}
                  disabled={loading}
                  color={orderType === 'BUY' ? 'primary' : 'error'}
                >
                  {loading ? 'Placing Order...' : `Place ${orderType} Order`}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.orderType}</TableCell>
                        <TableCell>{order.symbol}</TableCell>
                        <TableCell align="right">{order.quantity}</TableCell>
                        <TableCell align="right">${order.price?.toFixed(2)}</TableCell>
                        <TableCell>{order.orderStatus}</TableCell>
                        <TableCell align="center">
                          {(order.orderStatus === 'PENDING' || order.orderStatus === 'PARTIALLY_FILLED') && (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              {!isAdmin && (
                                <Button size="small" color="error" onClick={() => handleCancelOrder(order.id)}>
                                  Cancel
                                </Button>
                              )}
                              {isAdmin && (
                                <IconButton size="small" color="error" onClick={() => handleForceCancelOrder(order.id)} title="Force Cancel">
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="text.secondary">No orders found</Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
