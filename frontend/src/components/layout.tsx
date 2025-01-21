import React from 'react';
import { Content } from './content';
import { Header } from './header';

export const Content = ({ children }: any) => (
  <div className='content-container'>
    {children}
  </div>
);

export const Layout = ({ children }: any) => (
  <>
    <Header/>
    <Content>
      {children}
    </Content>
  </>
);