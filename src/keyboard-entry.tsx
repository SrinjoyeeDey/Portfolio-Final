import React from "react";
import { createRoot } from "react-dom/client";
import Interactive3DKeyboard from "./3d-keyboard/Interactive3DKeyboard";

const container = document.getElementById("keyboard-3d-root");
if (container) {
  const root = createRoot(container);
  root.render(<Interactive3DKeyboard />);
}

