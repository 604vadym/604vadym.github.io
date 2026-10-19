import UserStatus from "./components/UserStatus";

function App() {
  return (
    <>
      <UserStatus
        isLoggedIn={false}
        username="Олена"
        role="user"
        isOnline={true}
      />
      <UserStatus
        isLoggedIn={true}
        username="Олена"
        role="admin"
        isOnline={true}
      />
      <UserStatus
        isLoggedIn={true}
        username="Іван"
        role="user"
        isOnline={false}
      />
    </>
  );
}

export default App;
