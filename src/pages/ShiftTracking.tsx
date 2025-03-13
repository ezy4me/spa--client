import { Button, Typography, CircularProgress, Divider } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Stop } from "@mui/icons-material";
import {
  useCreateShiftMutation,
  useGetShiftsByUserIdQuery,
  useUpdateShiftMutation,
} from "../services/shiftApi";

const ShiftTracking = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const {
    data: shifts,
    isLoading,
    refetch,
  } = useGetShiftsByUserIdQuery(userId);

  const [createShift, { isLoading: isCreating }] = useCreateShiftMutation();
  const [updateShift] = useUpdateShiftMutation();

  const handleStartShift = async () => {
    const startTime = new Date().toISOString();
    await createShift({
      userId,
      startTime: startTime,
      endTime: startTime,
    });
    refetch();
  };

  const handleEndShift = async (shiftId: string, startTime: string) => {
    const endTime = new Date().toISOString();
    await updateShift({ id: Number(shiftId), startTime, endTime });
    refetch();
  };

  const hasActiveShift = shifts?.some(
    (shift) => shift.startTime === shift.endTime
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Работник",
      width: 180,
      valueGetter: (_, row) => row.employee.fullName,
    },
    {
      field: "location",
      headerName: "Адрес",
      width: 180,
      valueGetter: (_, row) => row.employee.location.name,
    },
    {
      field: "startTime",
      headerName: "Начало смены",
      width: 180,
      valueGetter: (_, row) => new Date(row.startTime).toLocaleString(),
    },
    {
      field: "endTime",
      headerName: "Конец смены",
      width: 180,
      valueGetter: (_, row) => {
        if (!row.endTime || row.endTime === row.startTime) {
          return " ";
        }
        return new Date(row.endTime).toLocaleString();
      },
    },
    {
      field: "actions",
      headerName: "Действия",
      type: "actions",
      width: 200,
      getActions: ({ row }) => {
        if (row.startTime === row.endTime) {
          return [
            <GridActionsCellItem
              icon={<Stop />}
              label="Завершить смену"
              onClick={() => handleEndShift(row.id, row.startTime)} 
              color="secondary"
            />,
          ];
        } else {
          return [];
        }
      },
    },
  ];

  if (isLoading) return <CircularProgress />;

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Отслеживание смен
      </Typography>
      <Divider />

      <Button
        variant="contained"
        color="primary"
        onClick={handleStartShift}
        disabled={isCreating || hasActiveShift}
        sx={{ my: 2 }}>
        {isCreating ? "Начинаем..." : "Начать смену"}
      </Button>

      <div style={{ height: '100%', width: "100%" }}>
        <DataGrid
          rows={shifts || []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default ShiftTracking;
