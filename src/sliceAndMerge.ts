import { sliceAndMerge } from 'ffmpeg-simplified';
import inquirer from 'inquirer';
import path from 'node:path';

import logger from './logger.js';

export const sliceAndMergeFlow = async (): Promise<string> => {
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

    const { timeRanges } = await inquirer.prompt([
        {
            filter: (input) => input.trim(),
            message: "Enter the time ranges (e.g., '1:00-3:00, 4:45-7:00'):",
            name: 'timeRanges',
            type: 'input',
            validate: (input) =>
                input.match(/(\d+:\d+-\d+:\d+,?\s*)+/)
                    ? true
                    : "Invalid format. Use 'start-end, start-end' format with times in minutes:seconds.",
        },
    ]);

    const ranges: string[] = timeRanges.split(',');

    const { outputFile } = await inquirer.prompt([
        {
            default: path.format({ dir: originalFile.dir, ext: originalFile.ext, name: `${originalFile.name}_sliced` }),
            filter: (input) => input.trim(),
            message: `Enter the output file name:`,
            name: 'outputFile',
            type: 'input',
            validate: (input) => (input ? true : 'Output file name is required.'),
        },
    ]);

    logger.info(`Processing ${inputFile} ranges: ${JSON.stringify(ranges)}, writing to: ${outputFile}`);

    const result = await sliceAndMerge(inputFile, outputFile, { fast: true, ranges });
    return result;
};
