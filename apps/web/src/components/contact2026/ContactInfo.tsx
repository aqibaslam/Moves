/* "Get in touch — we're here anytime." + three contact cards (Figma 533:476).
   Icons are the brand SVGs supplied for this section. */

const CARDS = [
  {
    icon: '/images/contact-call.svg',
    title: 'Call us',
    lines: ['0113 0000232', 'Mon-Fri 9am-5pm (UK time)'],
  },
  {
    icon: '/images/contact-email.svg',
    title: 'Email us at',
    lines: ['hello@moves.co.uk', 'We reply to emails within 24 hours'],
  },
  {
    icon: '/images/contact-chat.svg',
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
        {CARDS.map(({ icon, title, lines }) => (
          <div className="contact-info__card" key={title}>
            <span className="contact-info__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="contact-info__icon-img" src={icon} alt="" aria-hidden="true" />
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
