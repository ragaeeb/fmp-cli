#!/usr/bin/env bun
import inquirer from 'inquirer';

import logger from './logger.js';
import { replaceAudioFlow } from './replaceAudio.js';
import { replaceAudiosFlow } from './replaceAudios.js';
import { sliceAndMergeFlow } from './sliceAndMerge.js';

const main = async () => {
    try {
        const { choice } = await inquirer.prompt([
            {
                choices: ['Replace Audio', 'Replace All Audios In Folder', 'Slice And Merge'],
                message: 'Select operation:',
                name: 'choice',
                type: 'list',
            },
        ]);

        if (choice === 'Replace Audio') {
            const result = await replaceAudioFlow();
            logger.info(`Audio replaced. Output file: ${result}`);
        } else if (choice === 'Slice And Merge') {
            let continueProcessing = true;

            do {
                const result = await sliceAndMergeFlow();
                logger.info(`Slices merged successfully. Output file: ${result}`);

                const { repeat } = await inquirer.prompt([
                    {
                        default: false,
                        message: 'Do you want to process another file?',
                        name: 'repeat',
                        type: 'confirm',
                    },
                ]);

                continueProcessing = repeat;
            } while (continueProcessing);
        } else if (choice === 'Replace All Audios In Folder') {
            const result = await replaceAudiosFlow();
            logger.info(`Replaced all audios in directory: ${result}`);
        }
    } catch (error: any) {
        logger.error('An error occurred:', error.message);
    }
};

main();
