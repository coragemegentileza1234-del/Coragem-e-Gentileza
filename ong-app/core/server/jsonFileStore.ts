import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

function resolveFilePath(relativePath: string): string {
  return path.join(/*turbopackIgnore: true*/ process.cwd(), relativePath);
}

export async function readJsonFile<T>(
  relativePath: string,
  fallback: T,
): Promise<T> {
  const absolutePath = resolveFilePath(relativePath);

  try {
    const rawContent = await readFile(absolutePath, "utf-8");
    return JSON.parse(rawContent) as T;
  } catch {
    return fallback;
  }
}

export async function writeJsonFile<T>(
  relativePath: string,
  content: T,
): Promise<void> {
  const absolutePath = resolveFilePath(relativePath);
  const directory = path.dirname(absolutePath);

  await mkdir(directory, { recursive: true });
  await writeFile(absolutePath, JSON.stringify(content, null, 2), "utf-8");
}
