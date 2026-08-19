/** Status pill. Colour is reinforced by the label text, never carried alone. */
export function StatusPill({ tone, children }: { tone: 'green' | 'blue' | 'amber' | 'grey' | 'coral'; children: React.ReactNode }) {
  return <span className={`dash__pill dash__pill--${tone}`}>{children}</span>;
}
