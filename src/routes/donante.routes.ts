import { Router } from 'express';
import * as donanteController from '../controllers/donante.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

// Todas las rutas de donantes requieren autenticación JWT
router.use(authMiddleware);

// Rutas accesibles por usuarios autenticados ('user' y 'admin')
router.get('/', donanteController.getAll);
router.get('/:id', donanteController.getById);
router.post('/', donanteController.create);
router.patch('/:id', donanteController.update);

// Eliminación restringida únicamente a usuarios con rol 'admin' (RBAC)
router.delete('/:id', requireRole('admin'), donanteController.remove);

export default router;
