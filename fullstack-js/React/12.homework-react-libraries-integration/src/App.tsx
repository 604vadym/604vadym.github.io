import { useState } from "react";
import { useIdleTimer } from "react-idle-timer";
import {
    FiActivity,
    FiAlertCircle,
    FiCheckCircle,
    FiClock,
    FiInfo,
} from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ActivityStatus = "active" | "idle";

const IDLE_TIMEOUT = 60_000;

function App() {
    const [activityStatus, setActivityStatus] =
        useState<ActivityStatus>("active");

    const handleOnIdle = () => {
        setActivityStatus("idle");
        toast.info("You have been inactive for a while.");
    };

    const handleOnActive = () => {
        setActivityStatus("active");
    };

    const { getRemainingTime, reset } = useIdleTimer({
        timeout: IDLE_TIMEOUT,
        onIdle: handleOnIdle,
        onActive: handleOnActive,
        throttle: 500,
    });

    const showSuccess = () =>
        toast.success("Operation completed successfully.");

    const showWarning = () => toast.warning("This is a warning notification.");

    const showError = () => toast.error("Something went wrong.");

    return (
        <main className="page">
            <section className="playground" aria-labelledby="page-title">
                <header className="header">
                    <div className="logo" aria-hidden="true">
                        <FiActivity />
                    </div>

                    <div>
                        <p className="eyebrow">React integration demo</p>
                        <h1 id="page-title">Libraries Playground</h1>
                        <p className="subtitle">
                            A small demonstration of three useful React
                            libraries.
                        </p>
                    </div>
                </header>

                <section
                    className="demo-section"
                    aria-labelledby="notifications-title"
                >
                    <div className="section-heading">
                        <FiInfo aria-hidden="true" />
                        <h2 id="notifications-title">Toast notifications</h2>
                    </div>

                    <p className="description">
                        Select a notification type to see React Toastify in
                        action.
                    </p>

                    <div className="actions">
                        <button
                            className="button button-success"
                            onClick={showSuccess}
                        >
                            <FiCheckCircle aria-hidden="true" />
                            Success
                        </button>

                        <button
                            className="button button-warning"
                            onClick={showWarning}
                        >
                            <FiAlertCircle aria-hidden="true" />
                            Warning
                        </button>

                        <button
                            className="button button-error"
                            onClick={showError}
                        >
                            <FiAlertCircle aria-hidden="true" />
                            Error
                        </button>
                    </div>
                </section>

                <section
                    className="demo-section activity-section"
                    aria-labelledby="activity-title"
                >
                    <div className="section-heading">
                        <FiClock aria-hidden="true" />
                        <h2 id="activity-title">Activity monitor</h2>
                    </div>

                    <p className="description">
                        The status changes after 60 seconds without user
                        interaction.
                    </p>

                    <div className="activity-info">
                        <div className="status-row">
                            <span
                                className={`status-indicator ${activityStatus}`}
                            />

                            <span className="status-label">
                                {activityStatus === "active"
                                    ? "Active"
                                    : "Idle"}
                            </span>

                            <span className="status-note">
                                {Math.ceil(getRemainingTime() / 1000)}s until
                                idle
                            </span>
                        </div>

                        <button
                            className="button button-secondary"
                            onClick={reset}
                        >
                            <FiActivity aria-hidden="true" />
                            Reset activity
                        </button>
                    </div>
                </section>

                <footer className="footer">
                    Icons by React Icons · Notifications by React Toastify ·
                    Activity tracking by React Idle Timer
                </footer>
            </section>

            <ToastContainer position="top-right" autoClose={3000} />
        </main>
    );
}

export default App;
