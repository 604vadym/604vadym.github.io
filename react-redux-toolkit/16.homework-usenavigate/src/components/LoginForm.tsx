import { useNavigate } from "react-router";

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    navigate("/dashboard", {
      replace: true,
      state: {
        message: "Login successful!",
        user: "John",
      },
    });
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Enter</button>
      </form>
    </>
  );
}

export default LoginForm;
