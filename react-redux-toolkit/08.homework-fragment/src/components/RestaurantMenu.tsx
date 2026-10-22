import { Fragment } from "react/jsx-runtime";
import "./RestaurantMenu.css";

const menuData = [
  {
    categoryId: 1,
    categoryName: "Перші страви",
    items: [
      {
        id: 101,
        name: "Борщ український",
        price: 85,
        description: "З м'ясом та сметаною",
      },
      { id: 102, name: "Солянка", price: 95, description: "М'ясна збірна" },
    ],
  },
  {
    categoryId: 2,
    categoryName: "Основні страви",
    items: [
      {
        id: 201,
        name: "Курка по-київськи",
        price: 180,
        description: "З гарніром",
      },
      {
        id: 202,
        name: "Стейк з яловичини",
        price: 250,
        description: "Середньої прожарки",
      },
    ],
  },
  {
    categoryId: 3,
    categoryName: "Десерти",
    items: [
      {
        id: 301,
        name: "Тірамісу",
        price: 75,
        description: "Класичний італійський",
      },
      { id: 302, name: "Чізкейк", price: 70, description: "Нью-йоркський" },
    ],
  },
];

function RestaurantMenu() {
  return (
    <div className="menu">
      <h1 className="menu-title ">Меню ресторану</h1>

      {menuData.map((category) => (
        <Fragment key={category.categoryId}>
          <div className="category">
            <h2 className="category-name">{category.categoryName}</h2>

            <ul className="items-list">
              {category.items.map((item) => (
                <li key={item.id} className="menu-item">
                  <div className="item-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="item-price">{item.price}</span>
                  </div>
                  <p className="item-description">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

export default RestaurantMenu;
