import { useState } from "react";
import { Typography, Button, Divider } from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  useGetLocationsQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} from "../services/locationApi";
import LocationTable from "../components/Tables/LocationTable";
import LocationForm from "../components/Forms/LocationForm";
import ConfirmDialog from "../components/UI/ConfirmDialog";

const Locations = () => {
  const {
    data: locations = [],
    isLoading,
    isError,
    refetch,
  } = useGetLocationsQuery();
  const [createLocation] = useCreateLocationMutation();
  const [updateLocation] = useUpdateLocationMutation();
  const [deleteLocation] = useDeleteLocationMutation();

  const [openLocationForm, setOpenLocationForm] = useState(false);
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  const handleOpenLocationForm = (location: any | null) => {
    setSelectedLocation(location);
    setIsAddingLocation(!location);
    setOpenLocationForm(true);
  };

  const handleCloseLocationForm = () => {
    setOpenLocationForm(false);
  };

  const handleSaveLocation = async (locationData: {
    name: string;
    address: string;
  }) => {
    try {
      if (isAddingLocation) {
        await createLocation(locationData).unwrap();
      } else if (selectedLocation) {
        await updateLocation({
          id: selectedLocation.id,
          ...locationData,
        }).unwrap();
      }
      handleCloseLocationForm();
      refetch();
    } catch (error) {
      console.error("Ошибка сохранения локации:", error);
    }
  };

  const handleDeleteLocation = async () => {
    if (locationToDelete !== null) {
      try {
        await deleteLocation(locationToDelete).unwrap();
        refetch();
      } catch (error) {
        console.error("Ошибка удаления локации:", error);
      } finally {
        setConfirmOpen(false);
        setLocationToDelete(null);
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setLocationToDelete(id);
    setConfirmOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Управление филиалами
      </Typography>
      <Divider />
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenLocationForm(null)}
        sx={{ my: 2 }}>
        Добавить локацию
      </Button>

      <LocationTable
        locations={locations}
        onEdit={handleOpenLocationForm}
        onDelete={handleDeleteClick}
        isLoading={isLoading}
        isError={isError}
      />

      <LocationForm
        open={openLocationForm}
        onClose={handleCloseLocationForm}
        onSave={handleSaveLocation}
        location={selectedLocation}
        isAdding={isAddingLocation}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteLocation}
        title="Удаление локации"
        message="Вы уверены, что хотите удалить эту локацию?"
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};

export default Locations;
