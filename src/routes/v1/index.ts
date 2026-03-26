import express, { Router } from 'express';
import userRoutes from './user-routes';

const router: Router = express.Router();

router.use('/auth', userRoutes);

export default router;
