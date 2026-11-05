import { Fragment } from "react";
import { useLocation, Link } from "react-router";

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  if (location.pathname === "/")
    return (
      <nav aria-label="Breadcrumb">
        <span aria-current="page">
          <strong>Home</strong>
        </span>
      </nav>
    );

  return (
    <nav aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {pathnames.map((pathname, i, arr) => {
        const currentPath = `/${arr.slice(0, i + 1).join("/")}`;
        const pathnameFormatted = pathname[0].toUpperCase() + pathname.slice(1);

        return (
          <Fragment key={currentPath}>
            <span aria-hidden="true"> / </span>
            {i === pathnames.length - 1 ? (
              <span aria-current="page">
                <strong>{pathnameFormatted}</strong>
              </span>
            ) : (
              <Link to={currentPath}>{pathnameFormatted}</Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
