import { useEffect, useState } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  TextField,
  Autocomplete,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (bookingData: any) => void;
  booking?: any;
  isAdding: boolean;
  rooms: any[];
  clients: any[];
}

const validationSchema = Yup.object({
  comment: Yup.string().required("Комментарий обязателен"),
  startTime: Yup.string().required("Дата начала обязательна"),
  endTime: Yup.string().required("Дата окончания обязательна"),
  roomId: Yup.string().required("Комната обязательна"),
  clientId: Yup.string().required("Клиент обязателен"),
  status: Yup.string().required("Статус обязателен"),
});

const BookingForm = ({
  open,
  onClose,
  onSave,
  booking,
  isAdding,
  rooms,
  clients,
}: BookingFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  useEffect(() => {
    if (booking) {
      const formatDate = (date: string) => {
        if (!date) return "";
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setValue("comment", booking.comment || "");
      setValue("status", booking.status || "");
      setValue("startTime", formatDate(booking.startTime));
      setValue("endTime", formatDate(booking.endTime));

      const room = rooms.find((room) => room.id === booking.roomId);
      const client = clients.find((client) => client.id === booking.clientId);

      setSelectedRoom(room);
      setSelectedClient(client);

      setValue("roomId", room?.id || "");
      setValue("clientId", client?.id || "");
    }
  }, [booking, rooms, clients, setValue]);

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      roomId: selectedRoom?.id,
      clientId: selectedClient?.id,
    };
    onSave(formattedData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh",
          overflow: "auto",
        }}>
        <Typography variant="h6">
          {isAdding ? "Добавление бронирования" : "Редактирование бронирования"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Комментарий"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.comment}
                    helperText={errors.comment?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Дата начала"
                    fullWidth
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.startTime}
                    helperText={errors.startTime?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Дата конца"
                    fullWidth
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.endTime}
                    helperText={errors.endTime?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="roomId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={rooms}
                    getOptionLabel={(option) => option.name}
                    value={selectedRoom}
                    onChange={(_, newValue) => {
                      setSelectedRoom(newValue);
                      setValue("roomId", newValue?.id || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Комната"
                        error={!!errors.roomId}
                        helperText={errors.roomId?.message}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={clients}
                    getOptionLabel={(option) => option.fullName}
                    value={selectedClient}
                    onChange={(_, newValue) => {
                      setSelectedClient(newValue);
                      setValue("clientId", newValue?.id || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Клиент"
                        error={!!errors.clientId}
                        helperText={errors.clientId?.message}
                      />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.status}>
                    <InputLabel>Статус</InputLabel>
                    <Select {...field} label="Статус">
                      <MenuItem value="Оплачено">Оплачено</MenuItem>
                      <MenuItem value="Резерв">Резерв</MenuItem>
                      <MenuItem value="Отменен">Отменен</MenuItem>
                      <MenuItem value="Завершен">Завершен</MenuItem>
                    </Select>
                    {errors.status && (
                      <span style={{ color: "red" }}>
                        {errors.status?.message}
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

export default BookingForm;
