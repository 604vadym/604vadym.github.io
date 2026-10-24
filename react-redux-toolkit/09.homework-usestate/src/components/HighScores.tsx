import { useState, Fragment } from "react";

interface Score {
  id: UUID;
  value: number;
}

type UUID = `${string}-${string}-${string}-${string}-${string}`;
type SortingOrder = "ascending" | "descending" | "none";

function createScore(): Score {
  return { id: crypto.randomUUID(), value: Math.floor(Math.random() * 101) };
}

function sortScores(scores: Score[], order: SortingOrder): Score[] {
  if (order === "none") return scores;

  return scores.toSorted((a, b) =>
    order === "ascending" ? a.value - b.value : b.value - a.value,
  );
}

function HighScores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [sortingOrder, setSortingOrder] = useState<SortingOrder>("none");

  const checkScoresEmptiness = (updatedScores: Score[]): void => {
    if (updatedScores.length === 0) {
      setSortingOrder("none");
    }
  };

  const handleClickAddRandom = (): void => {
    const updatedScores = [...scores, createScore()];
    setScores(sortScores(updatedScores, sortingOrder));
  };

  const handleClickRemoveMin = (): void => {
    if (scores.length === 0) return;

    const minScore = Math.min(...scores.map((score) => score.value));
    const updatedScores = scores.filter((score) => score.value !== minScore);
    setScores(updatedScores);
    checkScoresEmptiness(updatedScores);
  };

  const handleClickIncreaseAllByTen = (): void =>
    setScores(scores.map((score) => ({ ...score, value: score.value + 10 })));

  const handleClickResetAll = () => {
    setSortingOrder("none");
    setScores([]);
  };

  const handleClickSort = (order: SortingOrder): void => {
    if (order === "none") return;
    setSortingOrder(order);
    setScores(sortScores(scores, order));
  };

  const handleClickRemove = (id: UUID): void => {
    const updatedScores = scores.filter((score) => score.id !== id);
    setScores(updatedScores);
    checkScoresEmptiness(updatedScores);
  };

  return (
    <>
      <button onClick={handleClickAddRandom}>Add random</button>
      <button onClick={handleClickRemoveMin} disabled={scores.length === 0}>
        Remove min
      </button>
      <button
        onClick={handleClickIncreaseAllByTen}
        disabled={scores.length === 0}
      >
        Increase all by 10
      </button>
      <button onClick={handleClickResetAll} disabled={scores.length === 0}>
        Reset all
      </button>
      <button
        onClick={() => handleClickSort("ascending")}
        disabled={scores.length < 2 || sortingOrder === "ascending"}
      >
        Sort ascending ↑
      </button>
      <button
        onClick={() => handleClickSort("descending")}
        disabled={scores.length < 2 || sortingOrder === "descending"}
      >
        Sort descending ↓
      </button>
      <div>
        {scores.map((score) => (
          <Fragment key={score.id}>
            <div style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              <span>{score.value}</span>
              <button type="button" onClick={() => handleClickRemove(score.id)}>
                ❌
              </button>
            </div>
            <span> </span>
          </Fragment>
        ))}
      </div>
    </>
  );
}

export default HighScores;
