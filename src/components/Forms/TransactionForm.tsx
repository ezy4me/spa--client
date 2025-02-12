import { useEffect, useState } from "react";
import {
  Typography,
  Modal,
  Box,
  Grid,
  Button,
  TextField,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetProductsQuery } from "../../services/productsApi";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "../../services/transactionsApi";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  transaction?: any;
  isAdding: boolean;
  onSave: (transactionData: any) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Название обязательно"),
  amount: Yup.number()
    .required("Сумма обязательна")
    .positive("Сумма должна быть положительной"),
  type: Yup.string().required("Тип обязательный"),
  paymentMethod: Yup.string().required("Метод оплаты обязателен"),
  clientId: Yup.number().required("ID клиента обязателен"),
});

const TransactionForm = ({
  open,
  onClose,
  transaction,
  isAdding,
}: TransactionFormProps) => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const { data: products = [] } = useGetProductsQuery();
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (transaction) {
      setValue("name", transaction.name);
      setValue("amount", transaction.amount);
      setValue("type", transaction.type);
      setValue("paymentMethod", transaction.paymentMethod);
      setValue("clientId", transaction.clientId);
      setSelectedProducts(transaction.transactionProducts || []);
    }
  }, [transaction, setValue]);

  const onSubmit = async (data: any) => {
    const transactionData = {
      ...data,
      transactionProducts: selectedProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    try {
      if (isAdding) {
        await createTransaction(transactionData).unwrap();
      } else {
        await updateTransaction({
          id: transaction.id,
          ...transactionData,
        }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Ошибка сохранения транзакции:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6">
          {isAdding ? "Добавление транзакции" : "Редактирование транзакции"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Сумма"
                    type="number"
                    fullWidth
                    error={!!errors.amount}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select {...field} fullWidth>
                    <MenuItem value="purchase">Покупка</MenuItem>
                    <MenuItem value="sale">Продажа</MenuItem>
                  </Select>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select {...field} fullWidth>
                    <MenuItem value="cash">Наличные</MenuItem>
                    <MenuItem value="card">Карта</MenuItem>
                  </Select>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select {...field} fullWidth>
                    {/* Assuming you have a list of clients */}
                    <MenuItem value={1}>Клиент 1</MenuItem>
                    <MenuItem value={2}>Клиент 2</MenuItem>
                  </Select>
                )}
              />
            </Grid>

            {/* Product selection */}
            <Grid item xs={12}>
              <Typography variant="h6">Продукты</Typography>
              <Select
                fullWidth
                multiple
                value={selectedProducts.map((product) => product.id)}
                onChange={(e) => {
                  const selectedProductIds = e.target.value;
                  const selectedProductsData = products.filter((product) =>
                    selectedProductIds.includes(product.id.toString())
                  );
                  setSelectedProducts(selectedProductsData);
                }}>
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <Box
            sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
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
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default TransactionForm;
