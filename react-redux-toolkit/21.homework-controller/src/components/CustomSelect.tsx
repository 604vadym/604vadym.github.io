interface CustomSelectProps {
    value: string;
    name: string;
    onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

function CustomSelect({ value, name, onChange }: CustomSelectProps) {
    return (
        <select name={name} value={value} onChange={onChange}>
            <option value="">Select level</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
        </select>
    );
}

export default CustomSelect;
