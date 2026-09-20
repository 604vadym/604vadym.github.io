export function validateAndSubmit(text, onSuccess) {
    if (text.length >= 3) {
        onSuccess(text);
        return true;
    }
    return false;
}
