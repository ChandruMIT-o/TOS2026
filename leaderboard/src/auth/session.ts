import {
	browserLocalPersistence,
	setPersistence,
	signInWithEmailAndPassword,
	signOut,
	type User,
} from "firebase/auth";
import { auth } from "../lib/firebase";

// Configuration for 30-day session
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Initializes the auth session with local persistence.
 * This effectively keeps the user logged in across browser restarts.
 */
export const initializeAuth = async () => {
	try {
		await setPersistence(auth, browserLocalPersistence);
	} catch (error) {
		console.error("Error setting auth persistence:", error);
	}
};

/**
 * Logs in the user with email and password.
 * Ensures the session persistence is set.
 */
export const login = async (email: string, password: string): Promise<User> => {
	try {
		// Ensure persistence is set before signing in
		await setPersistence(auth, browserLocalPersistence);

		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password,
		);
		return userCredential.user;
	} catch (error) {
		throw error;
	}
};

/**
 * Logs out the current user.
 */
export const logout = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error("Error signing out:", error);
		throw error;
	}
};

/**
 * Checks if the current session is valid based on the 30-day requirement.
 * Should be called when the app usage state is restored or on critical actions.
 * @param user The current firebase user
 * @returns boolean indicating if session is valid
 */
export const isSessionValid = (user: User | null): boolean => {
	if (!user) return false;

	// Check if session has exceeded 30 days
	// Note: We use lastSignInTime or creationTime as a reference.
	// For strict session aging, you might want to store a custom timestamp in DB.
	const lastLoginTime = user.metadata.lastSignInTime
		? new Date(user.metadata.lastSignInTime).getTime()
		: Date.now();

	const timeSinceLogin = Date.now() - lastLoginTime;

	if (timeSinceLogin > SESSION_DURATION_MS) {
		// Session expired
		logout();
		return false;
	}

	return true;
};
