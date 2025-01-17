const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema(
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
    album: {
      type: String,
      trim: true,
    },
    albumArt: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      min: 0,
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

// Index for faster queries
trackSchema.index({ spotifyId: 1 });
trackSchema.index({ spotifyUrl: 1 });

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
