import { useSearchParams } from "react-router";

function SearchFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const handleSearchChange = (value: string) => {
    setSearchParams(() => {
      const newSearchParams = new URLSearchParams("");
      if (value) {
        newSearchParams.set("q", value);
      } else {
        newSearchParams.delete("q");
      }
      return newSearchParams;
    });
  };

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => handleSearchChange(e.target.value)}
    />
  );
}

export default SearchFilter;
