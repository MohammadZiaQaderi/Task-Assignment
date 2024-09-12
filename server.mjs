import express from 'express';
import { addTask } from './taskQueue.mjs';

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/task', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: 'user_id is required' });
    }

    try {
        await addTask(user_id);
        res.status(202).json({ message: 'Task queued successfully' });
    } catch (error) {

        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
