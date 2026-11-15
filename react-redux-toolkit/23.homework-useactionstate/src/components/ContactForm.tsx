import { useActionState } from "react";

type ContactState =
    | { success: null; message?: never; error?: never }
    | { success: true; message: string; error?: never }
    | { success: false; error: string; message?: never };

async function contactAction(
    _prevState: ContactState,
    formData: FormData,
): Promise<ContactState> {
    const email = formData.get("email")?.toString() ?? "";
    const message = formData.get("message")?.toString() ?? "";

    console.log("Sending form:", { email, message });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (email.toLowerCase().includes("fail")) {
        return {
            success: false,
            error: "Server rejected the request (test error).",
        };
    }

    return {
        success: true,
        message: "Your message was successfully sent.",
    };
}

function ContactForm() {
    const [state, formAction, isPending] = useActionState(contactAction, {
        success: null,
    });

    return (
        <form action={formAction}>
            <div>
                <label>
                    Email <input type="email" name="email" required />
                </label>
            </div>

            <div>
                <label>
                    Message <textarea name="message" required></textarea>
                </label>
            </div>

            <button type="submit" disabled={isPending}>
                {isPending ? "Sending..." : "Send"}
            </button>

            {state.success === true && (
                <p style={{ color: "green" }}>{state.message}</p>
            )}
            {state.success === false && (
                <p style={{ color: "red" }}>{state.error}</p>
            )}
        </form>
    );
}

export default ContactForm;
