import { Wordmark } from '@/components/moves-system/Primitives';
import s from './your-move.module.css';

/**
 * Scaffold only — no real marketing copy yet. Sections below get replaced
 * one at a time once the Figma for this page lands. Keep the component
 * split (header / hero / future sections) so each swap stays isolated.
 */
export function YourMoveHeader() {
  return (
    <header className={s.header}>
      <Wordmark />
    </header>
  );
}

export function YourMoveHero() {
  return (
    <main id="main" tabIndex={-1} className={s.main}>
      <div className={s.placeholder}>
        <span className={s.tag}>Scaffold — awaiting Figma</span>
        <h1>Your Move</h1>
        <p>
          This page is wired up and ready at <code>/your-move</code>. Sections will be built out
          to match the Figma once it&rsquo;s shared.
        </p>
      </div>
    </main>
  );
}
