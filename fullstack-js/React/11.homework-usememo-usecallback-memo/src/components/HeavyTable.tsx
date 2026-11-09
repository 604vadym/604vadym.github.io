import { memo } from "react";

interface HeavyTableProps {
    style: React.CSSProperties;
    onClick: () => void;
}

function HeavyTable({ style, onClick }: HeavyTableProps) {
    return (
        <div>
            <button onClick={onClick}>
                Trigger parent rerender (tests useMemo & useCallback propagation
                and React.memo)
            </button>
            <h2>Big static table</h2>
            <table style={style}>
                <thead>
                    <tr>
                        <th>ID</th>
                        {Array.from({ length: 50 }).map((_, cIndex) => (
                            <th key={cIndex}>Column {cIndex + 1}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 100 }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            <td>
                                <div>
                                    <span>
                                        <b>row-{rowIndex}</b>
                                    </span>
                                </div>
                            </td>
                            {Array.from({ length: 50 }).map((_, colIndex) => (
                                <td key={colIndex}>
                                    <div>
                                        <span>
                                            <strong>Value:</strong>
                                            <span>
                                                {" "}
                                                Data R{rowIndex} C
                                                {colIndex}{" "}
                                            </span>
                                            <b>(static)</b>
                                        </span>
                                    </div>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default memo(HeavyTable);
