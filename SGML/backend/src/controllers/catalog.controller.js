import { fsdb } from '../utils/fsdb.js';

const CATALOG_FILE = 'catalog.json';

export async function getCatalog(req, res) {
  const data = (await fsdb.readJson(CATALOG_FILE)) ?? { sedes: [], categorias: [], prioridades: [] };
  res.json(data);
}

export async function getSedes(req, res) {
  const data = (await fsdb.readJson(CATALOG_FILE)) ?? {};
  res.json({ sedes: data.sedes ?? [] });
}

export async function getCategorias(req, res) {
  const data = (await fsdb.readJson(CATALOG_FILE)) ?? {};
  res.json({ categorias: data.categorias ?? [] });
}

export async function getPrioridades(req, res) {
  const data = (await fsdb.readJson(CATALOG_FILE)) ?? {};
  res.json({ prioridades: data.prioridades ?? [] });
}

export async function getPreventivos(req, res) {
  const data = (await fsdb.readJson(CATALOG_FILE)) ?? {};
  res.json({ preventivos: data.preventivos ?? [] });
}

export async function addCategoria(req, res) {
  const { nombre, familia, checklistBase } = req.body;

  if (!nombre || !familia) {
    return res.status(400).json({ message: 'Nombre y familia son obligatorios' });
  }

  const data = (await fsdb.readJson(CATALOG_FILE)) ?? { categorias: [], sedes: [], prioridades: [], preventivos: [] };

  const exists = data.categorias?.some((cat) => cat.nombre.toLowerCase() === nombre.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'La categoría ya existe' });
  }

  const nueva = {
    id: nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    nombre,
    familia,
    checklistBase: checklistBase ?? [],
  };

  data.categorias = [...(data.categorias ?? []), nueva];
  await fsdb.writeJson(CATALOG_FILE, data);

  res.status(201).json({ categoria: nueva });
}
