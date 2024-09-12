import Redis from 'ioredis';
import fs from 'fs/promises';  // Using fs/promises for promise-based file operations
import path from 'path';
import moment from 'moment';

const redis = new Redis();
const RATE_LIMIT_PER_SECOND = 1;
const RATE_LIMIT_PER_MINUTE = 20;
const TASK_QUEUE = 'task_queue';
const RATE_LIMIT_PREFIX = 'rate_limit:';
const LOG_FILE = path.join(new URL(import.meta.url).pathname, '../task_log.txt');

// Function to log task completion
const logTaskToFile = async (user_id, timestamp) => {
    await fs.appendFile(LOG_FILE, `${user_id}-task completed at-${timestamp}\n`);
};

const rateLimitKey = (user_id) => `${RATE_LIMIT_PREFIX}${user_id}`;

const processTask = async (user_id) => {
    const now = moment().toISOString();
    await logTaskToFile(user_id, now);
    console.log(`${user_id}-task completed at-${Date.now()}`);
};

export const addTask = async (user_id) => {
    const key = rateLimitKey(user_id);
    
    // Check and set rate limit per second
    const secondLimitKey = `${key}:second:${moment().format('YYYY-MM-DD-HH:mm:ss')}`;
    const minuteLimitKey = `${key}:minute:${moment().format('YYYY-MM-DD-HH:mm')}`;

    const [secondCount, minuteCount] = await Promise.all([
        redis.get(secondLimitKey),
        redis.get(minuteLimitKey),
    ]);

    if (secondCount >= RATE_LIMIT_PER_SECOND || minuteCount >= RATE_LIMIT_PER_MINUTE) {
        await redis.lpush(TASK_QUEUE, JSON.stringify({ user_id }));
        return;
    }

    await redis.multi()
        .incr(secondLimitKey)
        .incr(minuteLimitKey)
        .expire(secondLimitKey, 1)
        .expire(minuteLimitKey, 60)
        .exec();

    await processTask(user_id);
};

const processQueue = async () => {
    while (true) {
        const task = await redis.rpop(TASK_QUEUE);
        if (task) {
            const { user_id } = JSON.parse(task);
            await addTask(user_id);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
};

processQueue().catch(console.error);
