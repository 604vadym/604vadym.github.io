import { selectTheme } from "../redux/slices/themeSlice";
import { useAppSelector } from "../redux/hooks";
import { type User } from "../types/interfaces";
import "./UserCard.css";

type UserCardProps = Omit<User, "id">;

function UserCard({ name, age, gender }: UserCardProps) {
  const theme = useAppSelector(selectTheme);

  return (
    <div className={`user-card user-card--${theme}`}>
      <p>{name}</p>
      <p>{age} years</p>
      <p>{gender}</p>
    </div>
  );
}

export default UserCard;
