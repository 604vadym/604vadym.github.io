import { useLocation, useNavigate } from "react-router";

function ProductListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const sortBy = searchParams.get("sortBy") ?? "rating";
  const category = searchParams.get("category") ?? "all";

  const updateSearchParams = (key: string, value: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set(key, value);
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  const handleResetAll = () => {
    navigate(location.pathname);
  };

  return (
    <>
      <h2>Current category: {category}</h2>
      <p>Sort by: {sortBy}</p>
      <button
        type="button"
        onClick={() => updateSearchParams("sortBy", "price")}
      >
        Sort by price
      </button>
      <button
        type="button"
        onClick={() => updateSearchParams("category", "electronics")}
      >
        Filter electronics
      </button>
      <button type="button" onClick={handleResetAll}>
        Reset all
      </button>
    </>
  );
}

export default ProductListPage;
