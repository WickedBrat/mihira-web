"use client";

import { useState } from 'react';

type FAQ = {
  question: string;
  answer: string;
};

export function FAQList({ faqs }: { faqs: FAQ[] }) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  return (
    <div className="faq-list">
      {faqs.map((faq) => {
        const isOpen = openItems.has(faq.question);
        const panelId = `faq-${faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

        return (
          <div key={faq.question} className="faq-item" data-open={isOpen}>
            <button
              aria-controls={panelId}
              aria-expanded={isOpen}
              className="faq-item__trigger"
              type="button"
              onClick={() => {
                setOpenItems((current) => {
                  const next = new Set(current);
                  if (next.has(faq.question)) {
                    next.delete(faq.question);
                  } else {
                    next.add(faq.question);
                  }
                  return next;
                });
              }}
            >
              <span>{faq.question}</span>
              <span className="faq-item__icon" aria-hidden="true">
                +
              </span>
            </button>
            <div id={panelId} className="faq-item__answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
