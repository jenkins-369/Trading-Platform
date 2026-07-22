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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import { getPortfolioSummary, getPortfolio, getPortfolioSummaryByUser, getPortfolioByUser, getAllUsers } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Portfolio() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');
  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedUserId]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isAdmin && selectedUserId) {
        const [summaryData, holdingsData] = await Promise.all([
          getPortfolioSummaryByUser(selectedUserId),
          getPortfolioByUser(selectedUserId),
        ]);
        setSummary(summaryData);
        setHoldings(holdingsData);
      } else {
        const [summaryData, holdingsData] = await Promise.all([
          getPortfolioSummary(),
          getPortfolio(),
        ]);
        setSummary(summaryData);
        setHoldings(holdingsData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      getAllUsers().then(setUsers).catch(console.error);
    }
  }, [isAdmin]);

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
          Portfolio
        </Typography>
        {isAdmin && (
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUserId}
              label="Select User"
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <MenuItem value="">My Portfolio</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ${summary.totalValue?.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Total Cost
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                ${summary.totalCost?.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Profit / Loss
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                {summary.totalProfitLoss >= 0 ? <TrendingUpIcon color="success" /> : <TrendingDownIcon color="error" />}
                <Typography variant="h5" fontWeight="bold" color={summary.totalProfitLoss >= 0 ? 'success.main' : 'error.main'}>
                  ${summary.totalProfitLoss?.toFixed(2)}
                </Typography>
              </Box>
              <Typography variant="body2" color={summary.totalProfitLossPercent >= 0 ? 'success.main' : 'error.main'}>
                {summary.totalProfitLossPercent >= 0 ? '+' : ''}{summary.totalProfitLossPercent?.toFixed(2)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" variant="body2" gutterBottom>
                Holdings
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {summary.holdings?.length || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Holdings
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Avg Buy Price</TableCell>
                      <TableCell align="right">Current Value</TableCell>
                      <TableCell align="right">Profit/Loss</TableCell>
                      <TableCell align="right">P/L %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {holdings.map((holding) => (
                      <TableRow key={holding.id} hover>
                        <TableCell component="th" scope="row" fontWeight="bold">
                          {holding.symbol}
                        </TableCell>
                        <TableCell align="right">{holding.quantity}</TableCell>
                        <TableCell align="right">${holding.avgBuyPrice?.toFixed(2)}</TableCell>
                        <TableCell align="right">${holding.currentValue?.toFixed(2)}</TableCell>
                        <TableCell align="right" style={{ color: holding.profitLoss >= 0 ? 'green' : 'red' }}>
                          ${holding.profitLoss?.toFixed(2)}
                        </TableCell>
                        <TableCell align="right" style={{ color: holding.profitLossPercent >= 0 ? 'green' : 'red' }}>
                          {holding.profitLossPercent >= 0 ? '+' : ''}{holding.profitLossPercent?.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {!holdings.length && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary">No holdings found</Typography>
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
