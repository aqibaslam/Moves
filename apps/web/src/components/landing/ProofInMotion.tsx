'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from './icons';
import { mediaUrl } from '@/lib/media';

export interface ProofData {
  eyebrow?: string;
  heading?: { accent?: string; rest?: string };
  subtext?: string;
  videos?: { thumbnail?: unknown; video?: unknown; videoUrl?: string }[];
}

// Real patient stories (client-owned clips from the Dentalist site). Swap these
// for CMS-uploaded videos once they're in Payload.
const FALLBACK_BASE = 'https://dental.thedentalist.co.uk/wp-content/uploads/2025/09/';
const FALLBACK_VIDEOS = ['video2', 'video3', 'video4', 'video6', 'video7'].map(
  (n) => `${FALLBACK_BASE}${n}.mp4`,
);

function VideoTile({
  src,
  poster,
  active,
  onPlay,
}: {
  src: string;
  poster?: string;
  active: boolean;
  onPlay: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  // another tile started playing → stop this one and restore its play overlay
  useEffect(() => {
    const v = ref.current;
    if (!active && v && !v.paused) {
      v.pause();
      setStarted(false);
    }
  }, [active]);

  return (
    <div className={`ptile${started ? ' ptile--playing' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={ref}
        // #t=0.1 makes the browser paint a first-frame poster before playback
        src={poster ? src : `${src}#t=0.1`}
        poster={poster || undefined}
        preload="metadata"
        playsInline
        controls={started}
        // fires for both the overlay button and the native controls, so it
        // always claims "active" and pauses whichever tile was playing before
        onPlay={() => {
          setStarted(true);
          onPlay();
        }}
        onEnded={() => setStarted(false)}
      />
      {!started && (
        <button
          type="button"
          className="ptile__play"
          aria-label="Play patient story"
          onClick={() => void ref.current?.play()}
        >
          <Play />
        </button>
      )}
    </div>
  );
}

export function ProofInMotion({ data }: { data?: ProofData }) {
  // index of the tile currently playing — only one at a time
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // slider scroll position → active bullet (like the before/after section)
  const gridRef = useRef<HTMLDivElement>(null);
  const [dot, setDot] = useState(0);

  const tiles =
    data?.videos?.length && data.videos.some((v) => v.videoUrl || v.video)
      ? data.videos.map((v) => ({
          src: v.videoUrl || mediaUrl(v.video, ''),
          poster: mediaUrl(v.thumbnail, ''),
        }))
      : FALLBACK_VIDEOS.map((src) => ({ src, poster: '' }));

  const DOTS = tiles.length;
  const tileStep = () => {
    const t = gridRef.current?.querySelector<HTMLElement>('.ptile');
    return t ? t.offsetWidth + 4 : 0;
  };
  const syncDot = useCallback(() => {
    const el = gridRef.current;
    if (!el) return;
    const t = el.querySelector<HTMLElement>('.ptile');
    const step = t ? t.offsetWidth + 4 : 0;
    const idx = step > 0 ? Math.round(el.scrollLeft / step) : 0;
    setDot(Math.max(0, Math.min(idx, DOTS - 1)));
  }, [DOTS]);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    el.addEventListener('scroll', syncDot, { passive: true });
    window.addEventListener('resize', syncDot);
    syncDot();
    return () => {
      el.removeEventListener('scroll', syncDot);
      window.removeEventListener('resize', syncDot);
    };
  }, [syncDot]);
  const goToDot = (i: number) => {
    const el = gridRef.current;
    if (!el) return;
    el.scrollTo({ left: i * tileStep(), behavior: 'smooth' });
  };

  return (
    <section className="card-section proof">
      <div className="proof__head">
        <p className="eyebrow">{data?.eyebrow ?? 'PROOF IN MOTION'}</p>
        <h2 className="proof__title">
          {data?.heading?.accent ?? 'Real Smiles,'}{' '}
          <span className="ink">{data?.heading?.rest ?? 'real Stories'}</span>
        </h2>
        <p className="lead">
          {data?.subtext ??
            'MOVES isn’t a box in the post. Every patient is examined, scanned and fitted in person by a GDC-registered dentist, and every treatment plan carries that dentist’s signature.'}
        </p>
      </div>

      <div className="proof__grid" ref={gridRef}>
        {tiles.map((t, i) => (
          <VideoTile
            key={i}
            src={t.src}
            poster={t.poster || undefined}
            active={activeIndex === i}
            onPlay={() => setActiveIndex(i)}
          />
        ))}
      </div>

      <div className="proof__dots dots" role="tablist" aria-label="Video slides">
        {tiles.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`proof__dot${i === dot ? ' is-active' : ''}`}
            aria-label={`Go to video ${i + 1}`}
            aria-selected={i === dot}
            onClick={() => goToDot(i)}
          />
        ))}
      </div>
    </section>
  );
}
