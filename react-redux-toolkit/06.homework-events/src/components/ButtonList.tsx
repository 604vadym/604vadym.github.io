import "./ButtonList.css";

const actions = [
  { id: 1, name: "Зберегти", action: "save" },
  { id: 2, name: "Видалити", action: "delete" },
  { id: 3, name: "Редагувати", action: "edit" },
  { id: 4, name: "Поділитися", action: "share" },
];

function handleClick(name: string, action: string): void {
  alert(`name: ${name} action: ${action}`);
}

function ButtonList() {
  return (
    <div className="button-list">
      <div className="buttons-container">
        {actions.map(({ id, name, action }) => (
          <button
            key={id}
            className="action-button"
            onClick={() => handleClick(name, action)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ButtonList;
