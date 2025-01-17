const { exec } = require("child_process");

const searchYouTube = async (searchQuery) => {
  console.log("Starting YouTube search for:", searchQuery);

  // Sanitize and improve search query
  const sanitizedQuery = searchQuery
    .replace(/[^\w\s,]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Add more specific search terms to improve accuracy
  const enhancedQuery = `"${sanitizedQuery}" "official" "audio" "lyrics"`;
  console.log("Enhanced search query:", enhancedQuery);

  try {
    // Increase number of results and add more specific filters
    const command = `yt-dlp ytsearch10:"${enhancedQuery}" -j --no-playlist --match-filter "duration < 600 & duration > 60"`;

    const results = await new Promise((resolve, reject) => {
      exec(
        command,
        { maxBuffer: 1024 * 1024 * 10 },
        (error, stdout, stderr) => {
          if (error) {
            console.error("YouTube search error:", error);
            reject(error);
            return;
          }

          try {
            // Parse multiple results
            const videos = stdout
              .trim()
              .split("\n")
              .map((line) => JSON.parse(line));

            // Enhanced filtering and scoring system
            const scoredVideos = videos
              .map((video) => {
                const title = video.title.toLowerCase();
                const searchTerms = sanitizedQuery.toLowerCase().split(" ");

                // Calculate match score
                let score = 0;
                searchTerms.forEach((term) => {
                  if (title.includes(term)) score += 1;
                });

                // Bonus points for exact matches and official content
                if (title.includes("official")) score += 2;
                if (title.includes("audio")) score += 1;
                if (title.includes("lyrics")) score += 0.5;

                return { ...video, score };
              })
              .filter((video) => {
                // Filter by duration (2-8 minutes) and minimum match score
                const duration = parseInt(video.duration);
                return duration >= 120 && duration <= 480 && video.score > 1;
              })
              .sort((a, b) => b.score - a.score);

            if (scoredVideos.length === 0) {
              reject(new Error("No suitable matches found"));
              return;
            }

            // Return the best match
            resolve(scoredVideos[0].webpage_url);
          } catch (error) {
            console.error("Error parsing search results:", error);
            reject(error);
          }
        }
      );
    });

    return results;
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
};

module.exports = { searchYouTube };
