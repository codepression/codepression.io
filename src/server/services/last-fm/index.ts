const API_URL = "https://ws.audioscrobbler.com/2.0";
const API_KEY = String(process.env.LASTFM_API_KEY);

const DEFAULT_HEADERS = {
  "User-Agent": "Codepression <hello@codepression.io>",
};

function createUrl(method: string, query?: [string, string][]) {
  const url = new URL(
    `${API_URL}/?method=${method}&api_key=${API_KEY}&format=json`
  );
  if (query && query.length > 0) {
    query.forEach(([key, value]) => url.searchParams.set(key, value));
  }
  return url;
}

async function getUserInfo() {
  const url = createUrl("user.getInfo", [["user", "codepression"]]);
  const result = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });
  const json = await result.json();
  return json;
}

async function getRecentTracks() {
  const url = createUrl("user.getRecentTracks", [
    ["user", "codepression"],
    ["limit", "10"],
    ["extended", "1"],
  ]);
  const result = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });
  const json = await result.json();
  return json;
}

async function getTopTracks() {
  const url = createUrl("user.getTopTracks", [
    ["user", "codepression"],
    ["limit", "10"],
    ["period", "7day"],
  ]);
  const result = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });
  const json = await result.json();
  return json;
}

const LastFmService = {
  getUserInfo,
  getRecentTracks,
  getTopTracks
};

export default LastFmService;
