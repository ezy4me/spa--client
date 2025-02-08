"use client";

import { useState } from "react";
import { Typography, Modal, Box, Button } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import {
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "../services/transactionsApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Payment = () => {
  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useGetTransactionsQuery();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );

  const handleOpen = (transaction: any) => {
    setSelectedTransaction(transaction);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTransaction(null);
  };

  const handleUpdate = async (transaction: any, newType: string) => {
    try {
      await updateTransaction({ id: transaction.id, type: newType }).unwrap();
    } catch (error) {
      console.error("Ошибка обновления транзакции:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setTransactionToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete !== null) {
      try {
        await deleteTransaction(transactionToDelete).unwrap();
      } catch (error) {
        console.error("Ошибка удаления транзакции:", error);
      } finally {
        setConfirmOpen(false);
        setTransactionToDelete(null);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Название", width: 200 },
    { field: "amount", headerName: "Сумма", width: 130 },
    { field: "type", headerName: "Тип", width: 120 },
    { field: "paymentMethod", headerName: "Метод оплаты", width: 150 },
    { field: "date", headerName: "Дата", width: 180 },
    {
      field: "clientName",
      headerName: "Клиент",
      width: 200,
      valueGetter: (_, row) => (row.client ? row.client.fullName : null),
    },
    {
      field: "clientPhone",
      headerName: "Телефон",
      width: 150,
      valueGetter: (_, row) => (row.client ? row.client.phone : null),
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
        Транзакции
      </Typography>

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
        getRowId={(row) => row.id}
      />

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Детали транзакции
          </Typography>
          <Box sx={{ mt: 2 }}>
            {selectedTransaction ? (
              <>
                <Typography>
                  <strong>Название:</strong> {selectedTransaction.name}
                </Typography>
                <Typography>
                  <strong>Сумма:</strong> {selectedTransaction.amount}
                </Typography>
                <Typography>
                  <strong>Тип:</strong> {selectedTransaction.type}
                </Typography>
                <Typography>
                  <strong>Метод оплаты:</strong>{" "}
                  {selectedTransaction.paymentMethod}
                </Typography>
                <Typography>
                  <strong>Дата:</strong> {selectedTransaction.date}
                </Typography>
                {selectedTransaction.client && (
                  <>
                    <Typography sx={{ mt: 2 }}>
                      <strong>Клиент:</strong>{" "}
                      {selectedTransaction.client.fullName}
                    </Typography>
                    <Typography>
                      <strong>Телефон:</strong>{" "}
                      {selectedTransaction.client.phone}
                    </Typography>
                    <Typography>
                      <strong>Комментарий:</strong>{" "}
                      {selectedTransaction.client.comment}
                    </Typography>
                  </>
                )}
              </>
            ) : (
              <Typography>Данные о транзакции отсутствуют.</Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdate(selectedTransaction, "Изменено")}
            sx={{ mt: 2 }}>
            Обновить статус
          </Button>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление транзакции"
        message="Вы уверены, что хотите удалить эту транзакцию? Это действие необратимо."
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Payment;
