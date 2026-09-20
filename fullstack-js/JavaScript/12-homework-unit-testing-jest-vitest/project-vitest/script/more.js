export function validateAndSubmit(text, onSuccess) {
    if (text.length >= 3) {
        onSuccess(text);
        return true;
    }
    return false;
}

export function confirmAndSend(buttonId, onConfirm) {
    const button = document.getElementById(buttonId);
    if (!button) return false;

    button.addEventListener("click", () => {
        onConfirm({ event: "user_clicked", timestamp: Date.now() });
    });

    return true;
}
