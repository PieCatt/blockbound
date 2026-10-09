import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide initial loading screen once React mounts
const hideLoader = () => {
  const loader = document.getElementById("app-loader");
  if (loader) {
    loader.classList.add("hide");
    setTimeout(() => loader.remove(), 700);
  }
};
if (document.readyState === "complete") requestAnimationFrame(hideLoader);
else window.addEventListener("load", hideLoader, { once: true });
