import React from "react";
import { Card, CardContent, Typography, Grid, Paper, Box } from "@mui/material";
import { useGetDashboardStatsQuery } from "../../services/dashboardApi";
import { AttachMoney, People, Storefront, Event } from "@mui/icons-material";

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <div>Загрузка...</div>;
  if (error || !data) return <div>Ошибка при загрузке данных</div>;

  const cardStyles = {
    minHeight: 200,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 2,
    borderRadius: 3,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", 
  };

  const iconSize = 40;

  const renderCard = (icon: any, title: any, value: any, color: string) => (
    <Paper elevation={3} sx={{ borderRadius: 2, backgroundColor: "white" }}>
      <Card sx={cardStyles}>
        <CardContent sx={{ textAlign: "center" }}>
          {React.cloneElement(icon, { sx: { fontSize: iconSize, color } })}
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 600, color }}>
            {value}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          {renderCard(
            <AttachMoney />,
            "Выручка (30 дней)",
            `${data.revenue} ₽`,
            "#1976D2"
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          {renderCard(
            <People />,
            "Число клиентов",
            `${data.totalClients} / ${data.clientsLast30Days}`,
            "#388E3C"
          )}
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ borderRadius: 2, backgroundColor: "white" }}>
            <Card sx={cardStyles}>
              <CardContent sx={{ textAlign: "center" }}>
                <Storefront sx={{ fontSize: iconSize, color: "#FFEB3B" }} />
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  Остатки товаров
                </Typography>
                <ul style={{ padding: 0, margin: 0, listStyle: "none", textAlign: "center" }}>
                  {data.lowStockProducts.map((product) => (
                    <li key={product.id}>
                      <Typography variant="body2" color="textSecondary" sx={{ margin: "4px 0" }}>
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
          {renderCard(
            <Event />,
            "Активные бронирования",
            data.activeBookings,
            "#FF7043"
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
