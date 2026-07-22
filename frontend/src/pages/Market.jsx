import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
} from "@mui/material";
import {
  Search as SearchIcon,
  StarBorder as StarBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  getAllMarketData,
  searchMarketData,
  getWatchlists,
  addWatchlistItem,
  createMarketData,
  updateMarketData,
  deleteMarketData,
} from "../api";
import { useAuth } from "../context/AuthContext";

export default function Market() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole("ROLE_ADMIN");
  const [marketData, setMarketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [watchlists, setWatchlists] = useState([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    symbol: "",
    companyName: "",
    currentPrice: "",
    openPrice: "",
    highPrice: "",
    lowPrice: "",
    previousClose: "",
    volume: "",
    change: "",
    changePercent: "",
  });

  useEffect(() => {
    loadMarketData();
    loadWatchlists();
  }, []);

  const loadMarketData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllMarketData();
      setMarketData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load market data");
    } finally {
      setLoading(false);
    }
  };

  const loadWatchlists = async () => {
    try {
      const data = await getWatchlists();
      setWatchlists(data);
    } catch (err) {
      console.error("Failed to load watchlists", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      loadMarketData();
      return;
    }
    setLoading(true);
    try {
      const data = await searchMarketData(searchQuery);
      setMarketData(data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWatchlist = async (symbol, companyName) => {
    if (!selectedWatchlist) {
      alert("Please select a watchlist first");
      return;
    }
    try {
      await addWatchlistItem(selectedWatchlist, symbol, companyName);
      alert("Added to watchlist");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to watchlist");
    }
  };

  const resetForm = () => {
    setFormData({
      symbol: "",
      companyName: "",
      currentPrice: "",
      openPrice: "",
      highPrice: "",
      lowPrice: "",
      previousClose: "",
      volume: "",
      change: "",
      changePercent: "",
    });
    setEditingItem(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenForm(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      symbol: item.symbol,
      companyName: item.companyName || "",
      currentPrice: item.currentPrice?.toString() || "",
      openPrice: item.openPrice?.toString() || "",
      highPrice: item.highPrice?.toString() || "",
      lowPrice: item.lowPrice?.toString() || "",
      previousClose: item.previousClose?.toString() || "",
      volume: item.volume?.toString() || "",
      change: item.change?.toString() || "",
      changePercent: item.changePercent?.toString() || "",
    });
    setOpenForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      symbol: formData.symbol,
      companyName: formData.companyName,
      currentPrice: parseFloat(formData.currentPrice),
      openPrice: parseFloat(formData.openPrice),
      highPrice: parseFloat(formData.highPrice),
      lowPrice: parseFloat(formData.lowPrice),
      previousClose: parseFloat(formData.previousClose),
      volume: parseInt(formData.volume, 10),
      change: parseFloat(formData.change),
      changePercent: parseFloat(formData.changePercent),
    };

    try {
      if (editingItem) {
        await updateMarketData(editingItem.symbol, payload);
      } else {
        await createMarketData(payload);
      }
      setOpenForm(false);
      loadMarketData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save market data");
    }
  };

  const handleDelete = async (symbol) => {
    if (!window.confirm(`Delete market data for ${symbol}?`)) return;
    try {
      await deleteMarketData(symbol);
      loadMarketData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete market data");
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 0 }}>
          Market Data
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Add Market Data
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "flex-end" }}>
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{ display: "flex", gap: 2, flexGrow: 1 }}
        >
          <TextField
            label="Search Symbol or Company"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} type="submit">
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button variant="outlined" onClick={loadMarketData}>
            Reset
          </Button>
        </Box>
        <TextField
          select
          value={selectedWatchlist}
          onChange={(e) => setSelectedWatchlist(e.target.value)}
          sx={{ minWidth: 280 }}
          SelectProps={{ native: true }}
        >
          <option value="">Select Watchlist</option>
          {watchlists.map((wl) => (
            <option key={wl.id} value={wl.id}>
              {wl.name}
            </option>
          ))}
        </TextField>
      </Box>
      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Symbol</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell align="right">Current Price</TableCell>
                  <TableCell align="right">Change</TableCell>
                  <TableCell align="right">Change %</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="center">Action</TableCell>
                  {isAdmin && <TableCell align="center">Admin</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {marketData.map((item) => (
                  <TableRow key={item.symbol} hover>
                    <TableCell component="th" scope="row" fontWeight="bold">
                      {item.symbol}
                    </TableCell>
                    <TableCell>{item.companyName}</TableCell>
                    <TableCell align="right">
                      ${item.currentPrice?.toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{ color: item.change >= 0 ? "green" : "red" }}
                    >
                      {item.change >= 0 ? "+" : ""}
                      {item.change?.toFixed(2)}
                    </TableCell>
                    <TableCell
                      align="right"
                      style={{
                        color: item.changePercent >= 0 ? "green" : "red",
                      }}
                    >
                      {item.changePercent >= 0 ? "+" : ""}
                      {item.changePercent?.toFixed(2)}%
                    </TableCell>
                    <TableCell align="right">
                      {item.volume?.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleAddToWatchlist(item.symbol, item.companyName)
                        }
                        title="Add to Watchlist"
                      >
                        <StarBorderIcon />
                      </IconButton>
                    </TableCell>
                    {isAdmin && (
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(item)}
                          title="Edit"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(item.symbol)}
                          title="Delete"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? "Edit Market Data" : "Create Market Data"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              required
              disabled={!!editingItem}
            />
            <TextField
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Current Price"
                  type="number"
                  value={formData.currentPrice}
                  onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Open Price"
                  type="number"
                  value={formData.openPrice}
                  onChange={(e) => setFormData({ ...formData, openPrice: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="High Price"
                  type="number"
                  value={formData.highPrice}
                  onChange={(e) => setFormData({ ...formData, highPrice: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Low Price"
                  type="number"
                  value={formData.lowPrice}
                  onChange={(e) => setFormData({ ...formData, lowPrice: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Previous Close"
                  type="number"
                  value={formData.previousClose}
                  onChange={(e) => setFormData({ ...formData, previousClose: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Volume"
                  type="number"
                  value={formData.volume}
                  onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Change"
                  type="number"
                  value={formData.change}
                  onChange={(e) => setFormData({ ...formData, change: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Change %"
                  type="number"
                  value={formData.changePercent}
                  onChange={(e) => setFormData({ ...formData, changePercent: e.target.value })}
                  required
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
