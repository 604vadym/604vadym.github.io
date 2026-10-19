import "./ProductCard.css";

interface ProductCardProps {
  name: string;
  price: number;
  inStock: boolean;
  discount: number;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  isFeatured: boolean;
  freeShipping: boolean;
}

function ProductCard(props: ProductCardProps) {
  const { name, price, inStock, discount, rating, isFeatured, freeShipping } =
    props;

  if (!inStock) {
    return (
      <div className="cardUnavailable">
        <h3>{name}</h3>
        <p className="unavailableText">❌ Товар недоступний</p>

        <button className="notifyButton">Повідомити про надходження</button>
      </div>
    );
  }

  const finalPrice = discount > 0 ? price * ((100 - discount) / 100) : price;

  return (
    <div className="card">
      {isFeatured && <span className="featuredBadge">🔥 Рекомендуємо</span>}

      {discount > 0 && <span className="discountBadge">-{discount}%</span>}

      <h3>{name}</h3>

      <div className="priceContainer">
        {discount > 0 ? (
          <>
            <span className="oldPrice">{price} грн</span>
            <span className="newPrice">{finalPrice} грн</span>
          </>
        ) : (
          <span className="price">{finalPrice} грн</span>
        )}
      </div>

      {rating > 0 && (
        <p className="rating">
          {"⭐".repeat(rating)} ({rating}/5)
        </p>
      )}

      {freeShipping && (
        <span className="shipping">🚚 Безкоштовна доставка</span>
      )}

      <p className="stockStatus">
        {inStock ? "✅ В наявності" : "❌ Немає в наявності"}
      </p>

      <button className="buyButton">
        {inStock ? "Купити" : "Повідомити про надходження"}
      </button>
    </div>
  );
}

export default ProductCard;
