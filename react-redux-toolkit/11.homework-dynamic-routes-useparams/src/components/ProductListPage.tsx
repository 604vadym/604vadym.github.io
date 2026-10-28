import { Link } from "react-router";
import { products } from "../data";

function ProductListPage() {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default ProductListPage;
