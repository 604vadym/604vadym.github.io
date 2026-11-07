import { useState, useEffect } from "react";
import { fetchData } from "../utils/api";
import { type User } from "../types/interfaces";

function UserFetcher() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      setIsLoading(true);
      try {
        const dataUser = await fetchData<User>(
          "https://jsonplaceholder.typicode.com/users/6",
        );
        setUser(dataUser);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  if (error) {
    return <p>Error loading user: {error}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>No user found.</p>;
  }

  return (
    <>
      <p>Username: {user.username}</p>
      <p>City: {user.address.city}</p>
      <p>Email: {user.email}</p>
    </>
  );
}

export default UserFetcher;
