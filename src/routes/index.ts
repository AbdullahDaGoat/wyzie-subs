export default eventHandler(() => {
  return `
  <h3>Wyzie - A free & simple open-subtitles scraping API.</h3>
  <div style="padding-left: 20px;">
    <h4>Usage:</h4>
    <ul>
        <li>/search?imdbId=tt123456 - Search subtitles by IMDB ID</li>
        <li>/search?imdbId=tt123456&season=1&episode=1 - Search subtitles by IMDB ID, season, and episode</li>
        <li>/search?imdbId=tt123456&language=en - Search subtitles by IMDB ID and language (compatible with individual season/episode)</li>
    </ul>
  </div>
  By BadDeveloper
  `;
});
