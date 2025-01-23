import { promises as fs } from 'fs';
import mime from 'mime-types';
import path from 'node:path';

export const filterMediaFiles = (paths: string[]): string[] => {
    const filteredMediaFiles: string[] = [];
    for (const filePath of paths) {
        const mimeType = mime.lookup(filePath);
        if (!mimeType) continue;

        const type = mimeType.split('/')[0];
        if (type === 'video') {
            filteredMediaFiles.push(filePath);
        }
    }
    return filteredMediaFiles;
};

export const collectVideoFiles = async (input: string): Promise<string[]> => {
    const files = await fs.readdir(input);
    const mediaFiles = filterMediaFiles(files)
        .map((file) => path.join(input, file))
        .map((file) => path.resolve(file));

    return mediaFiles;
};
