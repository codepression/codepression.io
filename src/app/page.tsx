import { formatRelative } from "date-fns/formatRelative";
import { enGB } from "date-fns/locale";

import LastFmService from "@/server/services/last-fm";
import SteamService from "@/server/services/steam";
import VRChatService from "@/server/services/vrchat";

import { Container } from "./_components/container";
import { Feed, type FeedItem } from "./_components/feed";
import Hero from "./_components/hero";

async function VrchatAuditLog() {
  const bansResult = await VRChatService.getGroupAuditLog(
    "grp_d5cab3a0-e22f-45db-9d17-4dfb11daede7",
    { "group.user.ban": true }
  );
  const bansSet = new Set(bansResult.data?.results?.map((log) => log.targetId));

  const kicksResult = await VRChatService.getGroupAuditLog(
    "grp_d5cab3a0-e22f-45db-9d17-4dfb11daede7",
    { "group.instance.kick": true }
  );

  const bans = bansResult.data?.results?.slice(0, 10);
  const kicks = kicksResult.data?.results
    ?.filter((log) => !bansSet.has(log.targetId))
    .slice(0, 10);

  return (
    <div>
      <p className="mb-2">audit logs</p>

      <div className="grid grid-cols-2 gap-x-4">
        {bans && (
          <ul>
            {bans.map((log) => (
              <li key={log.id} className="flex flex-col">
                <div className="text-white font-semibold">
                  {log.description}
                </div>
                <div className=" text-neutral-200 text-sm">
                  {formatRelative(log.created_at!, new Date(), {
                    locale: enGB,
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}

        {kicks && (
          <ul>
            {kicks.map((log) => (
              <li key={log.id} className="flex flex-col">
                <div className="text-white font-semibold">
                  {log.description}
                </div>
                <div className=" text-neutral-200 text-sm">
                  {formatRelative(log.created_at!, new Date(), {
                    locale: enGB,
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

async function VrchatPlayTime() {
  const ownedGames = await SteamService.GetOwnedGames(["438100"]);
  // const user = await VRChatService.getFriend(
  //   "usr_d20d390d-a41c-4129-87a7-a84984550ba7"
  // );

  const playtime_forver: number = ownedGames.response.games[0].playtime_forever;

  return (
    <>
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
        {/* {user.data?.state === "online" && (
          <>
            <br />
            i&apos;m actually wasting my life away in vrchat,{" "}
            <span className="relative text-white font-bold">
              <span className="absolute top-1 -right-2 w-3 h-3 rounded-full bg-red-600 animate-ping" />
              <span className="absolute top-1 -right-2 w-3 h-3 rounded-full bg-red-600 animate-ping [animation-delay:-.33s]" />
              right now
            </span>
            .
          </>
        )} */}
      </p>
    </>
  );
}

async function RecentTracks() {
  const recentTracks = await LastFmService.getRecentTracks();

  const tracks: any[] = recentTracks.recenttracks.track.slice(0, 10);

  const items: FeedItem[] = tracks.map((track) => ({
    type: "recent-track",
    nowplaying: track["@attr"]?.nowplaying == "true",

    id: [track.name, track.artist.name].join("-"),

    artist: track.artist.name,
    artistHref: track.artist.url,

    song: track.name,
    songHref: track.url,

    image: track.image[3]["#text"],
  }));

  return <Feed items={items} />;
}

async function TopTracks() {
  const topTracks = await LastFmService.getTopTracks();

  const tracks: any[] = topTracks.toptracks.track.slice(0, 10);

  const items: FeedItem[] = tracks.map((track) => ({
    type: "top-track",
    count: track.playcount,

    id: [track.name, track.artist.name].join("-"),

    artist: track.artist.name,
    artistHref: track.artist.url,

    song: track.name,
    songHref: track.url,

    image: track.image[3]["#text"],
  }));

  return <Feed items={items} />;
}

async function Music() {
  return (
    <div className="grid grid-cols-2 gap-8 text-neutral-300">
      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-6 leading-6 text-white">
          the most recent stuff i&apos;ve listened to
        </h3>
        <RecentTracks />
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight mb-6 leading-6 text-white">
          these are my top tracks for the past 7 days
        </h3>
        <TopTracks />
      </div>
    </div>
  );
}

export default async function Home() {
  return (
    <>
      <Hero
        title="it's me, it's your boy, it's kodeh"
        content={<VrchatPlayTime />}
      />
      <Container>
        <Music />
      </Container>
    </>
  );
}
