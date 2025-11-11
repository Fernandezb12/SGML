import http from 'http';
import app from './src/app.js';
import { findAvailablePort } from './src/utils/port.js';

const DEFAULT_PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  try {
    const port = await findAvailablePort(DEFAULT_PORT);

    if (port !== DEFAULT_PORT) {
      console.warn(
        `⚠️  El puerto ${DEFAULT_PORT} está en uso. ` +
          `Se utilizará automáticamente el puerto disponible ${port}.\n` +
          '   • Define PORT antes de ejecutar si prefieres un puerto fijo.\n' +
          '   • O libera el puerto 3000 si estaba ocupado por otro proceso.'
      );
    }

    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`SGML backend escuchando en http://localhost:${port}`);
    });

    server.on('error', (error) => {
      console.error('Error inesperado del servidor:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor SGML:', error.message);
    process.exit(1);
  }
}

bootstrap();
