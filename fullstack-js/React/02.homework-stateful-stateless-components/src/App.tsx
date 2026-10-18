import StatelessComponent from "./components/StatelessComponent";
import StatefulComponent from "./components/StatefulComponent";

function showCurrentDateTime() {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = currentDate.getFullYear();
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");

  alert(`Date: ${day}.${month}.${year}\nTime: ${hours}:${minutes}`);
}

function App() {
  return (
    <>
      <StatelessComponent
        text="Current date & time"
        handleClick={showCurrentDateTime}
      />
      <br />
      <br />
      <StatefulComponent />
    </>
  );
}

export default App;
