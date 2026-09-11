/* "Get in touch — we're here anytime." + three contact cards (Figma 533:476). */
function IconCall() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3.5 8.8 4a1 1 0 0 1 .8.8l.5 2.3a1 1 0 0 1-.3.95L8.2 9.6a12 12 0 0 0 6.2 6.2l1.55-1.6a1 1 0 0 1 .95-.3l2.3.5a1 1 0 0 1 .8.8l.5 2.3a1 1 0 0 1-1 1.2A15.5 15.5 0 0 1 4.5 4.5a1 1 0 0 1 1.2-1Z" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 5.5L20 7" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z" />
      <path d="M8.5 10h7M8.5 13h4" />
    </svg>
  );
}

const CARDS = [
  {
    Icon: IconCall,
    title: 'Call us',
    lines: ['0113 0000232', 'Mon-Fri 9am-5pm (UK time)'],
  },
  {
    Icon: IconMail,
    title: 'Email us at',
    lines: ['hello@moves.co.uk', 'We reply to emails within 24 hours'],
  },
  {
    Icon: IconChat,
    title: 'Live Chat',
    lines: ['Have a question? Use the chat in the bottom-right corner to speak with a real person.'],
  },
];

export function ContactInfo() {
  return (
    <section className="contact-info card-section">
      <h2 className="contact-info__title">
        Get in touch <br />
        we&rsquo;re <span className="ink-red">here anytime.</span>
      </h2>

      <div className="contact-info__cards">
        {CARDS.map(({ Icon, title, lines }) => (
          <div className="contact-info__card" key={title}>
            <span className="contact-info__icon">
              <Icon />
            </span>
            <h3 className="contact-info__card-title">{title}</h3>
            <p className="contact-info__card-body">
              {lines.map((l, i) => (
                <span key={i}>
                  {l}
                  {i < lines.length - 1 && <br />}
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
