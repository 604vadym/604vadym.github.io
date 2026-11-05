import ProductListPage from "./components/ProductListPage";
import Breadcrumbs from "./components/Breadcrumbs";
import Navigation from "./components/Navigation";
import "./index.css";

function App() {
  return (
    <>
      <Breadcrumbs />
      <ProductListPage />
      <br />
      <br />
      <Navigation />
    </>
  );
}

export default App;
