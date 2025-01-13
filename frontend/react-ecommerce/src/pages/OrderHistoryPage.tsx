import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import api from '../utils/api';

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
  }>;
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <Typography>Loading orders...</Typography>;
  }

  if (orders.length === 0) {
    return <Typography>No orders found</Typography>;
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Order History
        </Typography>
      </Grid>

      {orders.map((order) => (
        <Grid item xs={12} key={order.id}>
          <Card>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6">
                    Order #{order.id.slice(-6)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ textAlign: 'right' }}>
                  <Chip 
                    label={order.status} 
                    color={getStatusColor(order.status) as any} 
                    variant="outlined" 
                  />
                </Grid>

                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell component="th" scope="row">
                              {product.name}
                            </TableCell>
                            <TableCell align="right">
                              ${product.price.toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <strong>Total</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>${order.totalPrice.toFixed(2)}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default OrderHistoryPage;
