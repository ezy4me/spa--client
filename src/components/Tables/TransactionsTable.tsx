import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";

interface TransactionsTableProps {
  transactions: any[];
  isLoading: boolean;
  isError: boolean;
  onEdit: (transaction: any) => void;
  onDelete: (id: number) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  isError,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Название", width: 200 },
    { field: "amount", headerName: "Сумма", width: 150 },
    { field: "type", headerName: "Тип", width: 150 },
    { field: "paymentMethod", headerName: "Метод оплаты", width: 180 },
    {
      field: "client",
      headerName: "Клиент",
      width: 200,
      valueGetter: (_, row) => row.client?.fullName || "-",
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
    <div style={{ height: 400, width: "100%" }}>
      {isLoading ? (
        <Typography>Загрузка...</Typography>
      ) : isError ? (
        <Typography>Ошибка при загрузке данных.</Typography>
      ) : (
        <DataGrid
          rows={transactions}
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

export default TransactionsTable;
