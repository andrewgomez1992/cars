import { useState, useEffect } from "react";

export const useCarControls = () => {
  const [keys, setKeys] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const down = (e) => {
      if (e.code === "ArrowUp") setKeys((k) => ({ ...k, up: true }));
      if (e.code === "ArrowDown") setKeys((k) => ({ ...k, down: true }));
      if (e.code === "ArrowLeft") setKeys((k) => ({ ...k, left: true }));
      if (e.code === "ArrowRight") setKeys((k) => ({ ...k, right: true }));
    };
    const up = (e) => {
      if (e.code === "ArrowUp") setKeys((k) => ({ ...k, up: false }));
      if (e.code === "ArrowDown") setKeys((k) => ({ ...k, down: false }));
      if (e.code === "ArrowLeft") setKeys((k) => ({ ...k, left: false }));
      if (e.code === "ArrowRight") setKeys((k) => ({ ...k, right: false }));
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  return keys;
};
