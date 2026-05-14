import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Agenda from "./pages/Agenda";
import CreezVotreEvent from "./pages/CreezVotreEvent";
import Cookies from "./pages/Cookies";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/creez-votre-event" element={<CreezVotreEvent />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/politique-de-confidentialite" element={<PrivacyPolicy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
