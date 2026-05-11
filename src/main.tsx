import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide initial loading screen once React mounts
requestAnimationFrame(() => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 600);
  }
});
