import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";

interface BookingsTableProps {
  bookings: any[];
  onEdit: (booking: any) => void;
  onDelete: (id: number) => void; // Adjusted type to number
  isLoading: boolean;
  isError: boolean;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  onEdit,
  onDelete,
  isLoading,
  isError,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "startTime",
      headerName: "Дата начала",
      width: 180,
      valueGetter: (_, row) => new Date(row.startTime).toLocaleString(),
    },
    {
      field: "endTime",
      headerName: "Дата конца",
      width: 180,
      valueGetter: (_, row) => new Date(row.endTime).toLocaleString(),
    },
    { field: "status", headerName: "Статус", width: 150 },
    { field: "comment", headerName: "Комментарий", width: 250 },
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
          onClick={() => onDelete(row.id)} // Ensure 'row.id' is a number
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
        <Typography>Ошибка загрузки.</Typography>
      ) : (
        <DataGrid
          rows={bookings}
          columns={columns}
          pageSizeOptions={[20]}
          disableRowSelectionOnClick
        />
      )}
    </div>
  );
};

export default BookingsTable;
