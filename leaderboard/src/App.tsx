import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";

// Lazy load components
const Home = lazy(() => import("./Home"));
const ChallengePage = lazy(() => import("./simulation/pages/ChallengePage"));

function App() {
	const [showSplash, setShowSplash] = useState(true);

	return (
		<Router>
			{showSplash && (
				<LoadingScreen onComplete={() => setShowSplash(false)} />
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

export default App;
