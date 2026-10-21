import React from "react";
import "./NavigationMenu.css";

const menuItems = [
  { id: 1, name: "Головна", url: "/" },
  { id: 2, name: "Про нас", url: "/about" },
  { id: 3, name: "Контакти", url: "/contact" },
  { id: 4, name: "Блог", url: "/blog" },
];

const handleLinkClick = (
  e: React.SyntheticEvent<HTMLAnchorElement>,
  name: string,
  url: string,
): void => {
  e.preventDefault();
  const isConfirmed = confirm(`Перейти на ${name}?`);
  if (isConfirmed) {
    alert(`Перехід на ${name} ${url}`);
  }
};

function NavigationMenu() {
  return (
    <nav className="navigation-menu">
      <h2 className="menu-title">Меню навігації</h2>
      <ul className="menu-list">
        {menuItems.map(({ id, name, url }) => (
          <li key={id} className="menu-item">
            <a
              className="menu-link"
              onClick={(e) => {
                handleLinkClick(e, name, url);
              }}
              href={url}
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavigationMenu;
