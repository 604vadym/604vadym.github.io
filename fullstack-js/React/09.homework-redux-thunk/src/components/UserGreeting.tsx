import { selectTheme } from "../redux/selectors/themeSelectors";
import { selectUser } from "../redux/selectors/userSelectors";
import { useAppSelector } from "../redux/hooks";
import "./UserGreeting.css";

function UserGreeting() {
  const { user, status } = useAppSelector(selectUser);
  const theme = useAppSelector(selectTheme);

  if (status !== "succeeded") {
    return null;
  }

  return (
    user && (
      <span className={`user-greeting user-greeting--${theme}`}>
        Hello, {user.username}
      </span>
    )
  );
}

export default UserGreeting;
