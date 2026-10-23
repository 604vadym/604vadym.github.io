import { useState } from "react";

function HighScores() {
  const [scores, setScores] = useState<number[]>([]);

  const handleClickRandom = () =>
    setScores([...scores, Math.floor(Math.random() * 101)]);

  const handleClickRemove = () => {
    const minScore = Math.min(...scores);
    setScores(scores.filter((score) => score !== minScore));
  };

  const handleClickIncrease = () =>
    setScores(scores.map((score) => score + 10));

  return (
    <>
      <button onClick={handleClickRandom}>Add random</button>
      <button onClick={handleClickRemove}>Remove min</button>
      <button onClick={handleClickIncrease}>Increase all by 10</button>
      <div>
        {scores.map((score) => (
          <span key={crypto.randomUUID()}>{score} </span>
        ))}
      </div>
    </>
  );
}

export default HighScores;
