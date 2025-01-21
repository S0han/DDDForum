import React from 'react';

export const Content: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="content-container">
    {children}
  </div>
);
