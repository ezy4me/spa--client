import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";

const statusColors: Record<string, any> = {
  "Свободна": "#388E3C",  
  "Зарезервирована": "#e4d01d",    
  "Занята": "#D32F2F",   
};


const RoomTable: React.FC<any> = ({
  rooms,
  onEdit,
  onDelete,
  isLoading,
  isError,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Название комнаты", width: 200 },
    {
      field: "status",
      headerName: "Статус",
      width: 150,
      renderCell: (params: any) => (
        <Typography
          mt={1.7}
          sx={{ color: statusColors[params.value] || "black" }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "location",
      headerName: "Локация",
      width: 200,
      valueGetter: (_, row) => row.location.name,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 200,
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
      ],
    },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {isLoading ? (
        <Typography>Загрузка...</Typography>
      ) : isError ? (
        <Typography>Ошибка при загрузке данных.</Typography>
      ) : (
        <DataGrid
          rows={rooms}
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

export default RoomTable;
