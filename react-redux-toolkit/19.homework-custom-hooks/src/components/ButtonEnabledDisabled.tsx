import useToggle from "../hooks/useToggle";

function ButtonEnabledDisabled() {
    const [isDisabled, toggle, disable, enable] = useToggle(false);

    return (
        <div>
            <button type="button" disabled={isDisabled}>
                Some text
            </button>
            <button type="button" onClick={toggle}>
                Toggle activity
            </button>
            <button type="button" onClick={enable}>
                Enable
            </button>
            <button type="button" onClick={disable}>
                Disable
            </button>
        </div>
    );
}

export default ButtonEnabledDisabled;
