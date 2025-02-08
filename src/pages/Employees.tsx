import { useState } from "react";
import { Typography, Modal, Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import {
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../services/employeesApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Employees = () => {
  const { data: employees = [], isLoading, isError } = useGetEmployeesQuery();
  const [updateEmployee] = useUpdateEmployeeMutation();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);

  const handleOpen = (employee: any) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleStatusUpdate = async (employee: any, status: string) => {
    try {
      await updateEmployee({ id: employee.id, status }).unwrap();
    } catch (error) {
      console.error("Ошибка обновления статуса сотрудника:", error);
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
      } catch (error) {
        console.error("Ошибка удаления сотрудника:", error);
      } finally {
        setConfirmOpen(false);
        setEmployeeToDelete(null);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "ФИО", width: 200 },
    { field: "phone", headerName: "Телефон", width: 150 },
    { field: "status", headerName: "Статус", width: 120 },
    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 200,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Редактировать"
          onClick={() => handleOpen(row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Удалить"
          onClick={() => handleDeleteClick(row.id)}
          color="error"
        />,
      ],
    },
  ];

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError) return <Typography>Ошибка при загрузке данных.</Typography>;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Сотрудники
      </Typography>

      <DataGrid
        rows={employees}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
      />

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Детали сотрудника
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedEmployee ? (
              <Typography>
                <strong>ФИО:</strong> {selectedEmployee.fullName}
                <br />
                <strong>Телефон:</strong> {selectedEmployee.phone}
                <br />
                <strong>Статус:</strong> {selectedEmployee.status}
              </Typography>
            ) : (
              <Typography>Данные о сотруднике отсутствуют.</Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleStatusUpdate(selectedEmployee, "Активен")}
            sx={{ mt: 2 }}>
            Сделать активным
          </Button>
        </Box>
      </Modal>

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
