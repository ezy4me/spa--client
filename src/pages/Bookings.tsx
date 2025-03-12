import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useGetBookingsQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useCreateBookingMutation,
} from "../services/bookingsApi";

import ConfirmDialog from "../components/UI/ConfirmDialog";
import BookingsTable from "../components/Tables/BookingsTable";
import BookingForm from "../components/Forms/BookingForm";
import { useGetClientsQuery } from "../services/clientsApi";
import { useGetRoomsQuery } from "../services/roomApi";

const Bookings = () => {
  const {
    data: bookings = [],
    isLoading: bookingsLoading,
    isError: bookingsError,
    refetch: refetchBookings,
  } = useGetBookingsQuery();

  const [updateBooking] = useUpdateBookingMutation();
  const [deleteBooking] = useDeleteBookingMutation();
  const [createBooking] = useCreateBookingMutation();

  const {
    data: rooms = [],
    isLoading: roomsLoading,
  } = useGetRoomsQuery();

  const {
    data: clients = [],
    isLoading: clientsLoading,
  } = useGetClientsQuery();

  const [open, setOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);

  const handleOpenEdit = (booking: any) => {
    setSelectedBooking(booking);
    setIsAdding(false);
    setOpen(true);
  };

  const handleOpenAdd = () => {
    setSelectedBooking(null);
    setIsAdding(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveBooking = async (bookingData: any) => {
    try {
      const formattedData = {
        startTime: new Date(bookingData.startTime).toISOString(),
        endTime: new Date(bookingData.endTime).toISOString(),
        comment: bookingData.comment,
        status: bookingData.status,
        roomId: Number(bookingData.roomId),
        clientId: Number(bookingData.clientId),
      };

      if (isAdding) {
        await createBooking(formattedData).unwrap();
      } else if (selectedBooking) {
        await updateBooking({
          id: selectedBooking.id,
          ...formattedData,
        }).unwrap();
      }

      handleClose();
      refetchBookings();
    } catch (error) {
      console.error("Ошибка сохранения бронирования:", error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setBookingToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (bookingToDelete !== null) {
      try {
        await deleteBooking({ id: bookingToDelete }).unwrap();
        refetchBookings();
      } catch (error) {
        console.error("Ошибка удаления бронирования:", error);
      } finally {
        setConfirmOpen(false);
        setBookingToDelete(null);
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Бронирования
      </Typography>
      <Divider />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleOpenAdd}
        sx={{ my: 2 }}
        disabled={roomsLoading || clientsLoading}
      >
        Добавить бронирование
      </Button>

      <BookingsTable
        bookings={bookings}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        isLoading={bookingsLoading}
        isError={bookingsError}
      />

      <BookingForm
        open={open}
        onClose={handleClose}
        onSave={handleSaveBooking}
        booking={selectedBooking}
        isAdding={isAdding}
        rooms={rooms}
        clients={clients}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление бронирования"
        message="Вы уверены, что хотите удалить это бронирование? Это действие необратимо."
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Bookings;
