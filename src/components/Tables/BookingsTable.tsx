import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: string; 
  comment: string;
}

interface BookingsTableProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
  isError: boolean;
}

const statusColors: Record<string, any> = {
  "Оплачено": "#388E3C",  
  "Резерв": "#e4d01d",    
  "Отменен": "#D32F2F",   
  "Завершен": "#1976D2",  
};

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
      field: "room",
      headerName: "Помещение",
      width: 180,
      valueGetter: (_, row) => row.room.name || "",
    },
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
    {
      field: "status",
      headerName: "Статус",
      width: 150,
      renderCell: (params: any) => (
        <Typography mt={1.7} sx={{ color: statusColors[params.value] || "black" }}>
          {params.value}
        </Typography>
      ),
    },
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
