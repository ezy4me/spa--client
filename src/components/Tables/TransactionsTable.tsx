import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Delete, Visibility } from "@mui/icons-material";
import { Typography, Modal, Box } from "@mui/material";
import { useState } from "react";

interface TransactionsTableProps {
  transactions: any[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: number) => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
  isError,
  onDelete,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );

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
      width: 250,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<Visibility />}
          label="Просмотр"
          onClick={() => setSelectedTransaction(row)}
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

  const handleCloseModal = () => setSelectedTransaction(null);

  return (
    <div style={{ height: '100%', width: "100%" }}>
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

      <Modal open={Boolean(selectedTransaction)} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          {selectedTransaction && (
            <>
              <Typography variant="h6" gutterBottom>
                Информация о транзакции
              </Typography>
              <Typography variant="body1">
                <strong>ID:</strong> {selectedTransaction.id}
              </Typography>
              <Typography variant="body1">
                <strong>Название:</strong> {selectedTransaction.name}
              </Typography>
              <Typography variant="body1">
                <strong>Сумма:</strong> {selectedTransaction.amount} руб.
              </Typography>
              <Typography variant="body1">
                <strong>Тип:</strong> {selectedTransaction.type}
              </Typography>
              <Typography variant="body1">
                <strong>Метод оплаты:</strong>{" "}
                {selectedTransaction.paymentMethod}
              </Typography>
              <Typography variant="body1">
                <strong>Дата:</strong>{" "}
                {new Date(selectedTransaction.date).toLocaleString()}
              </Typography>
              <Typography variant="body1">
                <strong>Клиент:</strong> {selectedTransaction.client?.fullName}
              </Typography>
              <Typography variant="body1">
                <strong>Телефон клиента:</strong>{" "}
                {selectedTransaction.client?.phone}
              </Typography>
              <Typography variant="body1">
                <strong>Комментарий клиента:</strong>{" "}
                {selectedTransaction.client?.comment}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Продукты:
              </Typography>
              {selectedTransaction.TransactionProducts.map((product: any) => (
                <Typography key={product.id} variant="body1">
                  <strong>{product.product.name}</strong> (Цена: {product.price}{" "}
                  руб., Количество: {product.quantity})
                </Typography>
              ))}
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default TransactionsTable;
