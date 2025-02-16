import React, { useState } from 'react';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQAccordionProps = {
  items: FAQItem[];
};

const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}>
          <div
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            style={{ padding: '0.5rem', cursor: 'pointer', backgroundColor: '#f9f9f9' }}
          >
            <strong>{item.question}</strong>
          </div>
          {openIndex === index && (
            <div style={{ padding: '0.5rem' }}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FAQAccordion;
