import { useSearchParams } from "react-router";

function Pagination() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") ?? 1);

  const gotoPage = (newPageNumber: number) => {
    setSearchParams((prev) => {
      const newSearchParams = new URLSearchParams(prev);
      if (newPageNumber > 1) {
        newSearchParams.set("page", newPageNumber.toString());
      } else {
        newSearchParams.delete("page");
      }
      return newSearchParams;
    });
  };

  return (
    <>
      <button type="button" onClick={() => gotoPage(currentPage + 1)}>
        Next
      </button>
      <button type="button" onClick={() => gotoPage(currentPage - 1)}>
        Prev
      </button>
    </>
  );
}

export default Pagination;
