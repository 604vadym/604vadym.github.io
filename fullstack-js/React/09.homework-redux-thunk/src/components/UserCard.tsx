import { selectTheme } from "../redux/selectors/themeSelectors";
import { selectUser } from "../redux/selectors/userSelectors";
import { useAppSelector } from "../redux/hooks";
import "./UserCard.css";

function UserCard() {
  const { user, status, error } = useAppSelector(selectUser);
  const theme = useAppSelector(selectTheme);
  const userCardClassName = `user-card user-card--${theme}`;

  if (status === "idle") {
    return null;
  }

  if (status === "loading") {
    return <div className={userCardClassName}>Loading...</div>;
  }

  if (status === "failed") {
    return <div className={userCardClassName}>Error: {error}</div>;
  }

  return (
    user && (
      <div className={userCardClassName}>
        <p>Username: {user.username}</p>
        <p>Name: {user.name}</p>
        <p>City: {user.address.city}</p>
        <p>Street: {user.address.street}</p>
        <p>Email: {user.email}</p>
        <p>Website: {user.website}</p>
        <p>Phone: {user.phone}</p>
      </div>
    )
  );
}

export default UserCard;
