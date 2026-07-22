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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  getWatchlists,
  createWatchlist,
  deleteWatchlist,
  addWatchlistItem,
  removeWatchlistItem,
  getMarketData,
  getAllWatchlists,
  getWatchlistsByUser,
  getAllUsers,
} from '../api';
import { useAuth } from '../context/AuthContext';

export default function Watchlist() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [addingSymbol, setAddingSymbol] = useState({ watchlistId: null, symbol: '' });
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    loadWatchlists();
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin, selectedUserId]);

  const loadWatchlists = async () => {
    setLoading(true);
    setError('');
    try {
      const data = isAdmin && selectedUserId ? await getWatchlistsByUser(selectedUserId) : await getWatchlists();
      setWatchlists(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load watchlists');
    } finally {
      setLoading(false);
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

  const handleCreateWatchlist = async (e) => {
    e.preventDefault();
    try {
      await createWatchlist(newWatchlistName);
      setNewWatchlistName('');
      setOpenCreate(false);
      loadWatchlists();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create watchlist');
    }
  };

  const handleDeleteWatchlist = async (id) => {
    if (!window.confirm('Delete this watchlist?')) return;
    try {
      await deleteWatchlist(id);
      loadWatchlists();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete watchlist');
    }
  };

  const handleAddItem = async (watchlistId) => {
    if (!addingSymbol.symbol) return;
    try {
      const marketData = await getMarketData(addingSymbol.symbol);
      await addWatchlistItem(watchlistId, addingSymbol.symbol, marketData.companyName);
      setAddingSymbol({ watchlistId: null, symbol: '' });
      loadWatchlists();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleRemoveItem = async (watchlistId, symbol) => {
    try {
      await removeWatchlistItem(watchlistId, symbol);
      loadWatchlists();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove item');
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Watchlists
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {isAdmin && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select User</InputLabel>
              <Select
                value={selectedUserId}
                label="Select User"
                onChange={(e) => setSelectedUserId(e.target.value)}
              >
                <MenuItem value="">My Watchlists</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          {(!isAdmin || !selectedUserId) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
              New Watchlist
            </Button>
          )}
        </Box>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {watchlists.length === 0 ? (
        <Alert severity="info">No watchlists created yet. Create one to get started.</Alert>
      ) : (
        <Grid container spacing={3}>
          {watchlists.map((watchlist) => (
            <Grid size={{ xs: 12, md: 6 }} key={watchlist.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {watchlist.name}
                    </Typography>
                    {(!isAdmin || !selectedUserId) && (
                      <IconButton size="small" color="error" onClick={() => handleDeleteWatchlist(watchlist.id)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                  {watchlist.items?.length === 0 ? (
                    <Typography color="text.secondary" variant="body2">No items in this watchlist</Typography>
                  ) : (
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Company</TableCell>
                            <TableCell align="center">Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {watchlist.items.map((item) => (
                            <TableRow key={item.id} hover>
                              <TableCell component="th" scope="row" fontWeight="bold">
                                {item.symbol}
                              </TableCell>
                              <TableCell>{item.companyName}</TableCell>
                              <TableCell align="center">
                                <IconButton size="small" color="error" onClick={() => handleRemoveItem(watchlist.id, item.symbol)}>
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Symbol (e.g., AAPL)"
                      value={addingSymbol.watchlistId === watchlist.id ? addingSymbol.symbol : ''}
                      onChange={(e) => setAddingSymbol({ watchlistId: watchlist.id, symbol: e.target.value.toUpperCase() })}
                      sx={{ flexGrow: 1 }}
                    />
                    <Button size="small" variant="outlined" onClick={() => handleAddItem(watchlist.id)}>
                      Add
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <form onSubmit={handleCreateWatchlist}>
          <DialogTitle>Create Watchlist</DialogTitle>
          <DialogContent>
            <TextField
              label="Watchlist Name"
              value={newWatchlistName}
              onChange={(e) => setNewWatchlistName(e.target.value)}
              fullWidth
              margin="normal"
              autoFocus
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
