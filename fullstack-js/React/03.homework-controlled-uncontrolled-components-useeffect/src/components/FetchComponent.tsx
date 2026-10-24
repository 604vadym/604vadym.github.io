import { useState, useEffect } from "react";
import { fetchData } from "../utils/api";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

function FetchComponent() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPhotos() {
      setPhotos(null);
      setError(null);
      setIsLoading(true);
      try {
        const dataPhotos = await fetchData<Photo[]>(
          "https://jsonplaceholder.typicode.com/photos",
        );
        if (isMounted) {
          setPhotos(dataPhotos);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPhotos();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <p>Error loading photos: {error}</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!photos || photos.length === 0) {
    return <p>No photos found.</p>;
  }

  return (
    <ul
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "5px",
        listStyle: "none",
        paddingLeft: 0,
      }}
    >
      {photos.slice(0, 50).map(({ id, thumbnailUrl, title }) => {
        return (
          <li key={id}>
            <img
              src={thumbnailUrl}
              alt={title}
              width={150}
              height={150}
              style={{ display: "block" }}
            />
          </li>
        );
      })}
    </ul>
  );
}

export default FetchComponent;
