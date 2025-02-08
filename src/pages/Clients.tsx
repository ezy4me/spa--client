import { useState } from "react";
import { Typography, Modal, Box, Grid, Button, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";
import { useGetClientsQuery, useUpdateClientMutation, useDeleteClientMutation } from "../services/clientsApi";

const Clients = () => {
  const { data: clients = [], isLoading, isError } = useGetClientsQuery();
  const [updateClient] = useUpdateClientMutation();
  const [deleteClient] = useDeleteClientMutation();

  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [editData, setEditData] = useState({ fullName: "", phone: "", comment: "" });

  const handleOpen = (client: any) => {
    setSelectedClient(client);
    setEditData({ fullName: client.fullName, phone: client.phone, comment: client.comment });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };

  const handleUpdateClient = async () => {
    if (selectedClient) {
      try {
        await updateClient({ id: selectedClient.id, ...editData }).unwrap();
        handleClose();
      } catch (error) {
        console.error("Ошибка обновления клиента:", error);
      }
    }
  };

  const handleDeleteClient = async (id: number) => {
    try {
      await deleteClient(id).unwrap();
    } catch (error) {
      console.error("Ошибка удаления клиента:", error);
    }
  };

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
        <GridActionsCellItem
          icon={<Edit />}
          label="Редактировать"
          onClick={() => handleOpen(row)}
        />,
        <GridActionsCellItem
          icon={<Delete color="error" />}
          label="Удалить"
          onClick={() => handleDeleteClient(row.id)}
        />,
      ],
    },
  ];

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError) return <Typography>Ошибка при загрузке данных.</Typography>;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Клиенты
      </Typography>

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

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6">
            Редактирование клиента
          </Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="ФИО"
                fullWidth
                value={editData.fullName}
                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Телефон"
                fullWidth
                value={editData.phone}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Комментарий"
                fullWidth
                multiline
                rows={3}
                value={editData.comment}
                onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={handleClose}>Отмена</Button>
            <Button variant="contained" onClick={handleUpdateClient}>
              Сохранить
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default Clients;
