import { useEffect } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface LocationFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (locationData: { name: string; address: string }) => void;
  location?: { id: number; name: string; address: string };
  isAdding: boolean;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Название обязательно"),
  address: Yup.string().required("Адрес обязателен"),
});

const LocationForm = ({
  open,
  onClose,
  onSave,
  location,
  isAdding,
}: LocationFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (location) {
      setValue("name", location.name);
      setValue("address", location.address);
    }
  }, [location, setValue]);

  const onSubmit = (data: { name: string; address: string }) => {
    onSave(data);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          {isAdding ? "Добавление локации" : "Редактирование локации"}
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
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Адрес"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
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

export default LocationForm;
