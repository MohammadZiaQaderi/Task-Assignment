import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(new URL(import.meta.url).pathname, '../task_log.txt');

export const logTask = (user_id, timestamp) => {
    fs.appendFile(LOG_FILE, `${user_id}-task completed at-${timestamp}\n`, err => {
        if (err) console.error('Error writing to log file', err);
    });
};
