import { startServices } from '@server/boot';
import { getRedString } from '@server/logger';
import { processVersion } from '@server/routes/versions';
import settingsManager from '@server/settings';
import { WorldServer } from '@server/socket-server/world-server';
import readline from 'node:readline/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

type Command = {
    type: 'command';
    player: string;
    command: string;
} | {
    type: 'date';
    value: string;
} | {
    type: 'mod';
    name: string;
    on: boolean;
} | {
    type: 'error';
    msg: string;
}

function parseCommand(input: string): Command {
    if (input.startsWith('c')) {
        const commandMatch = input.match(/^c\s+(.*)!(.*)/);
        if (commandMatch === null) {
            return {
                type: 'error',
                msg: 'Incorrect usage. Correct usage: c (player name)!(command)'
            }
        }
        return {
            type: 'command',
            player: commandMatch[1],
            command: commandMatch[2]
        }
    }

    if (input.startsWith('d')) {
        const dateMatch = input.match(/^d\s+(.*)/);
        if (dateMatch === null) {
            return {
                type: 'error',
                msg: 'Must supply date'
            }
        }

        const dateString = dateMatch[1];
        try {
            processVersion(dateString);
            return {
                type: 'date',
                value: dateString
            }
        } catch (error) {
            return {
                type: 'error',
                msg: 'Invalid date (format: YYYY-MM-DD)'
            }
        }
    }

    if (input.startsWith('mod')) {
        const modMatch = input.match(/^mod\s+(on|off)\s+(.*)/);
        if (modMatch === null) {
            return {
                type: 'error',
                msg: 'Invalid use. Correct usage: mod (on/off) (mod name)'
            }
        }

        return {
            type: 'mod',
            on: modMatch[1] === 'on',
            name: modMatch[2]
        };
    }

    return {
        type: 'error',
        msg: 'Unknown command'
    }
}

function log(str: string) {
    console.log(`> CLI: ${str}`);
}

function logError(str: string) {
    console.log(getRedString(`> CLI ERROR: ${str}`));
}

async function loop(world: WorldServer) {
    while (true) {
        const input = await rl.question('');
        const command = parseCommand(input);
    
        switch (command.type) {
            case 'command':
                const info = world.getAllPlayersInfo();
                const foundInfo = info.find(({ name }) => {
                    if (name.toLowerCase() === command.player.toLowerCase()) {
                        return true;
                    }
                });
                if (foundInfo === undefined) {
                    logError('User not found');
                } else {
                    const response = world.runCommand(foundInfo.id, command.command);
                    log(response);
                }
    
                break;
            case 'date':
                settingsManager.updateSettings({ version: command.value });
                world.reset();
                log('Date updated');
                break;
            case 'mod':
                if (command.on) {
                    world.mods.setModActive(command.name);
                } else {
                    world.mods.setModInactive(command.name);
                }
                break;
            case 'error':
                logError(command.msg);
                break;
        }
    }
}

async function main() {
    log('Initializing services...');
    const { world, failedMods } = await startServices();


    log('Services initialized');
    if (failedMods.length === 0) {
        log('All mods OK');
    } else {
        log('These mods did not work and have been turned off:');
        failedMods.forEach(mod => {
            log(`- ${mod}`);
        })
    }

    await loop(world);
}

main();