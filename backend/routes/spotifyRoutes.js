const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  getTrackMetadata,
  getPlaylistMetadata,
  getAlbumMetadata,
} = require("../controllers/spotifyController");
const downloadController = require("../controllers/downloadController");
const router = express.Router();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Apply rate limiting to all routes
router.use(apiLimiter);

const trackLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    const match = req.body.url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : req.ip;
  },
});

// Routes
router.post("/metadata", trackLimiter, getTrackMetadata);
router.post("/playlist", getPlaylistMetadata);
router.post("/album", getAlbumMetadata);

const downloadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 downloads per hour
});

router.post("/download", downloadLimiter, downloadController.downloadTrack);

module.exports = router;
