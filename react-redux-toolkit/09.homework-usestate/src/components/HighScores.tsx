import { useState, useRef, Fragment } from "react";

interface Score {
  id: UUID;
  value: number;
}

type UUID = `${string}-${string}-${string}-${string}-${string}`;
type sortingOrder = "ascending" | "descending" | "none";

function createScore(): Score {
  return { id: crypto.randomUUID(), value: Math.floor(Math.random() * 101) };
}

function HighScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const sortingOrder = useRef<sortingOrder>("none");

  const getSortedScores = (scores: Score[]): Score[] => {
    if (sortingOrder.current === "none") {
      throw new Error("Sorting is aborted. Current sorting order is 'none'");
    }

    return scores.toSorted((a, b) =>
      sortingOrder.current === "ascending"
        ? a.value - b.value
        : b.value - a.value,
    );
  };

  const handleAddRandom = (): void => {
    try {
      const updatedScores =
        sortingOrder.current === "none"
          ? [...scores, createScore()]
          : getSortedScores([...scores, createScore()]);

      setScores(updatedScores);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveMin = (): void => {
    const minScore = Math.min(...scores.map((score) => score.value));
    const updatedScores = scores.filter((score) => score.value !== minScore);
    setScores(updatedScores);
    if (updatedScores.length === 0) {
      sortingOrder.current = "none";
    }
  };

  const handleIncreaseAllByTen = (): void =>
    setScores(scores.map((score) => ({ ...score, value: score.value + 10 })));

  const handleResetAll = () => {
    sortingOrder.current = "none";
    setScores([]);
  };

  const handleSort = (order: sortingOrder): void => {
    if (order === "none") return;
    sortingOrder.current = order;
    try {
      setScores(getSortedScores(scores));
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = (id: UUID): void => {
    setScores(scores.filter((score) => score.id !== id));
  };

  return (
    <>
      <button onClick={handleAddRandom}>Add random</button>
      <button
        onClick={handleRemoveMin}
        disabled={scores.length === 0 ? true : false}
      >
        Remove min
      </button>
      <button
        onClick={handleIncreaseAllByTen}
        disabled={scores.length === 0 ? true : false}
      >
        Increase all by 10
      </button>
      <button
        onClick={handleResetAll}
        disabled={scores.length === 0 ? true : false}
      >
        Reset all
      </button>
      <button
        onClick={() => handleSort("ascending")}
        disabled={
          scores.length < 2 || sortingOrder.current === "ascending"
            ? true
            : false
        }
      >
        Sort ascending ↑
      </button>
      <button
        onClick={() => handleSort("descending")}
        disabled={
          scores.length < 2 || sortingOrder.current === "descending"
            ? true
            : false
        }
      >
        Sort descending ↓
      </button>
      <div>
        {scores.map((score) => (
          <Fragment key={score.id}>
            <div style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              <span>{score.value}</span>
              <button onClick={() => handleRemove(score.id)}>❌</button>
            </div>
            <span> </span>
          </Fragment>
        ))}
      </div>
    </>
  );
}

export default HighScores;
