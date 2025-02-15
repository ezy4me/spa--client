import React, { ReactNode } from "react";
import { Box } from "@mui/material";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
      {children}
    </Box>
  );
};

export default AuthLayout;
