import { useEffect } from "react";
import { useAppDispatch } from "./redux/hooks";
import { fetchUser } from "./redux/slices/userSlice";
import { selectUser } from "./redux/selectors/userSelectors";
import { useAppSelector } from "./redux/hooks";
import ThemeToggler from "./components/ThemeToggler";
import UserGreeting from "./components/UserGreeting";
import UserPage from "./components/UserPage";

function App() {
  const { status } = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUser(6));
    }
  }, [dispatch, status]);

  return (
    <>
      <ThemeToggler />
      <UserGreeting />
      <UserPage />
    </>
  );
}

export default App;
