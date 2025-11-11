import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import catalogRoutes from './routes/catalog.routes.js';
import ticketsRoutes from './routes/tickets.routes.js';
import estadosRoutes from './routes/estados.routes.js';
import asignacionesRoutes from './routes/asignaciones.routes.js';
import reportesRoutes from './routes/reportes.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    nombre: 'SGML Backend',
    version: '1.0.0',
    descripcion: 'API para el Sistema de Gestión de Mantenimiento Locativo de la Universidad Surcolombiana',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/catalogo', catalogRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/estados', estadosRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/reportes', reportesRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

export default app;
