import { useEffect } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetCategoriesQuery } from "../../services/categoryApi";
import { useGetLocationsQuery } from "../../services/locationApi";

interface InventoryFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (productData: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    locationId: number;
  }) => void;
  product?: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    locationId: number;
  };
  isAdding: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Название обязательно"),
  price: Yup.number()
    .required("Цена обязательна")
    .positive("Цена должна быть положительной"),
  stock: Yup.number()
    .required("Количество обязательно")
    .min(0, "Количество не может быть отрицательным"),
  categoryId: Yup.number().required("ID категории обязателен"),
  locationId: Yup.number().required("ID местоположения обязателен"),
});

const InventoryForm = ({
  open,
  onClose,
  onSave,
  product,
  isAdding,
}: InventoryFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { data: categories = [], isLoading: isLoadingCategories } =
    useGetCategoriesQuery();
  const { data: locations = [], isLoading: isLoadingLocations } =
    useGetLocationsQuery();

  useEffect(() => {
    if (product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("stock", product.stock);
      setValue("categoryId", product.categoryId);
      setValue("locationId", product.locationId);
    }
  }, [product, setValue]);

  const onSubmit = (data: {
    name: string;
    price: number;
    stock: number;
    categoryId: number;
    locationId: number;
  }) => {
    onSave(data);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          {isAdding ? "Добавление товара" : "Редактирование товара"}
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
                    label="Название"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Цена"
                    fullWidth
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    type="number"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Количество"
                    fullWidth
                    error={!!errors.stock}
                    helperText={errors.stock?.message}
                    type="number"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.categoryId}>
                <InputLabel>Категория</InputLabel>
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Категория">
                      {isLoadingCategories ? (
                        <MenuItem value="">Загрузка...</MenuItem>
                      ) : (
                        categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                {errors.categoryId && <span>{errors.categoryId?.message}</span>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.locationId}>
                <InputLabel>Локация</InputLabel>
                <Controller
                  name="locationId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Локация">
                      {isLoadingLocations ? (
                        <MenuItem value="">Загрузка...</MenuItem>
                      ) : (
                        locations.map((location) => (
                          <MenuItem key={location.id} value={location.id}>
                            {location.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  )}
                />
                {errors.locationId && <span>{errors.locationId?.message}</span>}
              </FormControl>
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

export default InventoryForm;
