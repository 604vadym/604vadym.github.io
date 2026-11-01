import { selectTheme } from "../redux/selectors/themeSelectors";
import { useAppSelector } from "../redux/hooks";
import UserCard from "./UserCard";
import "./UserPage.css";

function UserPage() {
  const theme = useAppSelector(selectTheme);

  return (
    <div className={`layout layout--${theme}`}>
      <UserCard />
    </div>
  );
}

export default UserPage;
