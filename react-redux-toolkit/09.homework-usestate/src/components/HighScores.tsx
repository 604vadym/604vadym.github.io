import { useState } from "react";

interface Score {
  id: `${string}-${string}-${string}-${string}-${string}`;
  value: number;
}

function HighScores() {
  const [scores, setScores] = useState<Score[]>([]);

  const handleClickRandom = () =>
    setScores([
      ...scores,
      { id: crypto.randomUUID(), value: Math.floor(Math.random() * 101) },
    ]);

  const handleClickRemove = () => {
    const minScore = Math.min(...scores.map((score) => score.value));
    setScores(scores.filter((score) => score.value !== minScore));
  };

  const handleClickIncrease = () =>
    setScores(scores.map((score) => ({ ...score, value: score.value + 10 })));

  return (
    <>
      <button onClick={handleClickRandom}>Add random</button>
      <button onClick={handleClickRemove}>Remove min</button>
      <button onClick={handleClickIncrease}>Increase all by 10</button>
      <div>
        {scores.map((score) => (
          <span key={score.id}>{score.value} </span>
        ))}
      </div>
    </>
  );
}

export default HighScores;
