import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetEmployeesByLocationIdQuery } from "../../services/locationApi";

interface EmployeesModalProps {
  open: boolean;
  onClose: () => void;
  locationId: number | null;
}

const EmployeesModal: React.FC<EmployeesModalProps> = ({
  open,
  onClose,
  locationId,
}) => {
  const {
    data: employees = [],
    isLoading,
    isError,
    refetch,
  } = useGetEmployeesByLocationIdQuery(locationId!, {
    skip: !locationId || !open,
  });

  useEffect(() => {
    if (open && locationId) refetch();
  }, [open, locationId, refetch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Сотрудники локации</DialogTitle>
      <DialogContent style={{ maxHeight: "400px", overflowY: "auto" }}>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography color="error">Ошибка загрузки сотрудников.</Typography>
        ) : employees.length === 0 ? (
          <Typography>Сотрудников нет.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ФИО</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Статус</TableCell>
                  <TableCell>Логин</TableCell>
                  <TableCell>Роль</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.fullName}>
                    <TableCell>{employee.fullName}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>{employee.status}</TableCell>
                    <TableCell>{employee.user.username}</TableCell>
                    <TableCell>{employee.user.role}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeesModal;
