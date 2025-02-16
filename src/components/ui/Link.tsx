// src/components/ui/Link.tsx
import React from 'react';
import NextLink from 'next/link';

export type LinkProps = {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
};

const Link: React.FC<LinkProps> = ({ href, children, isExternal = false }) => {
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return <NextLink href={href}>{children}</NextLink>;
};

export default Link;
