import React from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slice/authSlice";

const schema = yup
  .object({
    username: yup.string().required("Введите имя пользователя"),
    password: yup
      .string()
      .min(6, "Минимум 6 символов")
      .required("Введите пароль"),
  })
  .required();

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const response = await login(data).unwrap();
      dispatch(
        setCredentials({
          token: response.accesToken,
          refreshToken: response.refreshToken.token,
          user: response.user,
        })
      );

      if (response.user.role === "MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error("Ошибка входа", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Имя пользователя"
            variant="outlined"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Пароль"
            type="password"
            variant="outlined"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
          />
        )}
      />

      {error && (
        <Typography color="error">
          Ошибка:
          {"data" in error &&
          typeof error.data === "object" &&
          error.data !== null
            ? (error.data as { message?: string }).message ||
              "Неизвестная ошибка"
            : "Ошибка запроса"}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}>
        {isLoading ? "Вход..." : "Войти"}
      </Button>

      <Typography variant="body2" color="textSecondary" align="center">
        Забыли пароль? <a href="/forgot-password">Восстановить</a>
      </Typography>
    </Box>
  );
};

export default LoginForm;
