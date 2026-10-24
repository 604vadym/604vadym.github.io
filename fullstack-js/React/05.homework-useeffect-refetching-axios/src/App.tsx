import React, { useState } from "react";
import DataFetcher from "./components/DataFetcher";

function App() {
  const [postId, setPostId] = useState<string>("");
  const [requestedPostId, setRequestedPostId] = useState<string>("");

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setPostId(e.target.value);
  };

  const handleClickRequest = (): void => {
    if (postId) {
      setRequestedPostId(postId);
    }
  };

  const handleClickRemove = (): void => {
    setPostId("");
    setRequestedPostId("");
  };

  return (
    <>
      <input
        type="number"
        onChange={handleChangeInput}
        value={postId}
        placeholder="Enter post id"
      />
      <button
        type="button"
        disabled={
          !postId || Number(postId) <= 0 || !Number.isInteger(Number(postId))
        }
        onClick={handleClickRequest}
      >
        Request
      </button>
      <button
        disabled={!requestedPostId}
        type="button"
        onClick={handleClickRemove}
      >
        ❌
      </button>
      {requestedPostId && <DataFetcher postId={requestedPostId} />}
    </>
  );
}

export default App;
