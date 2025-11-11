import net from 'net';

/**
 * Attempts to find an available TCP port starting from the provided base.
 * The search is linear and synchronous to keep the startup experience
 * deterministic for CLI users running `npm start` locally.
 *
 * @param {number} basePort - Preferred port defined by the user (e.g. 3000).
 * @param {number} [maxAttempts=10] - Maximum increments to try before failing.
 * @returns {Promise<number>} Resolves with the first free port.
 */
export async function findAvailablePort(basePort, maxAttempts = 10) {
  let attempts = 0;
  let portToTry = basePort;

  while (attempts <= maxAttempts) {
    // eslint-disable-next-line no-await-in-loop
    const isFree = await checkPort(portToTry);
    if (isFree) {
      return portToTry;
    }

    attempts += 1;
    portToTry += 1;
  }

  throw new Error(
    `No se encontró un puerto disponible a partir del ${basePort}. ` +
      `Libera el puerto o define manualmente la variable de entorno PORT.`
  );
}

function checkPort(port) {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
          resolve(false);
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        tester
          .once('close', () => resolve(true))
          .close();
      })
      .listen(port, '0.0.0.0');
  });
}

