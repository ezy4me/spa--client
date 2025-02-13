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
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete } from "@mui/material";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetLocationsQuery } from "../../services/locationApi";
import { useGetUsersQuery } from "../../services/usersApi";

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (employeeData: {
    fullName: string;
    phone: string;
    status: string;
    userId: number;
    locationId: number;
  }) => void;
  employee?: {
    fullName: string;
    phone: string;
    status: string;
    userId: number;
    locationId: number;
  };
  isAdding: boolean;
}

const validationSchema = Yup.object({
  fullName: Yup.string().required("ФИО обязательно"),
  phone: Yup.string()
    .required("Телефон обязателен")
    .matches(/^\+?[0-9]{10,15}$/, "Неверный формат телефона"),
  status: Yup.string().required("Статус обязателен"),
  userId: Yup.number().required("ID пользователя обязателен"),
  locationId: Yup.number().required("ID локации обязателен"),
});

const EmployeeForm = ({
  open,
  onClose,
  onSave,
  employee,
  isAdding,
}: EmployeeFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const {
    data: users = [],
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useGetUsersQuery();
  const {
    data: locations = [],
    isLoading: isLocationsLoading,
    isError: isLocationsError,
  } = useGetLocationsQuery();

  useEffect(() => {
    if (employee) {
      setValue("fullName", employee.fullName);
      setValue("phone", employee.phone);
      setValue("status", employee.status);
      setValue("userId", employee.userId);
      setValue("locationId", employee.locationId);
    }
  }, [employee, setValue]);

  const onSubmit = (data: {
    fullName: string;
    phone: string;
    status: string;
    userId: number;
    locationId: number;
  }) => {
    onSave(data);
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          {isAdding ? "Добавление сотрудника" : "Редактирование сотрудника"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ФИО"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Телефон"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
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
                    <InputLabel id="status-label">Статус</InputLabel>
                    <Select {...field} labelId="status-label" label="Статус">
                      <MenuItem value="Активен">Активен</MenuItem>
                      <MenuItem value="Неактивен">Неактивен</MenuItem>
                    </Select>
                    <FormHelperText>{errors.status?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>

            {/* Поле выбора пользователя */}
            <Grid item xs={12}>
              {isUsersLoading ? (
                <CircularProgress size={24} />
              ) : isUsersError ? (
                <Typography color="error">
                  Ошибка загрузки пользователей
                </Typography>
              ) : (
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={users}
                      getOptionLabel={(option) => option.username}
                      value={
                        users.find((user) => user.id === field.value) || null
                      } // Установка дефолтного значения
                      onChange={(_, value) => field.onChange(value?.id || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Пользователь"
                          error={!!errors.userId}
                          helperText={errors.userId?.message}
                        />
                      )}
                    />
                  )}
                />
              )}
            </Grid>

            {/* Поле выбора локации */}
            <Grid item xs={12}>
              {isLocationsLoading ? (
                <CircularProgress size={24} />
              ) : isLocationsError ? (
                <Typography color="error">Ошибка загрузки локаций</Typography>
              ) : (
                <Controller
                  name="locationId"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={locations}
                      getOptionLabel={(option) => option.name}
                      value={
                        locations.find(
                          (location) => location.id === field.value
                        ) || null
                      } // Установка дефолтного значения
                      onChange={(_, value) => field.onChange(value?.id || "")}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Локация"
                          error={!!errors.locationId}
                          helperText={errors.locationId?.message}
                        />
                      )}
                    />
                  )}
                />
              )}
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
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default EmployeeForm;
