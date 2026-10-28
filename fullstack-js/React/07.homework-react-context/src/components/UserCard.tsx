import { useContext } from "react";
import { ThemeContext } from "../context/AppContext";
import { type User } from "../types/interfaces";
import "./UserCard.css";

type UserCardProps = Omit<User, "id">;

function UserCard({ name, age, gender }: UserCardProps) {
  const theme = useContext(ThemeContext);
  const bgColour = theme === "dark" ? "grey" : "yellow";

  return (
    <div className="user-card" style={{ backgroundColor: bgColour }}>
      <p>{name} </p>
      <p>{age} years</p>
      <p>{gender}</p>
    </div>
  );
}

export default UserCard;
