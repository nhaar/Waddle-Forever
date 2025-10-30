import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { getBytes, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import * as XLSX from 'xlsx';

import { db, storage } from './firebase';
import { parseDateRanges, serializeDateRanges } from '../utils/dateRanges';
import { normalizeRecordCategory } from '../utils/recordCategory';

const MANIFEST_JSON_FILENAME = 'records.json';
const MANIFEST_SPREADSHEET_FILENAME = 'records.xlsx';
const STORAGE_FOLDER_PREFIX = 'storage';
const COLLECTION_NAME = 'roomRecords';

const SPREADSHEET_COLUMNS = [
  { key: 'idList', header: 'ID List' },
  { key: 'nameFile', header: 'Nombre' },
  { key: 'status', header: 'Estado' },
  { key: 'recordCategory', header: 'Categoría' },
  { key: 'party', header: 'Fiesta' },
  { key: 'datesJson', header: 'Fechas (JSON)' },
  { key: 'room', header: 'Sala' },
  { key: 'idRoom', header: 'ID Sala', includeInExport: false },
  { key: 'music', header: 'Música' },
  { key: 'notes', header: 'Notas' },
  { key: 'imageStoragePath', header: 'Ruta de imagen en Storage' },
  { key: 'checklistJson', header: 'Checklist (JSON)' },
  { key: 'credits', header: 'Créditos' },
  { key: 'swfType', header: 'Tipo de SWF' },
  { key: 'linkSwfStoragePath', header: 'Ruta de SWF en Storage' },
];

const DEFAULT_IMAGE_STORAGE_FOLDER = 'record-images';
const DEFAULT_SWF_STORAGE_FOLDER = 'swf-files';
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif'];
const DEFAULT_IMAGE_EXTENSION = '.jpg';
const SWF_EXTENSION = '.swf';

function sanitizeStoragePath(path) {
  if (typeof path !== 'string') {
    return '';
  }
  return path.replace(/^\/+/, '').trim();
}

function guessContentType(fileName) {
  const normalized = String(fileName || '').toLowerCase();
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (normalized.endsWith('.png')) {
    return 'image/png';
  }
  if (normalized.endsWith('.gif')) {
    return 'image/gif';
  }
  if (normalized.endsWith('.webp')) {
    return 'image/webp';
  }
  if (normalized.endsWith('.avif')) {
    return 'image/avif';
  }
  if (normalized.endsWith('.svg')) {
    return 'image/svg+xml';
  }
  if (normalized.endsWith('.swf')) {
    return 'application/x-shockwave-flash';
  }
  if (normalized.endsWith('.xlsx')) {
    return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  }
  if (normalized.endsWith('.json')) {
    return 'application/json';
  }
  if (normalized.endsWith('.txt')) {
    return 'text/plain';
  }
  return 'application/octet-stream';
}

function stripUndefined(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, entryValue]) => {
      if (entryValue === undefined) {
        return acc;
      }
      acc[key] = stripUndefined(entryValue);
      return acc;
    }, {});
  }

  return value;
}

function sanitizeStorageSegment(value) {
  if (typeof value !== 'string') {
    return 'registro';
  }

  const trimmed = value.trim();
  const sanitized = trimmed.replace(/[^\w-]/g, '_');
  return sanitized || 'registro';
}

function sanitizeAttachmentFileName(fileName, type) {
  const trimmed = typeof fileName === 'string' ? fileName.trim() : '';
  const sanitized = trimmed.replace(/[^\w.\-]/g, '_');
  const lower = sanitized.toLowerCase();

  if (type === 'image') {
    if (IMAGE_EXTENSIONS.some((extension) => lower.endsWith(extension))) {
      return sanitized || `imagen${DEFAULT_IMAGE_EXTENSION}`;
    }
    return `${sanitized || 'imagen'}${DEFAULT_IMAGE_EXTENSION}`;
  }

  if (type === 'swf') {
    if (lower.endsWith(SWF_EXTENSION)) {
      return sanitized || `archivo${SWF_EXTENSION}`;
    }
    return `${sanitized || 'archivo'}${SWF_EXTENSION}`;
  }

  return sanitized || 'archivo';
}

