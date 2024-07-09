export interface HeroProps {
  title: string;
  content?: React.ReactNode;
}

export default function Hero({ title, content }: HeroProps) {
  return (
    <div className="relative isolate flex flex-col min-h-[32rem] -mt-8">
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-[32rem] w-full stroke-white/10 [mask-image:radial-gradient(66%_100%_at_top,white,transparent)] [animation-delay:-0.25s]"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-white/10">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect
          fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          width="100%"
          height="100%"
          strokeWidth={0}
        />
      </svg>

      <div className="overflow-hidden my-auto">
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="relative w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>

              {content && (
                <div className="mt-6 text-lg leading-8 text-neutral-200 sm:max-w-md lg:max-w-none">
                  {content}
                </div>
              )}


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
