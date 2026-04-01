import Link from "next/link";

// ── shared primitives ────────────────────────────────────────────────────────

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-400">
      {children}
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-800 text-white">
        {icon}
      </div>
      <p className="font-semibold text-neutral-100">{title}</p>
      <p className="text-sm leading-relaxed text-neutral-400">{desc}</p>
    </div>
  );
}

// ── code block ───────────────────────────────────────────────────────────────

function CodeBlock({
  lang,
  code,
}: {
  lang: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-700">
      <div className="flex items-center gap-2 border-b border-neutral-700 bg-neutral-900 px-4 py-2.5">
        <span className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-neutral-700" />
          <span className="h-3 w-3 rounded-full bg-neutral-700" />
          <span className="h-3 w-3 rounded-full bg-neutral-700" />
        </span>
        <span className="ml-1 text-xs text-neutral-500">{lang}</span>
      </div>
      <pre className="overflow-x-auto bg-neutral-950 p-5 text-sm leading-relaxed">
        <code dangerouslySetInnerHTML={{ __html: code }} />
      </pre>
    </div>
  );
}

// ── syntax highlight helpers (manual, no deps) ───────────────────────────────

const CURL = `<span class="text-neutral-500"># get latest videos for any channel</span>
<span class="text-emerald-400">curl</span> <span class="text-sky-300">"https://yourapp.com/api/channel?channelId=UCsBjURrPoezykLs9EqgamOA"</span>`;

const FETCH_JS = `<span class="text-purple-400">const</span> <span class="text-neutral-100">res</span> <span class="text-neutral-500">=</span> <span class="text-purple-400">await</span> <span class="text-yellow-300">fetch</span><span class="text-neutral-300">(</span>
  <span class="text-sky-300">\`/api/channel?channelId=\${</span><span class="text-neutral-100">channelId</span><span class="text-sky-300">}\`</span>
<span class="text-neutral-300">);</span>
<span class="text-purple-400">const</span> <span class="text-neutral-300">{</span> <span class="text-neutral-100">channel</span><span class="text-neutral-300">,</span> <span class="text-neutral-100">videos</span> <span class="text-neutral-300">}</span> <span class="text-neutral-500">=</span> <span class="text-purple-400">await</span> <span class="text-neutral-100">res</span><span class="text-neutral-500">.</span><span class="text-yellow-300">json</span><span class="text-neutral-300">();</span>

<span class="text-neutral-100">videos</span><span class="text-neutral-500">.</span><span class="text-yellow-300">forEach</span><span class="text-neutral-300">(</span><span class="text-neutral-100">v</span> <span class="text-purple-400">=&gt;</span> <span class="text-neutral-100">console</span><span class="text-neutral-500">.</span><span class="text-yellow-300">log</span><span class="text-neutral-300">(</span><span class="text-neutral-100">v</span><span class="text-neutral-500">.</span><span class="text-neutral-100">title</span><span class="text-neutral-300">,</span> <span class="text-neutral-100">v</span><span class="text-neutral-500">.</span><span class="text-neutral-100">views</span><span class="text-neutral-300">));</span>`;

