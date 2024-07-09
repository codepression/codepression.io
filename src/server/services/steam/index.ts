import { env } from "@/utils/env/server";

type GetRecentlyPlayedGames = {
  service: "IPlayerService";
  method: "GetRecentlyPlayedGames";
  version: "v0001";
};

type GetOwnedGames = {
  service: "IPlayerService";
  method: "GetOwnedGames";
  version: "v0001";
};

type GetUserStatsForGame = {
  service: "ISteamUserStats";
  method: "GetUserStatsForGame";
  version: "v0002";
};

type GetPlayerSummaries = {
  service: "ISteamUser";
  method: "GetPlayerSummaries";
  version: "v0002";
};

type CreateUrlProps = {
  query?: [string, string][];
} & (
  | GetRecentlyPlayedGames
  | GetOwnedGames
  | GetUserStatsForGame
  | GetPlayerSummaries
);

function createUrl({ service, method, version, query }: CreateUrlProps) {
  const url = new URL(
    `https://api.steampowered.com/${service}/${method}/${version}/?key=${env.STEAM_API_KEY}&steamid=${env.STEAM_ID}&format=json`
  );

  if (query) {
    query.forEach(([key, value]) => url.searchParams.set(key, value));
  }

  return url;
}

async function GetRecentlyPlayedGames() {
  const url = createUrl({
    service: "IPlayerService",
    method: "GetRecentlyPlayedGames",
    version: "v0001",
  });
  const result = await fetch(url, {
    method: "GET",
    next: { revalidate: 30 },
  });
  const json = await result.json();
  return json;
}

async function GetUserStatsForGame(appid: string | number) {
  const url = createUrl({
    service: "ISteamUserStats",
    method: "GetUserStatsForGame",
    version: "v0002",
    query: [["appid", String(appid)]],
  });
  const result = await fetch(url, {
    method: "GET",
    next: { revalidate: 30 },
  });
  const json = await result.json();
  return json;
}

async function GetOwnedGames(appids?: (string | number)[]) {
  const url = createUrl({
    service: "IPlayerService",
    method: "GetOwnedGames",
    version: "v0001",
    query:
      appids?.map((appid, i) => [`appids_filter[${i}]`, String(appid)]) ?? [],
  });
  const result = await fetch(url, {
    method: "GET",
    next: { revalidate: 30 },
  });
  const json = await result.json();
  return json;
}

async function GetPlayerSummaries() {
  const url = createUrl({
    service: "ISteamUser",
    method: "GetPlayerSummaries",
    version: "v0002",
    query: [["steamids", env.STEAM_ID]],
  });
  const result = await fetch(url, {
    method: "GET",
    next: { revalidate: 30 },
  });
  const json = await result.json();
  return json;
}

const SteamService = {
  GetRecentlyPlayedGames,
  GetUserStatsForGame,
  GetOwnedGames,
  GetPlayerSummaries,
};

export default SteamService;
