import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../services/productsApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import InventoryTable from "../components/Tables/InventoryTable";
import InventoryForm from "../components/Forms/InventoryForm";

const Inventory = () => {
  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createProduct] = useCreateProductMutation();

  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const handleOpenEdit = (product: any) => {
    setSelectedProduct(product);
    setIsAdding(false);
    setOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsAdding(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveProduct = async (productData: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    locationId: number;
  }) => {
    try {
      if (isAdding) {
        await createProduct(productData).unwrap();
      } else if (selectedProduct) {
        await updateProduct({
          id: selectedProduct.id,
          ...productData,
        }).unwrap();
      }
      handleClose();
      refetch();
    } catch (error) {
      console.error("Ошибка сохранения продукта:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete !== null) {
      try {
        await deleteProduct(productToDelete).unwrap();
        refetch();
      } catch (error) {
        console.error("Ошибка удаления продукта:", error);
      } finally {
        setConfirmOpen(false);
        setProductToDelete(null);
      }
    }
  };

  return (
    <div style={{ padding: 20}}>
      <Typography variant="h4" gutterBottom>
        Инвентарь
      </Typography>
      <Divider />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpenAdd}
        sx={{ my: 2 }}>
        Добавить продукт
      </Button>

      <InventoryTable
        products={products}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
        isError={isError}
      />

      <InventoryForm
        open={open}
        onClose={handleClose}
        onSave={handleSaveProduct}
        product={selectedProduct}
        isAdding={isAdding}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление продукта"
        message="Вы уверены, что хотите удалить этот продукт? Это действие необратимо."
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Inventory;