const RESPONSE_JSON = `<span class="text-neutral-500">{</span>
  <span class="text-sky-300">"channel"</span><span class="text-neutral-300">:</span> <span class="text-neutral-500">{</span>
    <span class="text-sky-300">"id"</span><span class="text-neutral-300">:</span>        <span class="text-emerald-300">"UCsBjURrPoezykLs9EqgamOA"</span><span class="text-neutral-300">,</span>
    <span class="text-sky-300">"title"</span><span class="text-neutral-300">:</span>     <span class="text-emerald-300">"Fireship"</span><span class="text-neutral-300">,</span>
    <span class="text-sky-300">"url"</span><span class="text-neutral-300">:</span>       <span class="text-emerald-300">"https://www.youtube.com/channel/UCsBjURrPoezykLs9EqgamOA"</span><span class="text-neutral-300">,</span>
    <span class="text-sky-300">"published"</span><span class="text-neutral-300">:</span> <span class="text-emerald-300">"2017-05-05T15:00:03+00:00"</span>
  <span class="text-neutral-500">}</span><span class="text-neutral-300">,</span>
  <span class="text-sky-300">"videoCount"</span><span class="text-neutral-300">:</span> <span class="text-orange-300">15</span><span class="text-neutral-300">,</span>
  <span class="text-sky-300">"videos"</span><span class="text-neutral-300">:</span> <span class="text-neutral-500">[</span>
    <span class="text-neutral-500">{</span>
      <span class="text-sky-300">"id"</span><span class="text-neutral-300">:</span>          <span class="text-emerald-300">"dQw4w9WgXcQ"</span><span class="text-neutral-300">,</span>
      <span class="text-sky-300">"title"</span><span class="text-neutral-300">:</span>       <span class="text-emerald-300">"This javascript trick will blow your mind"</span><span class="text-neutral-300">,</span>
      <span class="text-sky-300">"url"</span><span class="text-neutral-300">:</span>         <span class="text-emerald-300">"https://www.youtube.com/watch?v=dQw4w9WgXcQ"</span><span class="text-neutral-300">,</span>
      <span class="text-sky-300">"published"</span><span class="text-neutral-300">:</span>   <span class="text-emerald-300">"2024-03-01T18:00:00+00:00"</span><span class="text-neutral-300">,</span>
      <span class="text-sky-300">"thumbnail"</span><span class="text-neutral-300">:</span>   <span class="text-emerald-300">"https://i4.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"</span><span class="text-neutral-300">,</span>
      <span class="text-sky-300">"views"</span><span class="text-neutral-300">:</span>       <span class="text-orange-300">1240000</span><span class="text-neutral-300">,</span>
      <span class="text-sky-300">"rating"</span><span class="text-neutral-300">:</span>      <span class="text-neutral-500">{</span> <span class="text-sky-300">"count"</span><span class="text-neutral-300">:</span> <span class="text-orange-300">48200</span><span class="text-neutral-300">,</span> <span class="text-sky-300">"average"</span><span class="text-neutral-300">:</span> <span class="text-orange-300">4.92</span> <span class="text-neutral-500">}</span>
    <span class="text-neutral-500">}</span><span class="text-neutral-300">,</span>
    <span class="text-neutral-500">...</span>
  <span class="text-neutral-500">]</span>
<span class="text-neutral-500">}</span>`;

// ── use cases ─────────────────────────────────────────────────────────────────

const USE_CASES = [
  "RSS readers & feed aggregators",
  "Telegram / Discord bots",
  "Personal dashboards",
  "Content monitoring tools",
  "Browser extensions",
  "Static site generators",
];

