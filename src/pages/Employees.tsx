import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useCreateEmployeeMutation,
} from "../services/employeesApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import EmployeesTable from "../components/Tables/EmployeesTable";
import EmployeeForm from "../components/Forms/EmployeeForm";

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
  const [isAdding, setIsAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

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
        await updateEmployee({ id: selectedEmployee.id, ...employeeData }).unwrap();
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

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Сотрудники
      </Typography>
      <Divider />
      <Button
        variant="contained"
        startIcon={<PersonAdd />}
        onClick={handleOpenAdd}
        sx={{ my: 2 }}
      >
        Добавить сотрудника
      </Button>

      <EmployeesTable
        employees={employees}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
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
