const mongoose = require("mongoose");

const playlistTrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  album: String,
  duration: {
    type: Number,
    min: 0,
  },
  spotifyId: {
    type: String,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    spotifyUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    spotifyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    coverArt: {
      type: String,
      trim: true,
    },
    trackCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    tracks: [playlistTrackSchema],
    metadata: {
      fetchedAt: {
        type: Date,
        default: Date.now,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
playlistSchema.index({ spotifyId: 1 });
playlistSchema.index({ spotifyUrl: 1 });
playlistSchema.index({ "tracks.spotifyId": 1 });

// Update trackCount before saving
playlistSchema.pre("save", function (next) {
  this.trackCount = this.tracks.length;
  next();
});

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
