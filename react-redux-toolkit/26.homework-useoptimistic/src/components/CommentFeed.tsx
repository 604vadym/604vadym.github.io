import { useState, useOptimistic, useTransition, useRef } from "react";

interface Comment {
    id: number;
    text: string;
    author: string;
    isPending?: boolean;
}

function CommentFeed() {
    const [comments, setComments] = useState<Comment[]>([
        { id: 1, text: "Some text 1", author: "User1" },
        { id: 2, text: "Some text 2", author: "User2" },
        { id: 3, text: "Some text 3", author: "User3" },
    ]);
    const [optimisticComments, addOptimistic] = useOptimistic<
        Comment[],
        Comment
    >(comments, (state, comment) => [
        ...state,
        { ...comment, isPending: true },
    ]);
    const [isPending, startTransition] = useTransition();

    const handleSendComment = (text: string) => {
        const comment = {
            id: comments.length + 1,
            text,
            author: "User" + (comments.length + 1),
        };
        addOptimistic(comment);

        startTransition(async () => {
            await new Promise<void>((resolve) => setTimeout(resolve, 1500));
            if (text.includes("bug")) return;
            setComments((prev) => [...prev, comment]);
        });
    };
    const msgRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        const trimmedValue = msgRef.current?.value.trim() || "";
        if (!trimmedValue) return;
        handleSendComment(trimmedValue);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <textarea ref={msgRef} disabled={isPending} required />
                </div>

                <button type="submit">Send</button>
            </form>
            {optimisticComments.map((optimisticComment) => (
                <div key={optimisticComment.id}>
                    <span
                        style={{
                            opacity:
                                optimisticComment.isPending === true
                                    ? "0.5"
                                    : "1",
                        }}
                    >
                        {optimisticComment.author}: {optimisticComment.text}
                    </span>{" "}
                    {optimisticComment.isPending && "Sending..."}
                </div>
            ))}
        </>
    );
}

export default CommentFeed;
