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

export async function loadUserProfile() {
    const token = localStorage.getItem("authToken");

    if (!token) {
        console.warn("Auth Error: No token found");
        return false;
    }

    try {
        const response = await fetch("https://example.com", {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) return false;

        const data = await response.json();
        return data;
    } catch (error) {
        return false;
    }
}
