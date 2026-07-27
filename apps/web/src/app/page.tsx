import { Button } from '@moves/ui';
import { fontSize, space } from '@moves/design-tokens';
import styles from './page.module.css';

/**
 * Server Component — no "use client" here. Button carries its own
 * "use client" directive because it has an onPress handler.
 *
 * This page doubles as a live proof sheet for the token layer. Delete the
 * proof sheet once real product surfaces exist; keep the hero as a pattern.
 */
export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.eyebrow}>
            <span className={styles.dot} aria-hidden="true" />
            Scaffold ready
          </span>

          <h1 className={styles.title}>Moves</h1>

          <p className={styles.lede}>
            One design system, two platforms. Tokens defined once in{' '}
            <code>@moves/design-tokens</code> drive the web app&rsquo;s CSS
            custom properties and the Expo app&rsquo;s stylesheets.
          </p>

          <div className={styles.actions}>
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="secondary">
              Read the docs
            </Button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Token proof sheet</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBlockStart: 'var(--space-3)' }}>
            Every value below is read from the shared token package. Toggle your
            OS between light and dark to verify both themes.
          </p>

          <div className={styles.grid}>
            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Theme</h3>
              <div className={styles.swatches}>
                {[
                  'var(--color-bg)',
                  'var(--color-bg-muted)',
                  'var(--color-border)',
                  'var(--color-text-muted)',
                  'var(--color-text)',
                  'var(--color-accent)',
                  'var(--color-success)',
                  'var(--color-danger)',
                ].map((c) => (
                  <span key={c} className={styles.swatch} style={{ background: c }} />
                ))}
              </div>
            </article>

            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Space — 4pt grid</h3>
              <div className={styles.ramp}>
                {([1, 2, 3, 4, 6, 8, 10] as const).map((k) => (
                  <span
                    key={k}
                    className={styles.rampBar}
                    style={{ height: space[k] }}
                    title={`space.${k} = ${space[k]}px`}
                  />
                ))}
              </div>
            </article>

            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Type scale</h3>
              {(['sm', 'base', 'lg', 'xl', '2xl'] as const).map((k) => (
                <div key={k} className={styles.typeRow}>
                  <span style={{ fontSize: fontSize[k] }}>Ag</span>
                  <span className={styles.typeLabel}>
                    {k} · {fontSize[k]}px
                  </span>
                </div>
              ))}
            </article>

            <article className={styles.card}>
              <h3 className={styles.cardTitle}>Button variants</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="secondary">
                  Secondary
                </Button>
                <Button size="sm" variant="ghost">
                  Ghost
                </Button>
                <Button size="sm" variant="danger">
                  Danger
                </Button>
                <Button size="sm" loading>
                  Loading
                </Button>
                <Button size="sm" disabled>
                  Disabled
                </Button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
