'use client';

import { useState } from 'react';

/* "Send us a message" — photo on the left, form on the right (Figma 533:476).
   No backend wired yet: on submit we just flag success so the UI is complete. */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <section className="contact-form-sec">
      <div className="contact-form__media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="contact-form__photo" src="/images/contact-doctor.png" alt="A MOVES dentist" />
      </div>

      <div className="contact-form">
        <h2 className="contact-form__title">Send us a message</h2>

        <form
          className="contact-form__form"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="contact-form__row">
            <label className="contact-form__field">
              <span className="contact-form__label">Name</span>
              <input className="contact-form__input" type="text" name="name" placeholder="Enter Your Name" required />
            </label>
            <label className="contact-form__field">
              <span className="contact-form__label">Email</span>
              <input className="contact-form__input" type="email" name="email" placeholder="Enter Your Email" required />
            </label>
          </div>

          <label className="contact-form__field">
            <span className="contact-form__label">Phone Number</span>
            <input className="contact-form__input" type="tel" name="phone" placeholder="Enter Your Phone Number" />
          </label>

          <label className="contact-form__field">
            <span className="contact-form__label">Message</span>
            <textarea className="contact-form__input contact-form__textarea" name="message" placeholder="Write your message here..." rows={5} />
          </label>

          <button className="btn contact-form__submit" type="submit">
            {sent ? 'Thanks — we’ll be in touch' : 'Submit'}
          </button>
        </form>
      </div>
    </section>
  );
}
