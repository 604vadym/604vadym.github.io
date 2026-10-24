import "./App.css";

const movies = [
  { id: 101, title: "Втеча з Шоушенка", year: 1994 },
  { id: 102, title: "Хрещений батько", year: 1972 },
  { id: 103, title: "Темний лицар", year: 2008 },
  { id: 104, title: "12 розгніваних чоловіків", year: 1957 },
  { id: 105, title: "Список Шиндлера", year: 1993 },
];

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Movies</h1>

      <ul className="films-list">
        {movies.map(({ id, title, year }) => (
          <li key={id} className="film-item">
            <span className="film-title">{title}</span>{" "}
            <span className="film-year">({year})</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
