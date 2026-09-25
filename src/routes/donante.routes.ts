import { Router } from 'express';
import * as donanteController from '../controllers/donante.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas las rutas de donantes requieren autenticación JWT en la Semana 7
router.use(authMiddleware);

router.get('/', donanteController.getAll);
router.get('/:id', donanteController.getById);
router.post('/', donanteController.create);
router.patch('/:id', donanteController.update);
router.delete('/:id', donanteController.remove);

export default router;
