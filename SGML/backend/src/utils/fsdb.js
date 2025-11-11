import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODELS_DIR = path.resolve(__dirname, '..', 'models');

async function readJson(file) {
  const filePath = path.join(MODELS_DIR, file);
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data || 'null');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

async function writeJson(file, data) {
  const filePath = path.join(MODELS_DIR, file);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data;
}

async function upsert(file, predicate, updater, initializer) {
  const data = (await readJson(file)) ?? initializer();
  const index = data.findIndex(predicate);
  const updatedItem = updater(index >= 0 ? data[index] : null);

  if (index >= 0) {
    data[index] = updatedItem;
  } else {
    data.push(updatedItem);
  }

  await writeJson(file, data);
  return updatedItem;
}

export const fsdb = {
  readJson,
  writeJson,
  upsert,
};
