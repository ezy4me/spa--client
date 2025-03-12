import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../services/categoryApi";
import CategoryTable from "../components/Tables/CategoryTable";
import CategoryForm from "../components/Forms/CategoryForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";

const Category = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch, 
  } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const handleOpenCategoryForm = (category: any | null) => {
    setSelectedCategory(category);
    setIsAddingCategory(!category);
    setOpenCategoryForm(true);
  };

  const handleCloseCategoryForm = () => {
    setOpenCategoryForm(false);
  };

  const handleSaveCategory = async (categoryData: { name: string }) => {
    try {
      if (isAddingCategory) {
        await createCategory(categoryData).unwrap();
      } else if (selectedCategory) {
        await updateCategory({
          id: selectedCategory.id,
          ...categoryData,
        }).unwrap();
      }
      handleCloseCategoryForm();
      refetch(); 
    } catch (error) {
      console.error("Ошибка сохранения категории:", error);
    }
  };

  const handleDeleteCategory = async () => {
    if (categoryToDelete !== null) {
      try {
        await deleteCategory(categoryToDelete).unwrap();
        refetch(); 
      } catch (error) {
        console.error("Ошибка удаления категории:", error);
      } finally {
        setConfirmOpen(false);
        setCategoryToDelete(null);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setCategoryToDelete(id); 
    setConfirmOpen(true); 
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Категории товаров
      </Typography>
      <Divider />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenCategoryForm(null)}
        sx={{ my: 2 }}>
        Добавить категорию
      </Button>

      <CategoryTable
        categories={categories}
        onEdit={handleOpenCategoryForm}
        onDelete={handleDeleteClick}      
        isLoading={isLoading}
        isError={isError}
      />

      <CategoryForm
        open={openCategoryForm}
        onClose={handleCloseCategoryForm}
        onSave={handleSaveCategory}
        category={selectedCategory}
        isAdding={isAddingCategory}
      />

      <ConfirmDialog
        open={confirmOpen} 
        onClose={() => setConfirmOpen(false)} 
        onConfirm={handleDeleteCategory} 
        title="Удаление категории"
        message="Вы уверены, что хотите удалить эту категорию? Это действие необратимо."
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Category;
