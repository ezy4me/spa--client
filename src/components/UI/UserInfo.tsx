import React from "react";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetEmployeeByUserIdQuery } from "../../services/employeesApi";

const UserInfo: React.FC = () => {
  const userId = useSelector((state: any) => state.auth.user?.id); 

  const {
    data: employee,
    isLoading,
    isError,
  } = useGetEmployeeByUserIdQuery(userId, {
    skip: !userId, 
  });

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError)
    return <Typography>Ошибка загрузки данных сотрудника.</Typography>;

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      {employee && (
        <>
          <Typography variant="body2" sx={{ marginRight: 2 }}>
            {employee.fullName}
          </Typography>
          {/* <Tooltip title="Профиль">
            <Avatar
              alt={employee.fullName}
              src={`https://i.pravatar.cc/300?img=${employee.id}`}
            />
          </Tooltip> */}
        </>
      )}
    </Box>
  );
};

export default UserInfo;
