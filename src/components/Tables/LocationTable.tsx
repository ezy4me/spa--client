import { useState } from "react";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Edit, Delete, People } from "@mui/icons-material";
import { Typography } from "@mui/material";
import EmployeesModal from "../Modals/EmployeesModal";

const LocationTable: React.FC<any> = ({
  locations,
  onEdit,
  onDelete,
  isLoading,
  isError,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [isEmployeesModalOpen, setEmployeesModalOpen] = useState(false);

  const handleOpenEmployeesModal = (locationId: number) => {
    setSelectedLocationId(locationId);
    setEmployeesModalOpen(true);
  };

  const handleCloseEmployeesModal = () => {
    setEmployeesModalOpen(false);
    setSelectedLocationId(null);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Название", width: 200 },
    { field: "address", headerName: "Адрес", width: 250 },
    {
      field: "actions",
      type: "actions",
      headerName: "Действия",
      width: 250,
      getActions: ({ row }) => [
        <GridActionsCellItem
          icon={<People />}
          label="Сотрудники"
          onClick={() => handleOpenEmployeesModal(row.id)}
          color="info"
        />,
        <GridActionsCellItem
          icon={<Edit />}
          label="Редактировать"
          onClick={() => onEdit(row)}
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

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {isLoading ? (
        <Typography>Загрузка...</Typography>
      ) : isError ? (
        <Typography>Ошибка при загрузке данных.</Typography>
      ) : (
        <DataGrid
          rows={locations}
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

      <EmployeesModal
        open={isEmployeesModalOpen}
        onClose={handleCloseEmployeesModal}
        locationId={selectedLocationId}
      />
    </div>
  );
};

export default LocationTable;
