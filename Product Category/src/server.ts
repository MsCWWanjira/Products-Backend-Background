import express, { json } from 'express';
import bodyParser from 'body-parser';
import categoryRouter from './Routes/categoryRoutes';
import productRouter from './Routes/productRoutes';
import authRouter from './Routes/authRoutes';

let app = express();
app.use(bodyParser.json());

// app.use(bodyParser.json());
app.use(express.json());

app.use('/category', categoryRouter);
app.use('/products', productRouter);
app.use('/auth', authRouter);

app.listen(4000, () => {
    console.laog('Server is running well...');
});