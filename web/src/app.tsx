import { useRoute } from "./router";
import { HomePage } from "./pages/HomePage";
import { ManifestoPage } from "./pages/ManifestoPage";

export function App() {
  const path = useRoute();

  if (path === "/manifesto") {
    return <ManifestoPage />;
  }

  return <HomePage />;
}
