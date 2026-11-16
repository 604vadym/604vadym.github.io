import { useId } from "react";

interface QuestionItemProps {
    question: string;
}

function QuestionItem({ question }: QuestionItemProps) {
    const questionId = useId();
    return (
        <div>
            <label htmlFor={questionId}>{question}</label>{" "}
            <input type="text" id={questionId} />{" "}
            <span>Generated id: {questionId}</span>
        </div>
    );
}

export default QuestionItem;