function normalizeIdRooms(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map((entry) => ({
      id: typeof entry?.id === 'string' ? entry.id.trim() : '',
      room: typeof entry?.room === 'string' ? entry.room.trim() : '',
    }))
    .filter((entry) => entry.id && entry.room);
}

function buildIdRoomIndex(entries) {
  const index = new Map();
  normalizeIdRooms(entries).forEach((entry) => {
    const key = entry.room.toLowerCase();
    if (!index.has(key)) {
      index.set(key, entry.id);
    }
  });
  return index;
}

function resolveIdRoomFromRoomName(roomName, index) {
  if (typeof roomName !== 'string' || !(index instanceof Map)) {
    return '';
  }

  const key = roomName.trim().toLowerCase();
  if (!key) {
    return '';
  }

  return index.get(key) ?? '';
}

function buildAttachmentSearchSegments(idList) {
  const rawId = typeof idList === 'string' ? idList.trim() : String(idList ?? '').trim();
  if (!rawId) {
    return [];
  }

  const candidates = new Set();
  candidates.add(rawId.toLowerCase());

  const replaced = rawId.replace(/[^\w-]/g, '_');
  if (replaced) {
    candidates.add(replaced.toLowerCase());
  }

  const sanitized = sanitizeStorageSegment(rawId);
  if (sanitized && sanitized.toLowerCase() !== replaced.toLowerCase()) {
    candidates.add(sanitized.toLowerCase());
  }

  return Array.from(candidates);
}

function findAutomaticAttachment(zip, record, type) {
  const searchSegments = buildAttachmentSearchSegments(record?.idList);
  if (searchSegments.length === 0) {
    return null;
  }

  const allowedExtensions = type === 'swf' ? [SWF_EXTENSION] : IMAGE_EXTENSIONS;
  const entries = Object.values(zip.files || {}).filter((entry) => entry && !entry.dir);

  const matches = entries.filter((entry) => {
    const lowerName = entry.name.toLowerCase();
    if (!lowerName.startsWith(`${STORAGE_FOLDER_PREFIX}/`)) {
      return false;
    }

    if (!allowedExtensions.some((extension) => lowerName.endsWith(extension))) {
      return false;
    }

    const pathSegments = entry.name
      .split('/')
      .slice(1, -1)
      .map((segment) => segment.toLowerCase());

    return pathSegments.some((segment) => searchSegments.includes(segment));
  });

  if (matches.length === 0) {
    return null;
  }

  if (matches.length > 1) {
    console.warn(
      `Se encontraron múltiples archivos en la carpeta del ID ${record?.idList}. Se usará el primero.`
    );
  }

  const selected = matches[0];
  const rawFileName = selected.name.split('/').pop() || '';
  const trimmedFileName = rawFileName.trim();
  const resolvedFileName =
    type === 'swf'
      ? trimmedFileName || `archivo${SWF_EXTENSION}`
      : sanitizeAttachmentFileName(trimmedFileName, type);
  const segment = sanitizeStorageSegment(record?.idList ?? '');
  const folder = type === 'swf' ? DEFAULT_SWF_STORAGE_FOLDER : DEFAULT_IMAGE_STORAGE_FOLDER;

  return {
    entry: selected,
    storagePath: `${folder}/${segment}/${resolvedFileName}`,
    fileName: resolvedFileName,
  };
}

