import React, { useState } from "react";

export const PostsViewSwitcher: React.FC = () => {
  const [view, setView] = useState<"popular" | "new">("popular");

  const handleViewChange = (newView: "popular" | "new") => {
    setView(newView);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
      <button
        onClick={() => handleViewChange("popular")}
        style={{
          marginRight: "10px",
          padding: "10px 20px",
          backgroundColor: view === "popular" ? "#007bff" : "#e0e0e0",
          color: view === "popular" ? "#fff" : "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Popular
      </button>
      <button
        onClick={() => handleViewChange("new")}
        style={{
          padding: "10px 20px",
          backgroundColor: view === "new" ? "#007bff" : "#e0e0e0",
          color: view === "new" ? "#fff" : "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        New
      </button>
    </div>
  );
};