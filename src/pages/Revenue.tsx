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
  const { data: totalRevenue, isLoading: isLoadingTotalRevenue } = useGetTotalRevenueQuery();
  const { data: revenueByProduct, isLoading: isLoadingRevenueByProduct } = useGetRevenueByProductQuery();
  const { data: revenueByCategory, isLoading: isLoadingRevenueByCategory } = useGetRevenueByCategoryQuery();
  const { data: mostActiveClients, isLoading: isLoadingActiveClients } = useGetMostActiveClientsQuery();
  const { data: lowStockProducts, isLoading: isLoadingLowStock } = useGetLowStockProductsQuery();

  const isLoading = isLoadingTotalRevenue || isLoadingRevenueByProduct || isLoadingRevenueByCategory || isLoadingActiveClients || isLoadingLowStock;

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size={80} thickness={4} color="primary" />
      </div>
    );
  }

  const cards = [
    {
      title: "Выручка (30 дней)",
      icon: <AttachMoney fontSize="large" />, 
      value: `${totalRevenue} ₽`,
      bgColor: "#64B5F6", 
    },
    {
      title: "Выручка по продуктам",
      icon: <ShoppingCart fontSize="large" />,
      value: revenueByProduct?.map((item) => `${item.name}: ${item.totalRevenue} ₽`).join("\n"),
      bgColor: "#81C784", 
    },
    {
      title: "Выручка по категориям",
      icon: <Category fontSize="large" />,
      value: revenueByCategory?.map((item) => `${item.categoryName}: ${item.totalRevenue} ₽`).join("\n"),
      bgColor: "#FFB74D", 
    },
    {
      title: "Активные клиенты",
      icon: <People fontSize="large" />,
      value: mostActiveClients?.map((client) => `${client.fullName} (${client._count.Transaction} транзакций)`).join("\n"),
      bgColor: "#AB47BC", 
    },
    {
      title: "Продукты с низким запасом",
      icon: <Storefront fontSize="large" />,
      value: lowStockProducts?.map((product) => `${product.name}: ${product.stock} шт.`).join("\n"),
      bgColor: "#E57373", 
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={6} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Card sx={{ backgroundColor: card.bgColor, color: "#333", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 2, textAlign: "center" }}>
                {card.icon}
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: "#333" }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h5" whiteSpace="pre-line" sx={{ color: "#333" }}>
                    {card.value || "Нет данных"}
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Revenue;
