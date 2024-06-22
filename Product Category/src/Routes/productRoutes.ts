import { Router } from 'express';
import {
    addNewProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from '../Controllers/productController';
import { verifyToken } from '../Middlewares/middlewares';

const productRouter = Router();

productRouter.post('', addNewProduct);
productRouter.get('', verifyToken, getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.patch('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);

export default productRouter;