import { useEffect, useState } from "react";
import axios from "axios";

interface DataFetcherProps {
  postId: string;
}

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

function DataFetcher({ postId }: DataFetcherProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const getPost = async () => {
      setError(null);
      setPost(null);
      setIsLoading(true);

      try {
        const postData = (
          await axios.get(
            `https://jsonplaceholder.typicode.com/posts/${postId}`,
          )
        ).data as Post;

        if (isMounted) {
          setPost(postData);
        }
      } catch (err) {
        if (isMounted) {
          if (axios.isAxiosError(err)) {
            setError(
              err.response?.status === 404 ? "Post not found" : err.message,
            );
          } else if (err instanceof Error) {
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
    };

    getPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  if (error) {
    return (
      <>
        <p>Error fetching post {postId}. Available ids for request: 1-100.</p>
        <p> {error}.</p>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!post || Object.keys(post).length === 0) {
    return <p>No data found.</p>;
  }

  return (
    <>
      <h1>Fetched post {post.id}:</h1>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
    </>
  );
}

export default DataFetcher;
