import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import AuthLayout from '../../components/Layout/AuthLayout';
import LoginForm from '../../components/UI/LoginForm';

const Login: React.FC = () => {
  return (
    <AuthLayout>
      <Card sx={{ width: 400, padding: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Вход в систему
          </Typography>
          <LoginForm />
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default Login;
