import "./UserStatus.css";

interface UserStatusProps {
  isLoggedIn: boolean;
  username: string;
  role: "admin" | "user" | "guest";
  isOnline: boolean;
}

function UserStatus({ isLoggedIn, username, role, isOnline }: UserStatusProps) {
  if (!isLoggedIn)
    return (
      <div className="container">
        <p>Будь ласка, увійдіть в акаунт</p>
      </div>
    );

  const greeting =
    role === "admin"
      ? `Вітаємо, Адміністратор ${username}`
      : role === "user"
        ? `Привіт, ${username}`
        : `Привіт, Гість`;

  return (
    <div className="container">
      <h2>{greeting}</h2>
      <p className="status">{isOnline ? "🟢 В мережі" : "⚫ Офлайн"}</p>

      {role === "admin" && (
        <button className="adminButton">Панель адміністратора</button>
      )}

      {isOnline && role === "admin" && <span className="vipBadge">⭐ VIP</span>}
    </div>
  );
}

export default UserStatus;