// ── page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-red-600/30">

      {/* ── nav ── */}
      <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-neutral-800 bg-[#0f0f0f]/95 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8z" />
            <polygon points="9.7 15.5 15.8 12 9.7 8.5 9.7 15.5" fill="white" />
          </svg>
          <span className="font-semibold text-sm tracking-tight">YouTube RSS JSON</span>
        </div>
        <nav className="ml-auto flex items-center gap-1">
          <Link href="/feed" className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition hover:text-neutral-200">
            Feed viewer
          </Link>
          <Link href="/docs" className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition hover:text-neutral-200">
            Docs
          </Link>
          <a
            href="/api/docs"
            target="_blank"
            className="rounded-lg px-3 py-1.5 text-sm text-neutral-400 transition hover:text-neutral-200"
          >
            OpenAPI
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">

        {/* ── hero ── */}
        <section className="flex flex-col items-center gap-6 py-24 text-center">
          <Chip>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            No API key · No auth · Free
          </Chip>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            YouTube RSS{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">
              as clean JSON
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-neutral-400">
            One HTTP request — get structured video data for any YouTube channel.
            No scraping, no OAuth, just the public RSS feed parsed into JSON you can actually use.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/docs"
              className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              View docs
            </Link>
            <Link
              href="/feed"
              className="rounded-full border border-neutral-700 px-6 py-2.5 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white"
            >
              Try feed viewer
            </Link>
          </div>

          {/* endpoint pill */}
          <div className="mt-4 flex items-center gap-0 overflow-hidden rounded-full border border-neutral-700 bg-neutral-900 text-sm font-mono">
            <span className="bg-emerald-900/60 px-4 py-2 text-emerald-300 font-semibold">GET</span>
            <span className="px-4 py-2 text-neutral-300">
              /api/channel?channelId=<span className="text-neutral-500">UC…</span>
            </span>
          </div>
        </section>

        {/* ── features ── */}
        <section className="py-16 flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Why use this?</h2>
            <p className="mt-2 text-neutral-400 text-sm">YouTube doesn't give you a clean data API without OAuth. This does.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              title="One request, structured data"
              desc="Pass a channelId, get back channel metadata + up to 15 latest videos with titles, thumbnails, views, and publish dates."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
                </svg>
              }
              title="No API key required"
              desc="Reads YouTube's public RSS feed. No Google Cloud project, no OAuth flow, no rate limit quota to manage."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              }
              title="Drop-in for any stack"
              desc="Plain JSON response. Use it from Node, Python, Rust, a shell script, or directly in the browser — no SDK needed."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
              }
              title="Real-time feed"
              desc="Each request pulls live data from YouTube's RSS endpoint — always up to date with the latest uploads."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" />
                </svg>
              }
              title="OpenAPI 3.1 spec"
              desc="Full machine-readable spec at /api/docs. Import into Postman, Insomnia, or generate a typed client automatically."
            />
            <FeatureCard
              icon={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              title="Input validation"
              desc="Channel IDs are validated against YouTube's format before any network request. Clear error messages for every failure case."
            />
          </div>
        </section>

        {/* ── use cases ── */}
        <section className="py-16 flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-center">What you can build</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {USE_CASES.map((uc) => (
              <span
                key={uc}
                className="rounded-full border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300"
              >
                {uc}
              </span>
            ))}
          </div>
        </section>

        {/* ── quickstart ── */}
        <section className="py-16 flex flex-col gap-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Quick start</h2>
            <p className="mt-2 text-sm text-neutral-400">Three steps to your first response.</p>
          </div>

          {/* step 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-300">1</span>
              <h3 className="font-semibold text-neutral-100">Find the channel ID</h3>
            </div>
            <p className="ml-10 text-sm leading-relaxed text-neutral-400">
              Go to a YouTube channel page, click <span className="text-neutral-200">More</span> → <span className="text-neutral-200">Share</span> → <span className="text-neutral-200">Copy channel ID</span>.
              It starts with <code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-emerald-400">UC</code> and is exactly 24 characters long.
              <br />
              Alternatively, get it from the URL: <code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-xs text-neutral-300">youtube.com/channel/<span className="text-emerald-400">UCsBjURrPoezykLs9EqgamOA</span></code>
            </p>
          </div>

          {/* step 2 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-300">2</span>
              <h3 className="font-semibold text-neutral-100">Make the request</h3>
            </div>
            <div className="ml-10 flex flex-col gap-3">
              <CodeBlock lang="bash" code={CURL} />
              <CodeBlock lang="javascript" code={FETCH_JS} />
            </div>
          </div>

          {/* step 3 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-300">3</span>
              <h3 className="font-semibold text-neutral-100">Use the response</h3>
            </div>
            <div className="ml-10">
              <CodeBlock lang="json — 200 OK" code={RESPONSE_JSON} />
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16">
          <div className="flex flex-col items-center gap-6 rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 px-8 py-14 text-center">
            <h2 className="text-3xl font-bold">Ready to use it?</h2>
            <p className="max-w-md text-neutral-400">
              Read the full API reference with all fields, error codes, and a live playground to test it right in the browser.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/docs"
                className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                API Reference →
              </Link>
              <Link
                href="/feed"
                className="rounded-full border border-neutral-700 px-6 py-2.5 text-sm font-semibold text-neutral-200 transition hover:border-neutral-500 hover:text-white"
              >
                Open feed viewer
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-neutral-800 px-6 py-8 text-center text-xs text-neutral-600">
        Reads YouTube public RSS — no affiliation with YouTube or Google.
      </footer>
    </div>
  );
}
