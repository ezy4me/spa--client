import React from "react";
import { Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import { useGetDashboardStatsQuery } from "../../services/dashboardApi";

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error || !data) return <div>Ошибка при загрузке данных</div>;

  return (
    <div className="p-4">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Выручка (30 дней)
                </Typography>
                <Typography variant="h4" color="primary">
                  {data.revenue} ₽
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Число клиентов
                </Typography>
                <Typography variant="h4" color="primary">
                  {data.totalClients} / {data.clientsLast30Days}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Остатки товаров
                </Typography>
                <ul>
                  {data.lowStockProducts.map((product) => (
                    <li key={product.id}>
                      <Typography variant="body2" color="textSecondary">
                        {product.name}: {product.stock}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Активные бронирования
                </Typography>
                <Typography variant="h4" color="primary">
                  {data.activeBookings}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
