const mongoose = require("mongoose");

const albumTrackSchema = new mongoose.Schema({
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
  duration: {
    type: Number,
    min: 0,
  },
  trackNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  spotifyId: {
    type: String,
    required: true,
  },
});

const albumSchema = new mongoose.Schema(
  {
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
    releaseDate: {
      type: String,
      required: true,
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
      required: true,
      min: 0,
    },
    tracks: [albumTrackSchema],
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
albumSchema.index({ spotifyId: 1 });
albumSchema.index({ spotifyUrl: 1 });
albumSchema.index({ "tracks.spotifyId": 1 });

// Update trackCount before saving
albumSchema.pre("save", function (next) {
  this.trackCount = this.tracks.length;
  next();
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
