import { useEffect } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface RoomFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (roomData: {
    name: string;
    status: string;
    locationId: number;
  }) => void;
  room?: { id: number; name: string; status: string; locationId: number };
  isAdding: boolean;
  locations: { id: number; name: string }[];
}

const validationSchema = Yup.object({
  name: Yup.string().required("Название комнаты обязательно"),
  status: Yup.string().required("Статус комнаты обязателен"),
  locationId: Yup.number().required("Локация обязательна"),
});

const RoomForm = ({
  open,
  onClose,
  onSave,
  room,
  isAdding,
  locations,
}: RoomFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (room) {
      setValue("name", room.name);
      setValue("status", room.status);
      setValue("locationId", room.locationId);
    }
  }, [room, setValue]);

  const onSubmit = (data: {
    name: string;
    status: string;
    locationId: number;
  }) => {
    onSave(data);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          {isAdding ? "Добавление комнаты" : "Редактирование комнаты"}
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
                    label="Название комнаты"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Статус"
                    select
                    fullWidth
                    error={!!errors.status}
                    helperText={errors.status?.message}>
                    <MenuItem value="Свободна">Свободна</MenuItem>
                    <MenuItem value="Зарезервирована">Зарезервирована</MenuItem>
                    <MenuItem value="Занята">Занята</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.locationId}>
                    <InputLabel>Локация</InputLabel>
                    <Select {...field} label="Локация">
                      {locations.map((location) => (
                        <MenuItem key={location.id} value={location.id}>
                          {location.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.locationId && (
                      <span style={{ color: "red" }}>
                        {errors.locationId.message}
                      </span>
                    )}
                  </FormControl>
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

export default RoomForm;
