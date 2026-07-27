import { Plus } from './icons';

const QUESTIONS = [
  'What is MOVES?',
  'Who signs my treatment plan?',
  'How do I know if aligners are right for me?',
  'How much does MOVES cost?',
  'How long does treatment take?',
  'Do I need clinic appointments?',
  'Are MOVES aligners painful?',
  'What happens while I’m wearing aligners?',
  'How do I start?',
];

export function Faqs() {
  return (
    <section className="card-section faqs">
      <div className="faqs__head">
        <p className="eyebrow">FAQS</p>
        <h2 className="faqs__title">
          Frequently <span className="ink">asked questions</span>
        </h2>
      </div>

      <div className="faqs__list">
        {QUESTIONS.map((q) => (
          <div className="faq" key={q}>
            <span>{q}</span>
            <Plus />
          </div>
        ))}
      </div>
    </section>
  );
}
