import { useState } from "react";
import { Typography, Button } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import {
  useGetClientsQuery,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useCreateClientMutation,
} from "../services/clientsApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";
import ClientForm from "../components/Forms/ClientForm";
import ClientsTable from "../components/Tables/ClientsTable";

const Clients = () => {
  const { data: clients = [], isLoading, isError, refetch } = useGetClientsQuery();
  const [updateClient] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();
  const [createClient] = useCreateClientMutation();

  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const handleOpenEdit = (client: any) => {
    setSelectedClient(client);
    setIsAdding(false);
    setOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedClient(null);
    setIsAdding(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClient = async (clientData: { fullName: string; phone: string; comment: string }) => {
    try {
      if (isAdding) {
        await createClient(clientData).unwrap();
      } else if (selectedClient) {
        await updateClient({ id: selectedClient.id, ...clientData }).unwrap();
      }
      handleClose();
      refetch(); 
    } catch (error) {
      console.error("Ошибка сохранения клиента:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setClientToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (clientToDelete !== null) {
      try {
        await deleteClient(clientToDelete).unwrap();
        refetch(); 
      } catch (error) {
        console.error("Ошибка удаления клиента:", error);
      } finally {
        setConfirmOpen(false);
        setClientToDelete(null);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Клиенты
      </Typography>
      <Button
        variant="contained"
        startIcon={<PersonAdd />}
        onClick={handleOpenAdd}
        sx={{ mb: 2 }}>
        Добавить клиента
      </Button>

      <ClientsTable
        clients={clients}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
        isError={isError}
      />

      <ClientForm
        open={open}
        onClose={handleClose}
        onSave={handleSaveClient}
        client={selectedClient}
        isAdding={isAdding}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление клиента"
        message="Вы уверены?"
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Clients;
