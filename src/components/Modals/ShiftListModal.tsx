import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetShiftsByUserIdQuery } from "../../services/shiftApi";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale("ru");

interface ShiftListModalProps {
  open: boolean;
  onClose: () => void;
  userId: number | null;
}

const ShiftListModal: React.FC<ShiftListModalProps> = ({
  open,
  onClose,
  userId,
}) => {
  const {
    data: shifts,
    isLoading,
    isError,
    refetch,
  } = useGetShiftsByUserIdQuery(userId!, {
    skip: !userId || !open,
  });

  useEffect(() => {
    if (open && userId) refetch();
  }, [open, userId, refetch]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Смены сотрудника</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <CircularProgress />
        ) : isError ? (
          <Typography color="error">Ошибка загрузки смен.</Typography>
        ) : !Array.isArray(shifts) || shifts.length === 0 ? (
          <Typography>Смен нет.</Typography>
        ) : (
          <TableContainer sx={{ maxHeight: 400, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Дата</TableCell>
                  <TableCell>Начало</TableCell>
                  <TableCell>Конец</TableCell>
                  <TableCell>Длительность</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shifts.map((shift) => {
                  const start = dayjs(shift.startTime);
                  const end = shift.endTime ? dayjs(shift.endTime) : null;
                  const durationText = end
                    ? dayjs.duration(end.diff(start)).humanize()
                    : "Еще идет";

                  return (
                    <TableRow key={shift.id}>
                      <TableCell>{start.format("DD.MM.YYYY")}</TableCell>
                      <TableCell>{start.format("HH:mm")}</TableCell>
                      <TableCell>{end ? end.format("HH:mm") : "—"}</TableCell>
                      <TableCell>{durationText}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShiftListModal;
