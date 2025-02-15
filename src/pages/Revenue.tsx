import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  useGetTotalRevenueQuery,
  useGetRevenueByProductQuery,
  useGetRevenueByCategoryQuery,
  useGetMostActiveClientsQuery,
  useGetLowStockProductsQuery,
} from "../services/revenueApi";
import {
  AttachMoney,
  ShoppingCart,
  Category,
  People,
  Storefront,
} from "@mui/icons-material";

const Revenue: React.FC = () => {
  const {
    data: totalRevenue,
    isLoading: isLoadingTotalRevenue,
    error: errorTotalRevenue,
  } = useGetTotalRevenueQuery();
  const {
    data: revenueByProduct,
    isLoading: isLoadingRevenueByProduct,
    error: errorRevenueByProduct,
  } = useGetRevenueByProductQuery();
  const {
    data: revenueByCategory,
    isLoading: isLoadingRevenueByCategory,
    error: errorRevenueByCategory,
  } = useGetRevenueByCategoryQuery();
  const {
    data: mostActiveClients,
    isLoading: isLoadingActiveClients,
    error: errorActiveClients,
  } = useGetMostActiveClientsQuery();
  const {
    data: lowStockProducts,
    isLoading: isLoadingLowStock,
    error: errorLowStock,
  } = useGetLowStockProductsQuery();

  if (
    isLoadingTotalRevenue ||
    isLoadingRevenueByProduct ||
    isLoadingRevenueByCategory ||
    isLoadingActiveClients ||
    isLoadingLowStock
  ) {
    return (
      <div className="loading-screen">
        <CircularProgress />
      </div>
    );
  }

  if (
    errorTotalRevenue ||
    errorRevenueByProduct ||
    errorRevenueByCategory ||
    errorActiveClients ||
    errorLowStock
  ) {
    return <div>Ошибка при загрузке данных</div>;
  }

  return (
    <div className="p-4">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: 200,
                justifyContent: "center",
              }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <AttachMoney
                    sx={{
                      fontSize: 30,
                      verticalAlign: "middle",
                      marginRight: 1,
                    }}
                  />
                  Выручка (30 дней)
                </Typography>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  {totalRevenue} ₽
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <ShoppingCart
                    sx={{
                      fontSize: 30,
                      verticalAlign: "middle",
                      marginRight: 1,
                    }}
                  />
                  Выручка по продуктам
                </Typography>
                <ul>
                  {revenueByProduct!.map((item) => (
                    <li key={item.name}>
                      <Typography variant="body2" color="textSecondary">
                        {item.name}: {item.totalRevenue} ₽
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <Category
                    sx={{
                      fontSize: 30,
                      verticalAlign: "middle",
                      marginRight: 1,
                    }}
                  />
                  Выручка по категориям
                </Typography>
                <ul>
                  {revenueByCategory!.map((item) => (
                    <li key={item.categoryName}>
                      <Typography variant="body2" color="textSecondary">
                        {item.categoryName}: {item.totalRevenue} ₽
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <People
                    sx={{
                      fontSize: 30,
                      verticalAlign: "middle",
                      marginRight: 1,
                    }}
                  />
                  Активные клиенты
                </Typography>
                <ul>
                  {mostActiveClients!.map((client) => (
                    <li key={client.id}>
                      <Typography variant="body2" color="textSecondary">
                        {client.fullName} ({client._count.Transaction}{" "}
                        транзакций)
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Card sx={{ minHeight: 200 }}>
              <CardContent>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  <Storefront
                    sx={{
                      fontSize: 30,
                      verticalAlign: "middle",
                      marginRight: 1,
                    }}
                  />
                  Продукты с низким запасом
                </Typography>
                <ul>
                  {lowStockProducts!.map((product) => (
                    <li key={product.id}>
                      <Typography variant="body2" color="textSecondary">
                        {product.name}: {product.stock} шт.
                      </Typography>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Revenue;
