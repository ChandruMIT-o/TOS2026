import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ChallengePage from "./simulation/pages/ChallengePage";

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/sim" element={<ChallengePage />} />
			</Routes>
		</Router>
	);
}

export default App;
