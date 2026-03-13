/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { createRoot } from "react-dom/client";
import { AppProvider } from "./app-provider";
import "./index.css";



Number.prototype.toCurrency = function() {
  return this.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'})
}

const elem = document.getElementById("root")!;
const app = (
  <AppProvider />
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}
