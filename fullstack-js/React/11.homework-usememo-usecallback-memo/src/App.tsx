import { useState, useCallback, useMemo, useRef } from "react";
import HeavyTable from "./components/HeavyTable";
import "./App.css";

const MAX_DEFAULT = 8888888;

function countPrimes(max = MAX_DEFAULT) {
  let count = 0;
  for (let i = 2; i <= max; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) count++;
  }
  return count;
}

function App() {
  const [someState, setSomeState] = useState<boolean>(false);
  const [valueToCalculate, setValueToCalculate] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickCalculate = () => {
    const inputValue = Number(inputRef.current?.value);
    setValueToCalculate(inputValue || MAX_DEFAULT);
  };

  const handleClickTriggerRerender = () => setSomeState((prev) => !prev);

  const countPrimesMemoized = useMemo(
    () => countPrimes(valueToCalculate),
    [valueToCalculate],
  );

  const handleClickHeavyTable = useCallback(
    () => setSomeState((prev) => !prev),
    [],
  );

  const tableStyle = useMemo(() => ({ border: "3px solid black" }), []);

  return (
    <div>
      <h1>Memoization</h1>
      <div className="prime-numbers">
        <label>
          Enter number to calculate count of prime numbers (
          <strong>Heavy calculations!</strong>)
          <input
            ref={inputRef}
            type="number"
            placeholder={`${MAX_DEFAULT} by default`}
          />
        </label>
        <button type="button" onClick={handleClickCalculate}>
          Calculate
        </button>{" "}
        <button type="button" onClick={handleClickTriggerRerender}>
          Trigger rerender of component (tests useMemo with cached heavy
          calculations)
        </button>
        <h2>
          Result count of prime numbers in {valueToCalculate}:{" "}
          {countPrimesMemoized}
        </h2>
      </div>
      <h2>Current state: {String(someState)}</h2>
      <HeavyTable style={tableStyle} onClick={handleClickHeavyTable} />
    </div>
  );
}

export default App;
