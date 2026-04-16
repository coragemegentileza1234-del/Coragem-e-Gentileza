import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_DOCUMENT_SIZE_MB = 10;

function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");
}

export async function saveIdentityDocument(file: File): Promise<string> {
  if (!file.name) {
    throw new Error("Arquivo de identidade invalido.");
  }

  const sizeInMb = file.size / (1024 * 1024);
  if (sizeInMb > MAX_DOCUMENT_SIZE_MB) {
    throw new Error("Documento excede o limite de 10 MB.");
  }

  const uploadsDirectory = path.join(process.cwd(), "public", "uploads", "adocoes");
  await mkdir(uploadsDirectory, { recursive: true });

  const timestamp = Date.now();
  const safeFileName = sanitizeFileName(file.name);
  const uniqueFileName = `${timestamp}-${safeFileName}`;
  const absolutePath = path.join(uploadsDirectory, uniqueFileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return `/uploads/adocoes/${uniqueFileName}`;
}
