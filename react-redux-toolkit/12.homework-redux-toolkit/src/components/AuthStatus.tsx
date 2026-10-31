import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginSuccess, logout, selectAuth } from "../redux/slices/authSlice";

function AuthStatus() {
  const { isAuthenticated, user } = useAppSelector(selectAuth, shallowEqual);
  const username = user?.name;
  const dispatch = useAppDispatch();

  return isAuthenticated ? (
    <>
      <p>Hello, {username}!</p>
      <button type="button" onClick={() => dispatch(logout())}>
        Exit
      </button>
    </>
  ) : (
    <>
      <p>You are not authorized</p>
      <button
        type="button"
        onClick={() => dispatch(loginSuccess({ id: 1, name: "John" }))}
      >
        Enter
      </button>
    </>
  );
}

export default AuthStatus;
