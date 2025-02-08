import { useState } from "react";
import { Typography, Modal, Box, Grid, TextField, Button } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../services/productsApi";

import ConfirmDialog from "../components/UI/ConfirmDialog";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Inventory = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    price: 0,
    stock: 0,
    category: "",
    location: "",
  });

  const handleOpen = (product: any) => {
    setSelectedProduct(product);
    setEditData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category.name,
      location: product.location.name,
    });
    setOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      try {
        const updatedProductData = {
          id: selectedProduct.id,
          name: editData.name,
          price: editData.price,
          stock: editData.stock,
          category: {
            id: selectedProduct.category.id,
            name: editData.category,
          },
          location: {
            id: selectedProduct.location.id,
            name: editData.location,
            address: selectedProduct.location.address,
          },
        };

        await updateProduct(updatedProductData).unwrap();
        handleClose();
      } catch (error) {
        console.error("Ошибка обновления продукта:", error);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (productToDelete !== null) {
      try {
        await deleteProduct(productToDelete).unwrap();
      } catch (error) {
        console.error("Ошибка удаления продукта:", error);
      } finally {
        setConfirmOpen(false);
        setProductToDelete(null);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Название", width: 200 },
    { field: "price", headerName: "Цена", width: 130 },
    { field: "stock", headerName: "На складе", width: 130 },
    {
      field: "category",
      headerName: "Категория",
      width: 180,
      valueGetter: (value, row) => row.category.name,
    },
    {
      field: "location",
      headerName: "Местоположение",
      width: 180,
      valueGetter: (value, row) => row.location.name,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 150,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Редактировать"
          onClick={() => handleOpen(row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Удалить"
          onClick={() => handleDeleteClick(row.id)}
          color="error"
        />,
      ],
    },
  ];

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError) return <Typography>Ошибка при загрузке данных.</Typography>;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Инвентарь
      </Typography>

      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
      />

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Редактирование продукта
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Название"
                fullWidth
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Цена"
                fullWidth
                type="number"
                value={editData.price}
                onChange={(e) =>
                  setEditData({ ...editData, price: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="На складе"
                fullWidth
                type="number"
                value={editData.stock}
                onChange={(e) =>
                  setEditData({ ...editData, stock: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Категория"
                fullWidth
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Местоположение"
                fullWidth
                value={editData.location}
                onChange={(e) =>
                  setEditData({ ...editData, location: e.target.value })
                }
              />
            </Grid>
          </Grid>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button variant="contained" onClick={handleUpdateProduct}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление продукта"
        message={`Вы уверены, что хотите удалить этот продукт?`}
        confirmText="Подтвердить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Inventory;
