import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDeleteTransactionMutation } from "../../services/transactionsApi";

const TransactionsTable: React.FC<any> = ({
  transactions,
  isLoading,
  isError,
}) => {
  const [deleteTransaction] = useDeleteTransactionMutation();
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id).unwrap();
    } catch (error) {
      console.error("Ошибка удаления транзакции:", error);
    }
  };

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
          onClick={() => navigate(`/transaction/edit/${row.id}`)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="Удалить"
          onClick={() => handleDelete(row.id)}
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
