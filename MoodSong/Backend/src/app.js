// Server ko create and config karna 

const express = require("express")
const cors = require("cors")

const app = express();
app.use(cors())
app.use(express.json())

const songs = [
    {
        id: 1,
        name: "Happy Ukulele",
        mood: "happy",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        name: "Upbeat Vibes",
        mood: "happy",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        name: "Rainy Day",
        mood: "sad",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 4,
        name: "Melancholy",
        mood: "sad",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: 5,
        name: "Chill Waves",
        mood: "neutral",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    },
    {
        id: 6,
        name: "Easy Flow",
        mood: "neutral",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
    }
]

app.get('/songs/:mood', async (req, res) => {
    const filteredSongs = songs.filter(song => song.mood === req.params.mood)

    res.status(200).json({
        message: "Songs fetched successfully",
        songs: filteredSongs
    });
});


module.exports = app