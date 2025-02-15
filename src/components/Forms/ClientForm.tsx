import { useEffect } from "react";
import { Typography, Modal, Box, Grid, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface ClientFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (clientData: { fullName: string; phone: string; comment: string }) => void;
  client?: { fullName: string; phone: string; comment: string }; 
    isAdding: boolean;
}

const validationSchema = Yup.object({
  fullName: Yup.string().required("ФИО обязательно"),
  phone: Yup.string().required("Телефон обязателен").matches(/^\+?[0-9]{10,15}$/, "Неверный формат телефона"),
  comment: Yup.string().required("Комментарий обязателен"), 
});

const ClientForm = ({ open, onClose, onSave, client, isAdding }: ClientFormProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (client) {
      setValue("fullName", client.fullName);
      setValue("phone", client.phone);
      setValue("comment", client.comment || ""); 
    }
  }, [client, setValue]);

  const onSubmit = (data: { fullName: string; phone: string; comment: string }) => {
    onSave(data); 
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6">
          {isAdding ? "Добавление клиента" : "Редактирование клиента"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="ФИО"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Телефон"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="comment"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Комментарий"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.comment}
                    helperText={errors.comment?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button onClick={onClose}>Отмена</Button>
            <Button variant="contained" type="submit">
              {isAdding ? "Добавить" : "Сохранить"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
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

export default ClientForm;
