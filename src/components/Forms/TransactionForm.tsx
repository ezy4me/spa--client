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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useGetProductsQuery } from "../../services/productsApi";
import { useGetClientsQuery } from "../../services/clientsApi";
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
  type: Yup.string().required("Тип обязателен"),
  paymentMethod: Yup.string().required("Метод оплаты обязателен"),
  clientId: Yup.number().required("Выберите клиента"),
  date: Yup.string().required("Дата обязательна"),
  amount: Yup.number().min(0, "Сумма не может быть отрицательной"),
  additionalAmount: Yup.number().min(
    0,
    "Дополнительная сумма не может быть отрицательной"
  ),
});

const formatDateToISOString = (date: Date) => {
  return (
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split(".")[0] + "Z"
  );
};

const TransactionForm = ({
  open,
  onClose,
  transaction,
  isAdding,
}: TransactionFormProps) => {
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
  const { data: products = [] } = useGetProductsQuery();
  const { data: clients = [] } = useGetClientsQuery();
  const [createTransaction] = useCreateTransactionMutation();
  const [updateTransaction] = useUpdateTransactionMutation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      date: formatDateToISOString(new Date()),
      additionalAmount: 0,
    },
  });

  useEffect(() => {
    if (transaction) {
      setValue("name", transaction.name);
      setValue("type", transaction.type);
      setValue("paymentMethod", transaction.paymentMethod);
      setValue("clientId", transaction.clientId);
      setValue("date", formatDateToISOString(new Date(transaction.date)));
      setValue("additionalAmount", transaction.additionalAmount || 0);
      setSelectedProducts(transaction.transactionProducts || []);
    }
  }, [transaction, setValue]);

  const totalAmount =
    selectedProducts.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    ) + (parseFloat(getValues("additionalAmount")?.toString() || "0") || 0);

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { id: "", name: "", quantity: 1, price: 0 },
    ]);
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };

    if (field === "id") {
      const product = products.find((p) => p.id === value);
      if (product) {
        updatedProducts[index].name = product.name;
        updatedProducts[index].price = product.price;
      }
    }
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: any) => {
    const { additionalAmount, ...transactionData } = data;
    console.log(additionalAmount);
    const transactionDataWithProducts = {
      ...transactionData,
      date: formatDateToISOString(new Date(data.date)),
      amount: totalAmount,
      transactionProducts: selectedProducts.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    };

    try {
      if (isAdding) {
        await createTransaction(transactionDataWithProducts).unwrap();
      } else {
        await updateTransaction({
          id: transaction.id,
          ...transactionDataWithProducts,
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
        <Typography variant="h6" gutterBottom>
          {isAdding ? "Добавление транзакции" : "Редактирование транзакции"}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="datetime-local"
                    fullWidth
                    error={!!errors.date}
                    helperText={errors.date?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    error={!!errors.type}
                    displayEmpty>
                    <MenuItem value="purchase">Покупка</MenuItem>
                    <MenuItem value="sale">Продажа</MenuItem>
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    error={!!errors.paymentMethod}
                    displayEmpty>
                    <MenuItem value="cash">Наличные</MenuItem>
                    <MenuItem value="card">Карта</MenuItem>
                  </Select>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="clientId"
                control={control}
                render={() => (
                  <Autocomplete
                    options={clients}
                    getOptionLabel={(option) => option.fullName}
                    onChange={(_, newValue) =>
                      setValue("clientId", newValue ? newValue.id : "")
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Выберите клиента"
                        fullWidth
                        error={!!errors.clientId}
                        helperText={errors.clientId?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="additionalAmount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Дополнительная сумма"
                    fullWidth
                    type="number"
                    error={!!errors.additionalAmount}
                    helperText={errors.additionalAmount?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Продукты
              </Typography>
              <Button
                onClick={handleAddProduct}
                variant="outlined"
                sx={{ mb: 2 }}>
                Добавить товар
              </Button>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Товар</TableCell>
                      <TableCell>Количество</TableCell>
                      <TableCell>Цена</TableCell>
                      <TableCell>Удалить</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedProducts.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            fullWidth
                            value={product.id}
                            onChange={(e) =>
                              handleProductChange(index, "id", e.target.value)
                            }>
                            {products.map((p) => (
                              <MenuItem key={p.id} value={p.id}>
                                {p.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={product.quantity}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "quantity",
                                Number(e.target.value)
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={product.price}
                            onChange={(e) =>
                              handleProductChange(
                                index,
                                "price",
                                Number(e.target.value)
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleRemoveProduct(index)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Итоговая сумма */}
            <Grid item xs={12} sm={6}>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Итоговая сумма: {totalAmount.toFixed(2)} руб.
              </Typography>
            </Grid>
          </Grid>
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            {isAdding ? "Добавить" : "Сохранить"}
          </Button>
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
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default TransactionForm;
