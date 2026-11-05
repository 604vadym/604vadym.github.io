interface LoginButtonProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginButton({ setIsLoggedIn }: LoginButtonProps) {
  return (
    <button type="button" onClick={() => setIsLoggedIn((prev) => !prev)}>
      Toggle log in/out
    </button>
  );
}

export { type LoginButtonProps };
export default LoginButton;
