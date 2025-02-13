import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useGetTransactionsQuery,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useCreateTransactionMutation,
} from "../services/transactionsApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import TransactionsTable from "../components/Tables/TransactionsTable";
import TransactionForm from "../components/Forms/TransactionForm";

const Payment = () => {
  const {
    data: transactions = [],
    isLoading,
    isError,
    refetch,
  } = useGetTransactionsQuery();
  const [updateTransaction] = useUpdateTransactionMutation();
  const [deleteTransaction] = useDeleteTransactionMutation();
  const [createTransaction] = useCreateTransactionMutation();

  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(
    null
  );
  const [transactionToDelete, setTransactionToDelete] = useState<number | null>(
    null
  );

  const handleOpenEdit = (transaction: any) => {
    setSelectedTransaction(transaction);
    setIsAdding(false);
    setOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedTransaction(null);
    setIsAdding(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveTransaction = async (transactionData: any) => {
    try {
      if (isAdding) {
        await createTransaction(transactionData).unwrap();
      } else if (selectedTransaction) {
        await updateTransaction({
          id: selectedTransaction.id,
          ...transactionData,
        }).unwrap();
      }
      handleClose();
      refetch();
    } catch (error) {
      console.error("Ошибка сохранения транзакции:", error);
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
        refetch();
      } catch (error) {
        console.error("Ошибка удаления транзакции:", error);
      } finally {
        setConfirmOpen(false);
        setTransactionToDelete(null);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Транзакции
      </Typography>
      <Button variant="contained" startIcon={<Add />} onClick={handleOpenAdd}>
        Добавить транзакцию
      </Button>
      <Divider sx={{ my: 2 }} />
      <TransactionsTable
        transactions={transactions}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
      />
      <TransactionForm
        open={open}
        onClose={handleClose}
        transaction={selectedTransaction}
        isAdding={isAdding}
        onSave={handleSaveTransaction}
      />
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
