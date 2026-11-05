import { Link } from "react-router";

function Navigation() {
  return (
    <>
      <div className="navigation">
        <span>Paths:</span>
        <nav>
          <ul>
            <li>
              <Link to={"/products"}>Products</Link>
            </li>
            <li>
              <Link to={"/products/laptops"}>Laptops</Link>
            </li>
            <li>
              <Link to={"/products/laptops/apple"}>Apple</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}

export default Navigation;
