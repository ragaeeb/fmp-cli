import { replaceAudio } from 'ffmpeg-simplified';
import inquirer from 'inquirer';
import path from 'node:path';

import logger from './logger.js';

export const replaceAudioFlow = async (): Promise<string> => {
    const { inputFile } = await inquirer.prompt([
        {
            filter: (input) => input.trim(),
            message: 'Enter the input media file path:',
            name: 'inputFile',
            type: 'input',
            validate: (input) => (input ? true : 'Input file is required.'),
        },
    ]);

    const originalFile = path.parse(inputFile);

    const { audioFile } = await inquirer.prompt([
        {
            default: path.format({ dir: originalFile.dir, ext: '.wav', name: originalFile.name }),
            filter: (input) => input.trim(),
            message: 'Enter the audio file path to replace the original with:',
            name: 'audioFile',
            type: 'input',
            validate: (input) => (input ? true : 'Audio file is required.'),
        },
    ]);

    const { outputFile } = await inquirer.prompt([
        {
            default: path.format({
                dir: originalFile.dir,
                ext: originalFile.ext,
                name: `${originalFile.name}_audio_replaced`,
            }),
            filter: (input) => input.trim(),
            message: `Enter the output file name:`,
            name: 'outputFile',
            type: 'input',
            validate: (input) => (input ? true : 'Output file name is required.'),
        },
    ]);

    logger.info(`Replacing ${inputFile}'s audio with ${outputFile}`);

    const result = await replaceAudio(inputFile, audioFile, outputFile);

    return result;
};
