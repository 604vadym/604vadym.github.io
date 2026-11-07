import React from "react";
import { BrowserRouter, Link, Routes, Route } from "react-router";
import { Suspense } from "react";

const HeavyChart = React.lazy(() => {
    return new Promise<typeof import("./components/HeavyChart")>((resolve) =>
        setTimeout(() => resolve(import("./components/HeavyChart")), 3000),
    );
});

const BigTable = React.lazy(() => {
    return new Promise<typeof import("./components/BigTable")>((resolve) =>
        setTimeout(() => resolve(import("./components/BigTable")), 1500),
    );
});

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Link to="/dashboard">Dashboard</Link>}
                />
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <Suspense fallback={<div>Loading table...</div>}>
                                <BigTable />
                            </Suspense>
                            <Suspense fallback={<div>Loading chart...</div>}>
                                <HeavyChart />
                            </Suspense>
                        </>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
