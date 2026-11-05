import LoginButton, { type LoginButtonProps } from "./LoginButton";

function LoginPage({ setIsLoggedIn }: LoginButtonProps) {
  return (
    <>
      <h1>Log in/out Page</h1>
      <LoginButton setIsLoggedIn={setIsLoggedIn} />
    </>
  );
}

export default LoginPage;
