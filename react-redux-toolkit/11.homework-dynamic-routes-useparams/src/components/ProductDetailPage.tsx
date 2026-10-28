import { useParams } from "react-router";
import { products } from "../data";

function ProductDetailPage() {
  const { productId } = useParams();

  const product = products.find((product) => product.id === productId);

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <p>
      {product.name}: {product.price}$
    </p>
  );
}

export default ProductDetailPage;
