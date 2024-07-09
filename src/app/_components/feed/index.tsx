import { cx } from "class-variance-authority";
import Image from "next/image";

type BaseFeedItem = {
  id: string;
  image: string;
  song: string;
  songHref: string;
  artist: string;
  artistHref: string;
};

export type FeedItem =
  | ({
      type: "recent-track";
      nowplaying: boolean;
    } & BaseFeedItem)
  | ({
      type: "top-track";
      count: number;
    } & BaseFeedItem);

type FeedItemProps = {
  item: FeedItem;
  index: number;
  items: FeedItem[];
};

function FeedItem({ item, index, items }: FeedItemProps) {
  return (
    <li>
      <div className="relative pb-4">
        {index !== items.length - 1 ? (
          <span
            aria-hidden="true"
            className="absolute left-6 top-4 -ml-px h-full w-0.5 bg-white/10"
          />
        ) : null}

        <div
          className={cx(
            "relative flex items-center space-x-3 rounded",
            item.type === "recent-track" && item.nowplaying && "bg-white/10 p-2"
          )}
        >
          <div>
            <a
              rel="noopener noreferer"
              target="_blank"
              href={item.songHref}
              className="flex h-12 w-12 items-center justify-center rounded-full"
            >
              <Image
                className="h-12 w-12 rounded"
                height={300}
                width={300}
                alt={`Cover image for ${item.song} by ${item.artist}`}
                src={item.image}
              />
            </a>
          </div>

          <div className="flex min-w-0 flex-1 justify-between gap-x-4">
            <div className="flex flex-col text-sm">
              <a
                rel="noopener noreferer"
                target="_blank"
                href={item.songHref}
                className="text-white font-semibold hover:underline"
              >
                {item.song}
              </a>
              <a
                rel="noopener noreferer"
                target="_blank"
                href={item.artistHref}
                className="text-neutral-200 hover:underline"
              >
                {item.artist}
              </a>
            </div>

            {item.type === "recent-track" && item.nowplaying && (
              <div className="flex items-center justify-center">
                <div className="flex h-full items-center justify-center mr-2">
                  <div className="animate-wave mx-0.5 h-3 w-1 rounded bg-white [animation-delay:-0.4s]"></div>
                  <div className="animate-wave mx-0.5 h-4 w-1 rounded bg-white [animation-delay:-0.2s]"></div>
                  <div className="animate-wave mx-0.5 h-5 w-1 rounded bg-white"></div>
                </div>
              </div>
            )}

            {item.type === "top-track" && item.count && (
              <div className="flex items-center text-sm font-semibold text-white">
                {item.count}
              </div>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export interface FeedProps {
  items: FeedItem[];
}

export function Feed({ items }: FeedProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {items.map((item, index, arr) => (
          <FeedItem key={item.id} item={item} index={index} items={arr} />
        ))}
      </ul>
    </div>
  );
}
