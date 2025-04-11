import { useState } from "react";
import { Typography, Button, Divider, Box } from "@mui/material";
import { PersonAdd, HowToReg } from "@mui/icons-material";
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
} from "../services/employeesApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import EmployeesTable from "../components/Tables/EmployeesTable";
import EmployeeForm from "../components/Forms/EmployeeForm";
import RegisterEmployeeForm from "../components/Forms/RegisterEmployeeForm";
import ShiftListModal from "../components/Modals/ShiftListModal";


const Employees = () => {
  const {
    data: employees = [],
    isLoading,
    isError,
    refetch,
  } = useGetEmployeesQuery();

  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [createEmployee] = useCreateEmployeeMutation();

  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const handleOpenEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setIsAdding(false);
    setOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedEmployee(null);
    setIsAdding(true);
    setOpen(true);
  };

  const handleOpenRegister = () => {
    setRegisterOpen(true);
  };

  const handleCloseRegister = () => {
    setRegisterOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveEmployee = async (employeeData: {
    fullName: string;
    phone: string;
    status: string;
    userId: number;
    locationId: number;
  }) => {
    try {
      if (isAdding) {
        await createEmployee(employeeData).unwrap();
      } else if (selectedEmployee) {
        await updateEmployee({
          id: selectedEmployee.id,
          ...employeeData,
        }).unwrap();
      }
      handleClose();
      refetch();
    } catch (error) {
      console.error("Ошибка сохранения сотрудника:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setEmployeeToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (employeeToDelete !== null) {
      try {
        await deleteEmployee(employeeToDelete).unwrap();
        refetch();
      } catch (error) {
        console.error("Ошибка удаления сотрудника:", error);
      } finally {
        setConfirmOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const handleViewShifts = (userId: number) => {
    setSelectedUserId(userId);
    setShiftModalOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Сотрудники
      </Typography>
      <Divider />
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleOpenAdd}>
          Добавить сотрудника
        </Button>

        <Button
          variant="outlined"
          startIcon={<HowToReg />}
          onClick={handleOpenRegister}>
          Зарегистрировать сотрудника
        </Button>
      </Box>

      <EmployeesTable
        employees={employees}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        onViewShifts={handleViewShifts} 
        isLoading={isLoading}
        isError={isError}
      />

      <EmployeeForm
        open={open}
        onClose={handleClose}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
        isAdding={isAdding}
      />

      <RegisterEmployeeForm
        open={registerOpen}
        onClose={handleCloseRegister}
        onSuccess={refetch}
      />

      <ShiftListModal
        open={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        userId={selectedUserId}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление сотрудника"
        message="Вы уверены, что хотите удалить этого сотрудника? Это действие необратимо."
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Employees;
