import User from '../models/User.Model.js';
import bcrypt from 'bcrypt';
import fs from 'fs';

export const AuthController = {
    signup: async (req, res) => {
        const { name, email, password } = req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already registered' });
            }
            const user = new User({ name, email, password });
            await user.save();
            const token = user.generateAuthToken();
            res.status(201).json({ user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid email or password' });
            }
            const token = user.generateAuthToken();
            res.status(200).json({ user, token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    updateProfile: async (req, res) => {
        const { name } = req.body;
        const userId = req.user._id;

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (name) user.name = name;

            if (req.file) {
                if (user.avatar && fs.existsSync(user.avatar)) {
                    fs.unlinkSync(user.avatar);
                }
                user.avatar = req.file.path;
            }

            await user.save();
            res.status(200).json({ message: 'Profile updated successfully', user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}