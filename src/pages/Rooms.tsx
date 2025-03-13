import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useGetRoomsQuery,
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
} from "../services/roomApi";
import RoomTable from "../components/Tables/RoomTable";
import RoomForm from "../components/Forms/RoomForm";
import { useGetLocationsQuery } from "../services/locationApi";
import ConfirmDialog from "../components/UI/ConfirmDialog";

const Rooms = () => {
  const { data: rooms = [], isLoading, isError, refetch } = useGetRoomsQuery();
  const { data: locations = [] } = useGetLocationsQuery();
  const [createRoom] = useCreateRoomMutation();
  const [updateRoom] = useUpdateRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const [openRoomForm, setOpenRoomForm] = useState(false);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null);

  const handleOpenRoomForm = (room: any | null) => {
    setSelectedRoom(room);
    setIsAddingRoom(!room);
    setOpenRoomForm(true);
  };

  const handleCloseRoomForm = () => {
    setOpenRoomForm(false);
  };

  const handleSaveRoom = async (roomData: {
    name: string;
    status: string;
    locationId: number;
  }) => {
    try {
      if (isAddingRoom) {
        await createRoom(roomData).unwrap(); 
      } else if (selectedRoom) {
        await updateRoom({ id: selectedRoom.id, ...roomData }).unwrap();
      }
      handleCloseRoomForm();
      refetch();
    } catch (error) {
      console.error("Ошибка сохранения комнаты:", error);
    }
  };

  const handleDeleteRoom = async () => {
    if (roomToDelete !== null) {
      try {
        await deleteRoom(roomToDelete).unwrap();
        refetch();
      } catch (error) {
        console.error("Ошибка удаления комнаты:", error);
      } finally {
        setConfirmOpen(false);
        setRoomToDelete(null);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setRoomToDelete(id);
    setConfirmOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Управление комнатами
      </Typography>
      <Divider />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenRoomForm(null)}
        sx={{ my: 2 }}>
        Добавить комнату
      </Button>

      <RoomTable
        rooms={rooms}
        onEdit={handleOpenRoomForm}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
        isError={isError}
      />

      <RoomForm
        open={openRoomForm}
        onClose={handleCloseRoomForm}
        onSave={handleSaveRoom}
        room={selectedRoom}
        isAdding={isAddingRoom}
        locations={locations}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteRoom}
        title="Удаление комнаты"
        message="Вы уверены, что хотите удалить эту комнату? Это действие необратимо."
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Rooms;
