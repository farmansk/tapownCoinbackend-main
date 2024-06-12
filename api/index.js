

import {Router} from 'express';
const app = Router();
import User from '../models/User.js';

app.get("/",(req,res)=>{
    res.send("hello")
})


app.get("/users/chekifjoind", async (req, res) => {
    const { chatId, userId } = req.body;
    try {
        const chatMember = await bot.getChatMember(chatId, userId);
        return res.json({ user: chatMember.status !== 'left' && chatMember.status !== 'kicked' })
    } catch (error) {
        console.error('Error checking user membership:', error);
        return res.json({ error });
    }

});
app.get('/top-players', async (req, res) => {
    try {
        const topPlayers = await User.find().sort({ own_coins: -1 }).limit(50);
        const formattedData = topPlayers.map(player => ({
            rank: topPlayers.indexOf(player) + 1,
            telegram_username: player.username,
            own_tokens: player.own_coins
        }));
        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching top players:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get("/getTotalUSers", async () => {

    try {
        const count = await User.countDocuments();
        return { count };
    } catch (error) {
        console.error('Error getting users count:', error);
        return res.json({ error });
    }

})

app.post('/users', async (req, res) => {
    const { username, user_id, own_coins } = req.body;

    const newUser = new User({ username, user_id, own_coins });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user coins
app.patch('/users/:id/coins', async (req, res) => {
    const { coins } = req.body;
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.own_coins = coins;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// getCoins
app.get('/users/getCoins/:id', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ coins: user.own_coins });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Check if a mission is completed
app.get('/users/:id/missions/:mission_id/completed', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const mission = user.missions.find(m => m.mission_id === req.params.mission_id);
        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        res.json({ completed: mission.completed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark a mission as completed
app.patch('/users/:id/missions/:mission_id/completed', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const mission = user.missions.find(m => m.mission_id === req.params.mission_id);
        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        mission.completed = true;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark reward as claimed
app.patch('/users/:id/missions/:mission_id/reward', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const mission = user.missions.find(m => m.mission_id === req.params.mission_id);
        if (!mission) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        if (!mission.completed) {
            return res.status(400).json({ error: 'Mission not completed' });
        }
        mission.reward_claimed = true;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check if user joined a group (dummy function)
app.get('/users/:id/joinedGroup', async (req, res) => {
    try {
        const user = await User.findOne({ user_id: req.params.id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Dummy implementation, replace with actual group check
        const joinedGroup = true; // Or logic to check if user joined a group
        res.json({ joinedGroup });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default app;