function resolveRecordAttachments(zip, record) {
  const resolved = {
    image: null,
    swf: null,
  };

  const explicitImagePath = sanitizeStoragePath(record?.imageStoragePath ?? '');
  if (explicitImagePath) {
    const entry = zip.file(`${STORAGE_FOLDER_PREFIX}/${explicitImagePath}`);
    if (entry) {
      resolved.image = {
        entry,
        storagePath: explicitImagePath,
        fileName: explicitImagePath.split('/').pop() || '',
      };
    }
  }

  if (!resolved.image) {
    resolved.image = findAutomaticAttachment(zip, record, 'image');
  }

  const explicitSwfPath = sanitizeStoragePath(record?.linkSwf?.storagePath ?? '');
  if (explicitSwfPath) {
    const entry = zip.file(`${STORAGE_FOLDER_PREFIX}/${explicitSwfPath}`);
    if (entry) {
      resolved.swf = {
        entry,
        storagePath: explicitSwfPath,
        fileName: explicitSwfPath.split('/').pop() || '',
      };
    }
  }

  if (!resolved.swf) {
    resolved.swf = findAutomaticAttachment(zip, record, 'swf');
  }

  return resolved;
}

async function downloadStorageFile(storagePath) {
  const sanitizedPath = sanitizeStoragePath(storagePath);
  if (!sanitizedPath) {
    return null;
  }

  const fileRef = ref(storage, sanitizedPath);

  if (Platform.OS === 'web') {
    try {
      const buffer = await getBytes(fileRef);
      return {
        data: new Uint8Array(buffer),
        contentType: guessContentType(sanitizedPath),
      };
    } catch (error) {
      console.warn(`Fallo al descargar ${sanitizedPath} usando getBytes:`, error);
    }
  }

  const downloadUrl = await getDownloadURL(fileRef);
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`Download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return {
    data: new Uint8Array(arrayBuffer),
    contentType: response.headers.get('content-type') || guessContentType(sanitizedPath),
  };
}

async function uploadStorageFile(storagePath, data, explicitContentType) {
  const sanitizedPath = sanitizeStoragePath(storagePath);
  if (!sanitizedPath || !data) {
    return null;
  }

  const fileRef = ref(storage, sanitizedPath);
  const contentType = explicitContentType || guessContentType(sanitizedPath);
  await uploadBytes(fileRef, data, { contentType });
  const downloadUrl = await getDownloadURL(fileRef);
  return { url: downloadUrl, storagePath: sanitizedPath };
}

async function ensureLocalFileDataAsync(source) {
  if (!source) {
    throw new Error('No se proporcionó un archivo para importar.');
  }

  if (source.base64) {
    return { data: source.base64, isBase64: true };
  }

  const uri = source.uri || source;
  if (typeof uri !== 'string') {
    throw new Error('Ruta de archivo inválida.');
  }

  if (uri.startsWith('data:')) {
    const [, base64 = ''] = uri.split(',');
    return { data: base64, isBase64: true };
  }

  try {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && info.isDirectory === false) {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return { data: base64, isBase64: true };
    }
  } catch (error) {
    console.warn('No se pudo leer el archivo directamente, se intentará mediante fetch.', error);
  }

  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('No se pudo descargar el archivo seleccionado.');
  }
  const arrayBuffer = await response.arrayBuffer();
  return { data: arrayBuffer, isBase64: false };
}

function normalizeRecordForExport(record) {
  const normalized = {
    ...record,
    idList: String(record?.idList ?? ''),
  };

  if (!normalized.linkSwf) {
    normalized.linkSwf = null;
  }

  return stripUndefined(normalized);
}

function formatRecordForSpreadsheet(record) {
  const normalized = normalizeRecordForExport(record);
  const toCell = (value) => {
    if (value === undefined || value === null) {
      return '';
    }
    return String(value);
  };

  const dateRanges = parseDateRanges(normalized.dates ?? normalized.dateRanges);
  const serializedDates = serializeDateRanges(dateRanges);

  return {
    idList: toCell(normalized.idList),
    nameFile: toCell(normalized.nameFile),
    status: toCell(normalized.status),
    recordCategory: toCell(normalized.recordCategory),
    party: toCell(normalized.party),
    datesJson: serializedDates,
    room: toCell(normalized.room),
    idRoom: toCell(normalized.idRoom),
    music: toCell(normalized.music),
    notes: toCell(normalized.notes),
    imageStoragePath: toCell(normalized.imageStoragePath),
    checklistJson:
      Array.isArray(normalized.checklist) && normalized.checklist.length > 0
        ? JSON.stringify(normalized.checklist)
        : '',
    credits: toCell(normalized.credits),
    swfType: toCell(normalized.swfType),
    linkSwfStoragePath: toCell(normalized.linkSwf?.storagePath),
  };
}

function buildSpreadsheetData(records) {
  const exportColumns = SPREADSHEET_COLUMNS.filter((column) => column.includeInExport !== false);
  const headerRow = exportColumns.map((column) => column.header);
  const rows = records.map((record) => {
    const formatted = formatRecordForSpreadsheet(record);
    return exportColumns.map((column) => formatted[column.key] ?? '');
  });
  return [headerRow, ...rows];
}

function createSpreadsheetBufferFromRecords(records) {
  const worksheetData = buildSpreadsheetData(records);
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registros');
  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Uint8Array(arrayBuffer);
}

function parseJsonColumn(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch (error) {
    console.warn('No se pudo interpretar una columna JSON del Excel de registros:', error);
  }

  return null;
}

function buildRecordFromSpreadsheetRow(rawRow) {
  const idList = String(rawRow.idList ?? '').trim();
  if (!idList) {
    return null;
  }

  const parsedDates = parseJsonColumn(rawRow.datesJson);
  const dateRanges = parseDateRanges(parsedDates ?? rawRow.datesJson);
  const serializedDates = serializeDateRanges(dateRanges);
  const checklist = parseJsonColumn(rawRow.checklistJson);

  const linkSwfStoragePath = sanitizeStoragePath(rawRow.linkSwfStoragePath ?? '');
  const hasLinkSwf = Boolean(linkSwfStoragePath);

  return stripUndefined({
    idList,
    nameFile: rawRow.nameFile ?? '',
    status: rawRow.status ?? '',
    recordCategory: normalizeRecordCategory(rawRow.recordCategory),
    party: rawRow.party ?? '',
    dates: serializedDates,
    room: rawRow.room ?? '',
    idRoom: rawRow.idRoom ?? '',
    music: rawRow.music ?? '',
    notes: rawRow.notes ?? '',
    image: rawRow.image ?? '',
    imageStoragePath: sanitizeStoragePath(rawRow.imageStoragePath ?? ''),
    checklist: Array.isArray(checklist) ? checklist : [],
    credits: rawRow.credits ?? '',
    swfType: rawRow.swfType ?? '',
    linkSwf: hasLinkSwf
      ? stripUndefined({
          storagePath: linkSwfStoragePath,
        })
      : null,
  });
}

function parseSpreadsheetRecordsFromArrayBuffer(arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const [sheetName] = workbook.SheetNames;
  if (!sheetName) {
    throw new Error('El Excel no contiene hojas de cálculo.');
  }

  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

  if (!rows || rows.length === 0) {
    return [];
  }

  const [headerRow, ...dataRows] = rows;
  const normalizedHeaders = headerRow.map((header) => String(header ?? '').trim());

  const columnIndexByKey = SPREADSHEET_COLUMNS.reduce((acc, column) => {
    const index = normalizedHeaders.findIndex((header) => header === column.header);
    if (index >= 0) {
      acc[column.key] = index;
    }
    return acc;
  }, {});

  if (columnIndexByKey.idList === undefined) {
    throw new Error('El Excel de registros no contiene la columna "ID List".');
  }

  return dataRows
    .map((row) => {
      const rawRow = Object.entries(columnIndexByKey).reduce((acc, [key, index]) => {
        const value = row[index];
        acc[key] = value === undefined || value === null ? '' : String(value);
        return acc;
      }, {});
      return buildRecordFromSpreadsheetRow(rawRow);
    })
    .filter(Boolean);
}

function parseSpreadsheetManifestFromEntry(entry) {
  return entry.async('arraybuffer').then((arrayBuffer) => ({
    version: 1,
    records: parseSpreadsheetRecordsFromArrayBuffer(arrayBuffer),
  }));
}

function normalizeImportedRecord(record, { idRoomsIndex } = {}) {
  const idList = String(record?.idList ?? '').trim();
  if (!idList) {
    throw new Error('El registro no tiene un ID_List válido.');
  }

  const normalized = {
    ...record,
    idList,
  };

  normalized.recordCategory = normalizeRecordCategory(normalized.recordCategory);

  const explicitIdRoom = typeof normalized.idRoom === 'string' ? normalized.idRoom.trim() : '';
  if (explicitIdRoom) {
    normalized.idRoom = explicitIdRoom;
  } else {
    const resolvedIdRoom = resolveIdRoomFromRoomName(normalized.room, idRoomsIndex);
    normalized.idRoom = resolvedIdRoom;
  }

  if (!normalized.linkSwf) {
    normalized.linkSwf = null;
  }

  if (normalized.linkSwf && typeof normalized.linkSwf === 'object') {
    normalized.linkSwf = {
      url: String(normalized.linkSwf.url ?? ''),
      storagePath: sanitizeStoragePath(normalized.linkSwf.storagePath ?? ''),
      name: String(normalized.linkSwf.name ?? ''),
      size: normalized.linkSwf.size ?? undefined,
      updatedAt: normalized.linkSwf.updatedAt ?? undefined,
    };

    if (!normalized.linkSwf.url && !normalized.linkSwf.storagePath && !normalized.linkSwf.name) {
      normalized.linkSwf = null;
    }
  }

  normalized.imageStoragePath = sanitizeStoragePath(normalized.imageStoragePath ?? '');
  normalized.image = String(normalized.image ?? '');

  return stripUndefined(normalized);
}

export async function exportRoomRecordsToArchive(records, { onProgress } = {}) {
  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('No hay registros disponibles para exportar.');
  }

  const zip = new JSZip();
  const manifest = {
    version: 1,
    exportedAt: new Date().toISOString(),
    records: records.map((record) => normalizeRecordForExport(record)),
  };

  const spreadsheetBuffer = createSpreadsheetBufferFromRecords(manifest.records);
  zip.file(MANIFEST_SPREADSHEET_FILENAME, spreadsheetBuffer, {
    binary: true,
  });

  const attachments = [];

  records.forEach((record) => {
    const normalizedImagePath = sanitizeStoragePath(record?.imageStoragePath);
    if (normalizedImagePath) {
      attachments.push({
        type: 'image',
        storagePath: normalizedImagePath,
        idList: record?.idList ?? '',
      });
    }

    const swfStoragePath = sanitizeStoragePath(record?.linkSwf?.storagePath);
    if (swfStoragePath) {
      attachments.push({
        type: 'swf',
        storagePath: swfStoragePath,
        idList: record?.idList ?? '',
      });
    }
  });

  let processedAttachments = 0;
  for (const attachment of attachments) {
    try {
      onProgress?.({
        stage: 'download',
        processed: processedAttachments,
        total: attachments.length,
        attachment,
      });

      const downloaded = await downloadStorageFile(attachment.storagePath);
      if (downloaded?.data) {
        const archivePath = `${STORAGE_FOLDER_PREFIX}/${attachment.storagePath}`;
        zip.file(archivePath, downloaded.data, {
          binary: true,
        });
      }
    } catch (error) {
      console.warn(
        `No se pudo descargar el archivo ${attachment.storagePath} para el registro ${attachment.idList}:`,
        error
      );
    } finally {
      processedAttachments += 1;
      onProgress?.({
        stage: 'download',
        processed: processedAttachments,
        total: attachments.length,
        attachment,
      });
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `room-records-${timestamp}.zip`;

  let fileUri = null;
  let blob = null;

  if (Platform.OS === 'web') {
    const zipBuffer = await zip.generateAsync({ type: 'uint8array' });
    blob = new Blob([zipBuffer], { type: 'application/zip' });
  } else {
    const base64Zip = await zip.generateAsync({ type: 'base64' });
    fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    await FileSystem.writeAsStringAsync(fileUri, base64Zip, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  return {
    fileUri,
    fileName,
    blob,
    manifest,
    attachments: {
      total: attachments.length,
      processed: processedAttachments,
    },
  };
}

export async function importRoomRecordsFromArchive(source, { onProgress, idRooms } = {}) {
  const { data, isBase64 } = await ensureLocalFileDataAsync(source);
  const zip = await JSZip.loadAsync(data, { base64: isBase64 });
  const idRoomsIndex = buildIdRoomIndex(idRooms);

  let manifest;
  try {
    const spreadsheetEntry = zip.file(MANIFEST_SPREADSHEET_FILENAME);
    if (spreadsheetEntry) {
      manifest = await parseSpreadsheetManifestFromEntry(spreadsheetEntry);
    } else {
      const manifestEntry = zip.file(MANIFEST_JSON_FILENAME);
      if (!manifestEntry) {
        throw new Error('El archivo seleccionado no contiene el manifiesto de registros.');
      }

      const manifestContent = await manifestEntry.async('string');
      const parsed = JSON.parse(manifestContent);
      if (Array.isArray(parsed)) {
        manifest = { records: parsed };
      } else if (Array.isArray(parsed?.records)) {
        manifest = parsed;
      } else {
        throw new Error('Estructura de manifiesto no válida.');
      }
    }
  } catch (error) {
    throw new Error('No se pudo interpretar el manifiesto de registros.');
  }

  if (!Array.isArray(manifest?.records)) {
    throw new Error('El manifiesto de registros no contiene información válida.');
  }

  const results = {
    processed: 0,
    imported: 0,
    attachmentsUploaded: 0,
  };

  for (const rawRecord of manifest.records) {
    results.processed += 1;
    let record;

    try {
      record = normalizeImportedRecord(rawRecord, { idRoomsIndex });
    } catch (error) {
      console.warn('Registro omitido durante la importación:', error);
      continue;
    }

    onProgress?.({
      stage: 'record',
      processed: results.processed - 1,
      total: manifest.records.length,
      recordId: record.idList,
    });

    try {
      const attachments = resolveRecordAttachments(zip, record);

      if (attachments.image?.entry && attachments.image.storagePath) {
        record.imageStoragePath = attachments.image.storagePath;
        const imageData = await attachments.image.entry.async('uint8array');
        const uploaded = await uploadStorageFile(record.imageStoragePath, imageData);
        if (uploaded?.url) {
          record.image = uploaded.url;
          record.imageStoragePath = uploaded.storagePath ?? record.imageStoragePath;
          results.attachmentsUploaded += 1;
        }
      }

      if (attachments.swf?.entry && attachments.swf.storagePath) {
        if (!record.linkSwf) {
          record.linkSwf = {};
        }

        record.linkSwf = {
          ...record.linkSwf,
          storagePath: attachments.swf.storagePath,
          name: record.linkSwf?.name || attachments.swf.fileName,
        };

        const swfData = await attachments.swf.entry.async('uint8array');
        const uploaded = await uploadStorageFile(attachments.swf.storagePath, swfData);
        if (uploaded?.url) {
          record.linkSwf = {
            ...record.linkSwf,
            storagePath: uploaded.storagePath ?? attachments.swf.storagePath,
            url: uploaded.url,
          };
          results.attachmentsUploaded += 1;
        }
      }

      if (
        record.linkSwf &&
        !record.linkSwf.url &&
        !record.linkSwf.storagePath &&
        !record.linkSwf.name
      ) {
        record.linkSwf = null;
      }

      const documentRef = doc(db, COLLECTION_NAME, record.idList);
      await setDoc(documentRef, stripUndefined(record), { merge: false });
      results.imported += 1;
      onProgress?.({
        stage: 'record',
        processed: results.processed,
        total: manifest.records.length,
        recordId: record.idList,
      });
    } catch (error) {
      console.error(`No se pudo importar el registro ${record.idList}:`, error);
    }
  }

  return results;
}

export async function removeTemporaryFileAsync(fileUri) {
  if (!fileUri) {
    return;
  }

  try {
    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }
  } catch (error) {
    console.warn('No se pudo eliminar el archivo temporal:', error);
  }
}
