import React, { useState } from 'react';

type TabsProps = {
  children: React.ReactElement[];
};

const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        {children.map((child, index) => (
          <div
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{
              padding: '1rem',
              cursor: 'pointer',
              borderBottom: activeIndex === index ? '2px solid blue' : 'none'
            }}
          >
            {child.props.label}
          </div>
        ))}
      </div>
      <div style={{ padding: '1rem' }}>
        {children[activeIndex]}
      </div>
    </div>
  );
};

export default Tabs;
