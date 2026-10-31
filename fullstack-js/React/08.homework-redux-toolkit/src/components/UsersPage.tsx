import { selectTheme } from "../redux/slices/themeSlice";
import { useAppSelector } from "../redux/hooks";
import UserCard from "./UserCard";
import { users } from "../data/users";
import "./UsersPage.css";

function UsersPage() {
  const theme = useAppSelector(selectTheme);

  return (
    <div className={`layout layout--${theme}`}>
      {users.map(({ id, name, age, gender }) => (
        <UserCard key={id} name={name} age={age} gender={gender} />
      ))}
    </div>
  );
}

export default UsersPage;
