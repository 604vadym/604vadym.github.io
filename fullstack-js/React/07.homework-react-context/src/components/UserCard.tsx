import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { type User } from "../types/interfaces";
import "./UserCard.css";

type UserCardProps = Omit<User, "id">;

function UserCard({ name, age, gender }: UserCardProps) {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`user-card user-card--${theme}`}>
      <p>{name}</p>
      <p>{age} years</p>
      <p>{gender}</p>
    </div>
  );
}

export default UserCard;
