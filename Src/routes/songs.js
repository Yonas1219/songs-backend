const express = require('express');
const router = express.Router();
const {
  createSong,
  getAllSongs,
  updateSong,
  deleteSong,
  getStats
} = require('../controllers/songs');

router.post('/', createSong);
router.get('/', getAllSongs);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);
router.get('/stats', getStats);

module.exports = router;