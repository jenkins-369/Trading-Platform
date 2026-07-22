import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as ProfitIcon,
  ShowChart as MarketIcon,
  SwapHoriz as TradeIcon,
} from '@mui/icons-material';
import { getPortfolioSummary, getAllMarketData, getOrders, getDashboardStats } from '../api';
import { useAuth } from '../context/AuthContext';
import PortfolioChart from '../components/PortfolioChart';

export default function Dashboard() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ROLE_ADMIN');
  const [summary, setSummary] = useState(null);
  const [marketData, setMarketData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (isAdmin) {
        const [statsRes, marketRes] = await Promise.all([
          getDashboardStats(),
          getAllMarketData(),
        ]);
        setDashboardStats(statsRes);
        setMarketData(marketRes);
      } else {
        const [summaryRes, marketRes, ordersRes] = await Promise.all([
          getPortfolioSummary(),
          getAllMarketData(),
          getOrders(),
        ]);
        setSummary(summaryRes);
        setMarketData(marketRes);
        setOrders(ordersRes);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
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

  const stats = isAdmin ? [
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      icon: <MoneyIcon />,
      color: 'primary.main',
    },
    {
      title: 'Total Orders',
      value: dashboardStats?.totalOrders || 0,
      icon: <TradeIcon />,
      color: 'warning.main',
    },
    {
      title: 'Total Transactions',
      value: dashboardStats?.totalTransactions || 0,
      icon: <ProfitIcon />,
      color: 'success.main',
    },
    {
      title: 'Total Wallet Balance',
      value: `$${dashboardStats?.totalWalletBalance?.toFixed(2) || '0.00'}`,
      icon: <MoneyIcon />,
      color: 'success.main',
    },
    {
      title: 'Total Watchlists',
      value: dashboardStats?.totalWatchlists || 0,
      icon: <MarketIcon />,
      color: 'info.main',
    },
    {
      title: 'Total Portfolios',
      value: dashboardStats?.totalPortfolios || 0,
      icon: <MarketIcon />,
      color: 'info.main',
    },
    {
      title: 'Trading Volume',
      value: `$${dashboardStats?.totalTradingVolume?.toFixed(2) || '0.00'}`,
      icon: <TradeIcon />,
      color: 'primary.main',
    },
    {
      title: 'Market Data',
      value: dashboardStats?.totalMarketData || 0,
      icon: <MarketIcon />,
      color: 'info.main',
    },
  ] : [
    {
      title: 'Portfolio Value',
      value: `$${summary?.totalValue?.toFixed(2) || '0.00'}`,
      icon: <MoneyIcon />,
      color: 'primary.main',
    },
    {
      title: 'Total Profit/Loss',
      value: `$${summary?.totalProfitLoss?.toFixed(2) || '0.00'}`,
      sub: `${summary?.totalProfitLossPercent?.toFixed(2) || '0.00'}%`,
      icon: <ProfitIcon />,
      color: summary?.totalProfitLoss >= 0 ? 'success.main' : 'error.main',
    },
    {
      title: 'Holdings',
      value: summary?.holdings?.length || 0,
      icon: <MarketIcon />,
      color: 'info.main',
    },
    {
      title: 'Active Orders',
      value: orders?.filter((o) => o.orderStatus === 'PENDING' || o.orderStatus === 'PARTIALLY_FILLED').length || 0,
      icon: <TradeIcon />,
      color: 'warning.main',
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" variant="body2" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight="bold" color={stat.color}>
                      {stat.value}
                    </Typography>
                    {stat.sub && (
                      <Typography variant="body2" color={stat.color}>
                        {stat.sub}
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.7 }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!isAdmin && (
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Portfolio Performance
                </Typography>
                <PortfolioChart />
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid size={{ xs: 12, md: isAdmin ? 12 : 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Overview
              </Typography>
              {marketData.slice(0, 5).map((item) => (
                <Box key={item.symbol} sx={{ py: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">{item.symbol}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.companyName}</Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="body2">${item.currentPrice?.toFixed(2)}</Typography>
                    <Typography variant="caption" color={item.change >= 0 ? 'success.main' : 'error.main'}>
                      {item.change >= 0 ? '+' : ''}{item.changePercent?.toFixed(2)}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
