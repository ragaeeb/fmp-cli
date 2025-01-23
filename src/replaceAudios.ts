import { replaceAudio } from 'ffmpeg-simplified';
import { promises as fs } from 'fs';
import inquirer from 'inquirer';
import path from 'node:path';

import { collectVideoFiles } from './io.js';
import logger from './logger.js';

type ReplacedFileToSources = Record<string, [string, string]>;

const processVideoFiles = async (videoFiles: string[]): Promise<ReplacedFileToSources> => {
    const result: ReplacedFileToSources = {};

    for (const videoPath of videoFiles) {
        const originalFile = path.parse(videoPath);

        const audioFile = path.format({
            dir: originalFile.dir,
            ext: '.wav',
            name: originalFile.name,
        });

        try {
            await fs.access(audioFile);
        } catch {
            logger.warn(`No matching audio file found for ${videoPath}. Skipping...`);
            continue;
        }

        const outputFile = path.format({
            dir: originalFile.dir,
            ext: originalFile.ext,
            name: `${originalFile.name}_audio_replaced`,
        });

        logger.info(`Replacing audio for ${videoPath} with ${audioFile}, outputting to ${outputFile}`);

        try {
            await replaceAudio(videoPath, audioFile, outputFile);
            logger.info(`Successfully replaced audio for ${videoPath}`);

            result[outputFile] = [videoPath, audioFile];
        } catch (err: any) {
            logger.error(`Failed to replace audio for ${videoPath}: ${err.message}`);
        }
    }

    return result;
};

const deleteOriginals = async (result: ReplacedFileToSources) => {
    for (const [outputFile, [originalVideo, originalAudio]] of Object.entries(result)) {
        try {
            await fs.unlink(originalVideo); // Delete original video
            logger.info(`Deleted original video: ${originalVideo}`);
            await fs.unlink(originalAudio); // Delete original audio
            logger.info(`Deleted original audio: ${originalAudio}`);
        } catch (err: any) {
            logger.error(`Failed to delete files for ${outputFile}: ${err.message}`);
        }
    }
};

export const replaceAudiosFlow = async (): Promise<string> => {
    const { inputDir } = await inquirer.prompt([
        {
            filter: (input) => input.trim(),
            message: 'Enter the input directory:',
            name: 'inputDir',
            type: 'input',
            validate: (input) => (input ? true : 'Input directory is required.'),
        },
    ]);

    const videoFiles = await collectVideoFiles(inputDir);

    logger.info(`Video files found: ${videoFiles.toString()}`);

    if (videoFiles.length === 0) {
        logger.info('No video files found in the directory.');
        return '';
    }

    logger.info(`Video files found: ${videoFiles.join(', ')}`);

    const result = await processVideoFiles(videoFiles);

    if (Object.keys(result).length > 0) {
        const { confirmDelete } = await inquirer.prompt([
            {
                default: false,
                message: `Do you want to delete the original video and audio files associated with ${Object.keys(result).toString()}?`,
                name: 'confirmDelete',
                type: 'confirm',
            },
        ]);

        if (confirmDelete) {
            await deleteOriginals(result);
        }
    }

    return inputDir;
};
