import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete, Schedule } from "@mui/icons-material";
import { Typography } from "@mui/material";

const EmployeesTable: React.FC<any> = ({
  employees,
  onEdit,
  onDelete,
  onViewShifts, 
  isLoading,
  isError,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "ФИО", width: 200 },
    { field: "phone", headerName: "Телефон", width: 150 },
    { field: "status", headerName: "Статус", width: 120 },
    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 250,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="Редактировать"
          onClick={() => onEdit(row)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Удалить"
          onClick={() => onDelete(row.id)}
          color="error"
        />,
        <GridActionsCellItem
          icon={<Schedule />}
          label="Просмотр смен"
          onClick={() => onViewShifts(row.id)}
          color="info"
        />,
      ],
    },
  ];

  return (
    <div style={{ height: '100%', width: "100%" }}>
      {isLoading ? (
        <Typography>Загрузка...</Typography>
      ) : isError ? (
        <Typography>Ошибка при загрузке данных.</Typography>
      ) : (
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
        />
      )}
    </div>
  );
};

export default EmployeesTable;
