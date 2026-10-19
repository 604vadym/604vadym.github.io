import UserStatus from "./components/UserStatus";
import ProductCard from "./components/ProductCard ";

function App() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <section>
        <UserStatus
          isLoggedIn={false}
          username="Олена"
          role="user"
          isOnline={true}
        />

        <UserStatus
          isLoggedIn={true}
          username="Олена"
          role="admin"
          isOnline={true}
        />

        <UserStatus
          isLoggedIn={true}
          username="Іван"
          role="user"
          isOnline={false}
        />

        <UserStatus
          isLoggedIn={true}
          username=""
          role="guest"
          isOnline={true}
        />
      </section>

      <section style={{ marginTop: "40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <ProductCard
            name="Ноутбук Lenovo"
            price={25000}
            inStock={false}
            discount={0}
            rating={4}
            isFeatured={true}
            freeShipping={false}
          />

          <ProductCard
            name="Навушники Sony"
            price={3500}
            inStock={true}
            discount={15}
            rating={5}
            isFeatured={true}
            freeShipping={true}
          />

          <ProductCard
            name="Клавіатура Logitech"
            price={1200}
            inStock={true}
            discount={0}
            rating={4}
            isFeatured={false}
            freeShipping={false}
          />

          <ProductCard
            name="Миша Razer"
            price={2000}
            inStock={true}
            discount={30}
            rating={5}
            isFeatured={true}
            freeShipping={true}
          />
        </div>
      </section>
    </div>
  );
}

export default App;
