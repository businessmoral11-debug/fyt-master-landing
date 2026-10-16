import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { installZoomGuard } from "./app/zoomGuard";
import "./styles/index.css";

installZoomGuard();
createRoot(document.getElementById("root")!).render(<App />);
