import React from "react";
import { Header } from "./header";
import { Content } from "./content";

interface LayoutProps {
  children?: React.ReactNode;
  user?: { username: string } | null;
}

export const Layout = ({ children, user = null }: LayoutProps) => (
  <>
    <Header user={user} />
    <Content>{children}</Content>
  </>
);
