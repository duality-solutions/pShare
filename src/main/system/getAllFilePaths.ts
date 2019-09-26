import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path'

export async function getAllFilePaths(filePaths: string[], visited: Set<string> | undefined = undefined): Promise<string[]> {
    if (filePaths.length === 0) {
        return [];
    }
    const visitedSet = visited || new Set<string>();
    const files: string[] = [];
    for (const pth of filePaths) {
        const normalizedPath = await fs.promises.realpath(path.normalize(pth));
        if (visitedSet.has(normalizedPath)) {
            continue;
        }
        visitedSet.add(normalizedPath);
        const pathExists = await exists(normalizedPath);
        if (!pathExists) {
            continue;
        }
        const stat: fs.Stats = await fs.promises.lstat(normalizedPath);
        if (stat.isFile()) {
            files.push(normalizedPath);
        }
        else if (stat.isDirectory()) {
            const dirContents = await fs.promises.readdir(normalizedPath);
            const dirContentsPaths = dirContents.map(p => path.join(normalizedPath, p));
            const dPaths = await getAllFilePaths(dirContentsPaths, visitedSet);
            files.push(...dPaths);
        }
    }
    return files;
}
const exists = promisify(fs.exists);
