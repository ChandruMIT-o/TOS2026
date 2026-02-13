import { initializeApp } from "firebase/app";
import {
	getFirestore,
	collection,
	addDoc,
	doc,
	setDoc,
} from "firebase/firestore";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAUfli-3DogZnCzRZRfVT9Q8qw8K7kHSTE",
	authDomain: "tekhora-26.firebaseapp.com",
	projectId: "tekhora-26",
	storageBucket: "tekhora-26.firebasestorage.app",
	messagingSenderId: "55832820865",
	appId: "1:55832820865:web:0f21674b3195ee7024e180",
	measurementId: "G-JSEHNHW0PW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to raw_code directory (relative to this script in leaderboard/scripts/seed_strategies.js)
// We go up: scripts -> leaderboard -> TOS2026 -> draft -> raw_code
// So: ../../draft/raw_code is WRONG if we are in leaderboard/scripts.
// leaderboard is in TOS2026/leaderboard.
// draft is in TOS2026/draft.
// So: ../../draft/raw_code is correct.
const RAW_CODE_DIR = path.resolve(__dirname, "../../draft/raw_code");

async function uploadStrategies() {
	try {
		console.log(`Reading strategies from: ${RAW_CODE_DIR}`);
		const files = await fs.readdir(RAW_CODE_DIR);

		// Filter for .txt files
		const txtFiles = files.filter((file) => file.endsWith(".txt"));

		if (txtFiles.length === 0) {
			console.log("No .txt files found in raw_code directory.");
			return;
		}

		console.log(
			`Found ${txtFiles.length} strategy files. Uploading to Firestore...`,
		);

		const strategiesCollection = collection(db, "strategies");

		for (const file of txtFiles) {
			const filePath = path.join(RAW_CODE_DIR, file);
			const content = await fs.readFile(filePath, "utf-8");
			const name = path.basename(file, ".txt"); // e.g., "strat_hoarder"

			// Use the filename as the document ID for easy updates/reference
			const docRef = doc(db, "strategies", name);

			await setDoc(docRef, {
				name: name,
				code: content,
				updatedAt: new Date().toISOString(),
			});

			console.log(`Uploaded: ${name}`);
		}

		console.log("All strategies have been uploaded successfully!");
		process.exit(0);
	} catch (error) {
		console.error("Error uploading strategies:", error);
		process.exit(1);
	}
}

uploadStrategies();
