import React from "react";

export const Overlay = ({ type, onClose }) => {
  let content = null;

  if (type === "skills") {
    content = (
      <>
        <h2>Skills</h2>
        <ul>
          <li>React.js</li>
          <li>Node.js</li>
          <li>Three.js</li>
          <li>Redis</li>
          {/* add more */}
        </ul>
      </>
    );
  }
  // add other types: 'projects', 'about', 'contact'

  return (
    <div className="overlay">
      <button className="close" onClick={onClose}>
        ×
      </button>
      {content}
    </div>
  );
};
