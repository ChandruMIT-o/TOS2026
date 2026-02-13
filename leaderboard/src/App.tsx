import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { LoadingProvider, useLoading } from "./context/LoadingContext";

// Lazy load components
const Home = lazy(() => import("./Home"));
const ChallengePage = lazy(() => import("./simulation/pages/ChallengePage"));

function AppContent() {
	const [timerCompleted, setTimerCompleted] = useState(false);
	const { pageLoaded } = useLoading();

	// Show splash if timer hasn't completed OR page hasn't loaded
	// But once splash is gone, keep it gone (timerCompleted is permanent)
	// We only show splash if !timerCompleted OR (!pageLoaded AND !timerCompleted?)
	// Actually: we want to wait for BOTH conditions to be true before hiding.
	const showSplash = !timerCompleted || !pageLoaded;

	return (
		<Router>
			{showSplash && (
				<LoadingScreen onComplete={() => setTimerCompleted(true)} />
			)}
			<Suspense
				fallback={
					<div className="min-h-screen bg-black flex items-center justify-center text-white font-mono">
						Loading...
					</div>
				}
			>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/sim" element={<ChallengePage />} />
				</Routes>
			</Suspense>
		</Router>
	);
}

function App() {
	return (
		<LoadingProvider>
			<AppContent />
		</LoadingProvider>
	);
}

export default App;
