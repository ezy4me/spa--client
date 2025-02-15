import { useEffect } from "react";
import { Typography, Modal, Box, Grid, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (categoryData: { name: string }) => void;
  category?: { name: string };
  isAdding: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Название категории обязательно"),
});

const CategoryForm = ({
  open,
  onClose,
  onSave,
  category,
  isAdding,
}: CategoryFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
    }
  }, [category, setValue]);

  const onSubmit = (data: { name: string }) => {
    onSave(data);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          {isAdding ? "Добавление категории" : "Редактирование категории"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название категории"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="contained" type="submit">
              {isAdding ? "Добавить" : "Сохранить"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

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

export default CategoryForm;
