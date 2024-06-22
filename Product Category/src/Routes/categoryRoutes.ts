import { Router } from 'express';
import { addCategory, deleteCategory, getCategories, getCategoryById } from '../Controllers/categoryController';

const categoryRouter = Router();
categoryRouter.post('', addCategory);
categoryRouter.get('', getCategories);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;