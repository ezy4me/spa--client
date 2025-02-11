import { Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";

interface ClientsTableProps {
  clients: any[];
  onEdit: (client: any) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
  isError: boolean;
}

const ClientsTable = ({ clients, onEdit, onDelete, isLoading, isError }: ClientsTableProps) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "fullName", headerName: "ФИО", width: 200 },
    { field: "phone", headerName: "Телефон", width: 150 },
    { field: "comment", headerName: "Комментарий", width: 250 },
    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 150,
      getActions: ({ row }) => [
        <GridActionsCellItem icon={<Edit />} label="Редактировать" onClick={() => onEdit(row)} />,
        <GridActionsCellItem icon={<Delete color="error" />} label="Удалить" onClick={() => onDelete(row.id)} />,
      ],
    },
  ];

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError) return <Typography>Ошибка при загрузке данных.</Typography>;

  return (
    <DataGrid
      rows={clients}
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
  );
};

export default ClientsTable;
