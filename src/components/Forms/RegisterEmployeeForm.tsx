import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useRegisterMutation } from "../../services/authApi";

interface RegisterEmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const validationSchema = Yup.object({
  username: Yup.string().required("Имя пользователя обязательно"),
  password: Yup.string()
    .required("Пароль обязателен")
    .min(6, "Минимум 6 символов"),
  passwordRepeat: Yup.string()
    .oneOf([Yup.ref("password")], "Пароли должны совпадать")
    .required("Повтор пароля обязателен"),
  role: Yup.string().required("Роль обязательна"),
});

const RegisterEmployeeForm = ({
  open,
  onClose,
  onSuccess,
}: RegisterEmployeeFormProps) => {
  const [registerUser] = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordRepeat: "",
      role: "", 
    },
  });

  const onSubmit = async (data: {
    username: string;
    password: string;
    passwordRepeat: string;
    role: string;
  }) => {
    try {
      await registerUser(data).unwrap();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          Регистрация сотрудника
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Имя пользователя"
                    fullWidth
                    error={!!errors.username}
                    helperText={errors.username?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Пароль"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="passwordRepeat"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="password"
                    label="Повторите пароль"
                    fullWidth
                    error={!!errors.passwordRepeat}
                    helperText={errors.passwordRepeat?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="role"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.role}>
                    <Select {...field} value={field.value || ""}>
                      <MenuItem value="MANAGER">Менеджер</MenuItem>
                      <MenuItem value="ADMIN">Администратор</MenuItem>
                    </Select>
                    <FormHelperText>{errors.role?.message}</FormHelperText>
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, textAlign: "right" }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="contained" type="submit">
              Зарегистрировать
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

export default RegisterEmployeeForm;
