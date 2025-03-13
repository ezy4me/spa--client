import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";

const InventoryTable: React.FC<any> = ({ products, onEdit, onDelete, isLoading, isError }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Название", width: 200 },
    { field: "price", headerName: "Цена", width: 130 },
    { field: "stock", headerName: "На складе", width: 130 },
    {
      field: "category",
      headerName: "Категория",
      width: 180,
      valueGetter: (_, row) => row.category?.name || "-",
    },
    {
      field: "location",
      headerName: "Местоположение",
      width: 180,
      valueGetter: (_, row) => row.location?.name || "-",
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
    <div style={{ height: '100%', width: "100%" }}>
      {isLoading ? (
        <Typography>Загрузка...</Typography>
      ) : isError ? (
        <Typography>Ошибка при загрузке данных.</Typography>
      ) : (
        <DataGrid
          rows={products}
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

export default InventoryTable;
