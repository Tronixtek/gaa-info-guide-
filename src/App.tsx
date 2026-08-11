import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { About, AuthorProfile, Contact, EditorialPolicy } from "./pages/Company";
import { Pricing, Resources } from "./pages/Commerce";
import { GuideDetail, GuidesIndex } from "./pages/Guides";
import { Home } from "./pages/Home";
import { Privacy, Terms } from "./pages/Legal";
import { NotFound } from "./pages/NotFound";
import { PracticeIndex, PracticeTest } from "./pages/Practice";
import { TestTypeDetail, TestTypesIndex } from "./pages/TestTypes";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="practice" element={<PracticeIndex />} />
        <Route path="practice/:slug" element={<PracticeTest />} />

        <Route path="test-types" element={<TestTypesIndex />} />
        <Route path="test-types/:slug" element={<TestTypeDetail />} />

        <Route path="guides" element={<GuidesIndex />} />
        <Route path="guides/:slug" element={<GuideDetail />} />

        <Route path="resources" element={<Resources />} />
        <Route path="pricing" element={<Pricing />} />

        <Route path="about" element={<About />} />
        <Route path="about/:slug" element={<AuthorProfile />} />
        <Route path="editorial-policy" element={<EditorialPolicy />} />
        <Route path="contact" element={<Contact />} />

        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
