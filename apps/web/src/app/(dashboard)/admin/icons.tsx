/** Inline nav icons — 18×18, stroked, inherit currentColor. */
const base = {
  className: 'dash__navicon',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const HomeIcon = () => (
  <svg {...base}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.8V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.8" />
  </svg>
);

export const OrdersIcon = () => (
  <svg {...base}>
    <path d="M3 7h18l-1.4 12.1a2 2 0 0 1-2 1.9H6.4a2 2 0 0 1-2-1.9Z" />
    <path d="M8.5 7V5.5a3.5 3.5 0 0 1 7 0V7" />
  </svg>
);

export const ConsultIcon = () => (
  <svg {...base}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
    <path d="m9.5 15.5 1.8 1.8 3.4-3.4" />
  </svg>
);

export const ProductsIcon = () => (
  <svg {...base}>
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9Z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </svg>
);
