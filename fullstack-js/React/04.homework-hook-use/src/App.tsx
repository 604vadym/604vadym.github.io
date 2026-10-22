import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import PhotosComponent from "./components/PhotosComponent";
import { fetchData } from "./utils/api";

function App() {
  return (
    <>
      <h1>Fetching data with simulated latency 2222 ms</h1>
      <div>
        <h2>Fetching with correct url:</h2>
        <ErrorBoundary fallback={<p>Error loading photos.</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <PhotosComponent
              photosPromise={fetchData(
                "https://jsonplaceholder.typicode.com/photos",
              )}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div>
        <h2>Fetching with incorrect url:</h2>
        <ErrorBoundary fallback={<p>Error loading photos.</p>}>
          <Suspense fallback={<p>Loading...</p>}>
            <PhotosComponent
              photosPromise={fetchData(
                "https://jsonplaceholder.typicode.com/nonexistent",
              )}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default App;
