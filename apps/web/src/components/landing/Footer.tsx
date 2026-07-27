import { ArrowUpRight, Envelope } from './icons';

const LINKS = ['Shop', 'About', 'Science', 'FAQs', 'Contact'];

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__left">
            <div className="footer__nav">
              {LINKS.map((l) => (
                <a key={l} href="#">
                  {l}
                </a>
              ))}
            </div>
            <div className="footer__social">
              <a href="#" aria-label="Instagram">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/social-instagram.svg" alt="" width={27} height={27} />
              </a>
              <a href="#" aria-label="TikTok">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/social-tiktok.svg" alt="" width={27} height={27} />
              </a>
              <a href="#" aria-label="Email">
                <Envelope />
              </a>
            </div>
          </div>

          <div className="footer__mail">
            <span className="footer__mail-label">join our mailing list</span>
            <div className="footer__input">
              <span>YOUR EMAIL</span>
              <button type="button" className="footer__submit" aria-label="Subscribe">
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>

        <div className="footer__wordmark">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/moves-wordmark.svg" alt="Moves" />
          <p className="footer__copy">© Copyright 2026 Moves</p>
        </div>
      </div>
    </footer>
  );
}
