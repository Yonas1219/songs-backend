const Song = require('../models/Song');

// Create a song
exports.createSong = async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all songs
exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a song
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(song);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a song
exports.deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get statistics
exports.getStats = async (req, res) => {
  try {
    const stats = {
      totalSongs: await Song.countDocuments(),
      totalArtists: (await Song.distinct('artist')).length,
      totalAlbums: (await Song.distinct('album')).length,
      totalGenres: (await Song.distinct('genre')).length,
      songsByGenre: await Song.aggregate([
        { $group: { _id: '$genre', count: { $sum: 1 } } }
      ]),
      songsByArtist: await Song.aggregate([
        { $group: { _id: '$artist', songs: { $sum: 1 }, albums: { $addToSet: '$album' } } },
        { $project: { artist: '$_id', songs: 1, albums: { $size: '$albums' } } }
      ]),
      songsByAlbum: await Song.aggregate([
        { $group: { _id: '$album', songs: { $sum: 1 } } }
      ])
    };
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};