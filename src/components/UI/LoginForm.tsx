import React from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';

// Схема валидации с Yup
const schema = yup.object({
  email: yup.string().email('Некорректный email').required('Введите email'),
  password: yup.string().min(6, 'Минимум 6 символов').required('Введите пароль'),
}).required();

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: { email: string; password: string }) => {
    console.log('Авторизация:', data);
    navigate('/admin/dashboard'); // Перенаправление после входа
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Email"
            variant="outlined"
            fullWidth
            error={!!errors.email}
            helperText={errors.email?.message}
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

      <Button type="submit" variant="contained" color="primary" fullWidth>
        Войти
      </Button>
      
      <Typography variant="body2" color="textSecondary" align="center">
        Забыли пароль? <a href="/forgot-password">Восстановить</a>
      </Typography>
    </Box>
  );
};

export default LoginForm;
