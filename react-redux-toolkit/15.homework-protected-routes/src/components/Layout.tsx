import { NavLink, Outlet } from "react-router";

function Layout() {
  return (
    <>
      <nav className="navigation">
        <ul>
          <li>
            <NavLink to="/" end>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/login"> Login/Logout</NavLink>
          </li>
          <li>
            <NavLink to="/gallery"> Gallery</NavLink>
          </li>
        </ul>
      </nav>
      <Outlet />
    </>
  );
}

export default Layout;
