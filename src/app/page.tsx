import Image from "next/image";

import LastFmService from "@/server/services/last-fm";
import SteamService from "@/server/services/steam";

async function VrchatPlayTime() {
  const ownedGames = await SteamService.GetOwnedGames(["438100"]);

  const playerSummaries = await SteamService.GetPlayerSummaries()

  const playtime_forver: number = ownedGames.response.games[0].playtime_forever;
  const playtime_2weeks: number = ownedGames.response.games[0].playtime_2weeks;

  const playerSummary = playerSummaries.response.players[0]

  console.log(JSON.stringify(playerSummary, null, 2))

  return (
    <div className="space-y-2 text-neutral-300">
      <p>
        i have wasted a total of{" "}
        <span className="text-white font-bold">
          {Intl.NumberFormat("da-DK").format(playtime_forver * 60)}
        </span>{" "}
        seconds of my life on vrchat. that&apos;s{" "}
        <span className="text-white font-bold">
          {Intl.NumberFormat("da-DK").format(playtime_forver)}
        </span>{" "}
        minutes or{" "}
        <span className="text-white font-bold">
          {Intl.NumberFormat("da-DK", { maximumFractionDigits: 1 }).format(
            playtime_forver / 60
          )}
        </span>{" "}
        hours.
      </p>
      <p>
        in the past two weeks i have wasted{" "}
        <span className="text-white font-bold">
          {Intl.NumberFormat("da-DK").format(playtime_2weeks * 60)}
        </span>{" "}
        seconds of my life on vrchat.
      </p>
      {playerSummary.gameid == "438100" && (
        <p>
          i&apos;m actually wasting my life away in vrchat, <span className="animate-pulse text-white font-bold">right now</span>.
        </p>
      )}
    </div>
  );
}

async function RecentTracks() {
  const recentTracks = await LastFmService.getRecentTracks();

  const tracks: any[] = recentTracks.recenttracks.track.slice(0, 10);

  // console.log(tracks[0]);

  return (
    <div>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {tracks.map((track, trackIdx) => (
            <li key={[track.name, track.artist.name].join("-")}>
              <div className="relative pb-4">
                {trackIdx !== tracks.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  />
                ) : null}
                <div
                  className={
                    track["@attr"]?.nowplaying == "true"
                      ? "relative flex items-center space-x-3 bg-white/25"
                      : "relative flex items-center space-x-3"
                  }
                  // className="relative flex items-center space-x-3"
                >
                  <div>
                    <a
                      href={track.url}
                      rel="noopener noreferer"
                      target="_blank"
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                    >
                      {/* <event.icon
                        aria-hidden="true"
                        className="h-5 w-5 text-white"
                      /> */}
                      <Image
                        className="h-12 w-12"
                        height={300}
                        width={300}
                        alt={""}
                        src={String(track.image[3]["#text"])}
                      />
                    </a>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div className="flex flex-col text-sm">
                      <a
                        href={track.url}
                        rel="noopener noreferer"
                        target="_blank"
                        className="text-white font-semibold hover:underline"
                      >
                        {track.name}
                      </a>
                      <a
                        href={track.artist.url}
                        className="text-neutral-200 hover:underline"
                      >
                        {track.artist.name}
                      </a>
                    </div>
                    {track["@attr"]?.nowplaying == "true" && (
                      <div className="flex items-center">
                        <div className="flex h-full items-center justify-center mr-2">
                          <div className="animate-wave mx-0.5 h-3 w-1 rounded bg-white [animation-delay:-0.4s]"></div>
                          <div className="animate-wave mx-0.5 h-4 w-1 rounded bg-white [animation-delay:-0.2s]"></div>
                          <div className="animate-wave mx-0.5 h-5 w-1 rounded bg-white"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function TopTracks() {
  const topTracks = await LastFmService.getTopTracks();

  const tracks: any[] = topTracks.toptracks.track.slice(0, 10);

  return (
    <div>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {tracks.map((track, trackIdx) => (
            <li key={[track.name, track.artist.name].join("-")}>
              <div className="relative pb-4">
                {trackIdx !== tracks.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  />
                ) : null}
                <div className="relative flex items-center space-x-3">
                  <div>
                    <a
                      href={track.url}
                      rel="noopener noreferer"
                      target="_blank"
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                    >
                      {/* <event.icon
                        aria-hidden="true"
                        className="h-5 w-5 text-white"
                      /> */}
                      <Image
                        className="aspect-square h-12 w-12"
                        height={300}
                        width={300}
                        alt={""}
                        src={String(track.image[3]["#text"])}
                      />
                    </a>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4">
                    <div className="flex flex-col text-sm">
                      <a
                        href={track.url}
                        rel="noopener noreferer"
                        target="_blank"
                        className="text-white font-semibold hover:underline"
                      >
                        {track.name}
                      </a>
                      <a
                        href={track.artist.url}
                        className="text-neutral-200 hover:underline"
                      >
                        {track.artist.name}
                      </a>
                    </div>
                    <div className="flex items-center text-sm font-semibold text-white">
                      {track.playcount}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

async function Music() {
  return (
    <div className="space-y-4 divide-y text-neutral-300">
      <div className="grid grid-cols-2 gap-4">
        <p>the most recent stuff i&apos;ve listened to</p>
        <p>these are my top tracks for the past 7 days</p>
      </div>
      <div className="grid grid-cols-2 gap-4 pt-4">
        <RecentTracks />
        <TopTracks />
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col gap-y-8 text-lg">
        <h1 className="text-4xl">
          it&apos;s me, it&apos;s your boy, it&apos;s kodeh
        </h1>
        <VrchatPlayTime />
        <Music />
      </div>
    </main>
  );
}
