import React from "react";
import { Link, useLocation } from "react-router-dom";

const Logo = () => (
  <div id="app-logo">
    <img src="/assets/dddforumlogo.png" alt="DDD Forum Logo" />
  </div>
);

const TitleAndSubmission = () => (
  <div id="title-container">
    <h1>Domain-Driven Designers</h1>
    <h3>Where awesome domain-driven designers are made</h3>
    <Link to="/submit">Submit</Link>
  </div>
);

const HeaderActionButton = ({ user }: { user: any }) => (
  <div id="header-action-button">
    {user ? (
      <div>
        <span>{user.username}</span>
        <u>
          <div>Logout</div>
        </u>
      </div>
    ) : (
      <Link to="/join">Join</Link>
    )}
  </div>
);

const shouldShowActionButton = (pathName: string) => {
  return pathName !== "/join";
};

export const Header = ({ user }: { user: any }) => {
  const location = useLocation();
  return (
    <header id="header" className="flex align-center">
      <Logo />
      <TitleAndSubmission />
      {shouldShowActionButton(location.pathname) && (
        <HeaderActionButton user={user} />
      )}
    </header>
  );
};