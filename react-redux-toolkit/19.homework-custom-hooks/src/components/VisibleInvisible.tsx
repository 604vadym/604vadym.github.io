import useToggle from "../hooks/useToggle";
import "./VisibleInvisible.css";

function VisibleInvisible() {
    const [isVisible, toggle, show, hide] = useToggle(true);

    return (
        <div>
            <span
                className="my-span"
                style={{
                    visibility: isVisible ? "visible" : "hidden",
                }}
            >
                Some text
            </span>{" "}
            <button type="button" onClick={toggle}>
                Toggle visibility
            </button>
            <button type="button" onClick={show}>
                Show
            </button>
            <button type="button" onClick={hide}>
                Hide
            </button>
        </div>
    );
}

export default VisibleInvisible;
