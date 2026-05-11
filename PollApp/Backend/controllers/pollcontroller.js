const pollModel = require('../models/pollModel');

const DURATION_MAP = {
    '5m':  5 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h':  60 * 60 * 1000,
    '1d':  24 * 60 * 60 * 1000,
    '7d':  7 * 24 * 60 * 60 * 1000,
};

exports.createPoll = async (req, res) => {
    try {
        const { question, options, duration } = req.body;

        const durationMs = DURATION_MAP[duration];
        if (!durationMs) {
            return res.status(400).json({ message: 'Invalid duration' });
        }

        const expiresAt = new Date(Date.now() + durationMs);

        const poll = new pollModel({
            question,
            options: options.map((text) => ({ text })),
            expiresAt,
        });

        await poll.save();
        res.status(201).json(poll);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getPollById = async (req, res) => {
    try {
        const poll = await pollModel.findById(req.params.id);   
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.votePoll = async (req, res) => {
    try {
        const poll = await pollModel.findById(req.params.id);
        if (!poll) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        if (new Date() > poll.expiresAt) {
            return res.status(400).json({ message: 'Poll has expired' });
        }

        const { optionId } = req.body;
        const option = poll.options.id(optionId);
        if (!option) {
            return res.status(400).json({ message: 'Invalid option' });
        }
        const userIP = req.ip;
        if (poll.votedIPs.includes(userIP)) {
            return res.status(400).json({ message: 'You have already voted' });
        }
        option.votes += 1;
        poll.votedIPs.push(userIP);
        await poll.save();
        res.json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
