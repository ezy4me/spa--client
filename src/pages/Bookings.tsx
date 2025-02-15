import { useState } from "react";
import { Typography, Modal, Box, Grid } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import { CheckCircleOutline, CancelOutlined, InfoOutlined } from "@mui/icons-material";
import { useGetBookingsQuery, useUpdateBookingMutation } from "../services/bookingsApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";

const Bookings = () => {
  const { data: bookings = [], isLoading, isError } = useGetBookingsQuery();
  const [updateBooking] = useUpdateBookingMutation();
  
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);

  const handleOpen = (booking: any) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = (booking: any, status: string) => {
    setSelectedBooking(booking);
    setStatusToUpdate(status);
    setConfirmOpen(true);
  };

  const handleConfirmStatusUpdate = async () => {
    if (selectedBooking && statusToUpdate) {
      try {
        await updateBooking({ id: selectedBooking.id, status: statusToUpdate }).unwrap();
      } catch (error) {
        console.error("Ошибка обновления статуса бронирования:", error);
      } finally {
        setConfirmOpen(false);
        setSelectedBooking(null);
        setStatusToUpdate(null);
      }
    }
  };

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
          icon={<CheckCircleOutline color="success" />}
          label="Подтвердить"
          onClick={() => handleStatusChange(row, "confirmed")}
        />,
        <GridActionsCellItem
          icon={<CancelOutlined color="error" />}
          label="Отменить"
          onClick={() => handleStatusChange(row, "canceled")}
        />,
        <GridActionsCellItem
          icon={<InfoOutlined />}
          label="Подробнее"
          onClick={() => handleOpen(row)}
        />,
      ],
    },
  ];

  if (isLoading) return <Typography>Загрузка...</Typography>;
  if (isError) return <Typography>Ошибка при загрузке данных.</Typography>;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Бронирования
      </Typography>

      <DataGrid
        rows={bookings}
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

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={modalStyle}>
          <Typography id="modal-title" variant="h6" component="h2">
            Детали бронирования
          </Typography>
          <Box id="modal-description" sx={{ mt: 2 }}>
            {selectedBooking ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body1">
                    <strong>Комментарий:</strong> {selectedBooking.comment}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Статус:</strong> {selectedBooking.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Начало:</strong> {new Date(selectedBooking.startTime).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Конец:</strong> {new Date(selectedBooking.endTime).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Typography>Данные о бронировании отсутствуют.</Typography>
            )}
          </Box>
        </Box>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmStatusUpdate}
        title="Изменение статуса"
        message={`Вы уверены, что хотите изменить статус на "${statusToUpdate}"?`}
        confirmText="Подтвердить"
        cancelText="Отмена"
      />
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  maxHeight: 600,
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default Bookings;
