import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import s from './primitives.module.css';

export function Arrow() {
  return <svg className={s.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
}

export function Check() {
  return <svg className={s.check} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4.5 10 3.5 3.5 7.5-7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Wordmark({ inverse = false }: { inverse?: boolean }) {
  return <Image className={s.wordmark} src={`/images/first-move/moves-wordmark${inverse ? '-white' : ''}.png`} width={640} height={142} alt="MOVES" unoptimized />;
}

export function Eyebrow({ children, tab = false }: { children: ReactNode; tab?: boolean }) {
  return <span className={`${s.eyebrow} ${tab ? s.withTab : ''}`}>{children}</span>;
}

type ButtonVariant = 'primary' | 'secondary' | 'inverse';
export function ActionLink({ href, children, variant = 'primary', compact = false, id }: { href: Route; children: ReactNode; variant?: ButtonVariant; compact?: boolean; id?: string }) {
  return <Link href={href} id={id} className={`${s.button} ${compact ? s.compact : ''}`} data-variant={variant}><span>{children}</span><span className={s.buttonArrow}><Arrow /></span></Link>;
}

export function Button({ children, variant = 'primary', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return <button type="button" className={s.button} data-variant={variant} {...props}><span>{children}</span><span className={s.buttonArrow}><Arrow /></span></button>;
}

export function CareMark({ compact = false }: { compact?: boolean }) {
  return <div className={`${s.care} ${compact ? s.careCompact : ''}`}><span className={s.careSymbol}>Signed<span aria-hidden="true">.</span></span><div><span className={s.careHeading}>Personal by design. Dentist-led.</span><p>Your plan, signed by a named<br className={s.careBreak} /> GDC-registered dentist.</p></div></div>;
}

export function Field({ label, hint, error, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { id: string; label: string; hint?: string; error?: string }) {
  const description = error || hint;
  return <div className={s.field}><label htmlFor={id}>{label}</label><input {...props} id={id} className={s.input} aria-invalid={error ? true : undefined} aria-describedby={description ? `${id}-hint` : undefined} />{description && <span id={`${id}-hint`} className={error ? s.error : s.hint}>{error && <span aria-hidden="true">! </span>}{description}</span>}</div>;
}

export function Choice({ children, name, value, defaultChecked }: { children: ReactNode; name: string; value: string; defaultChecked?: boolean }) {
  return <label className={s.choice}><input type="radio" name={name} value={value} defaultChecked={defaultChecked} /><span>{children}</span><span className={s.choiceIndicator} aria-hidden="true"><Check /></span></label>;
}

export function Disclosure({ question, children }: { question: string; children: ReactNode }) {
  return <details className={s.disclosure}><summary>{question}<span className={s.plus} aria-hidden="true" /></summary><div className={s.answer}>{children}</div></details>;
}
