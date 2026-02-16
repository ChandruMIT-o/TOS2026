import { db } from "../../lib/firebase";
import {
	collection,
	query,
	orderBy,
	limit,
	getDocs,
	doc,
	getDoc,
} from "firebase/firestore";
import type { LeaderboardEntry, Team, User } from "../models";

// Define the shape of the joined data we return to the UI
export interface EnrichedLeaderboardEntry extends LeaderboardEntry {
	players: string[]; // We add the list of player names here
}

export const getLeaderboardData = async (
	limitCount: number = 100,
): Promise<EnrichedLeaderboardEntry[]> => {
	try {
		// 1. Fetch Top Leaderboard Entries
		// Collection matches: functions/model/leaderboard.py -> "tos_leaderboard"
		const leaderboardRef = collection(db, "tos_leaderboard");

		const q = query(
			leaderboardRef,
			orderBy("rank", "asc"),
			limit(limitCount),
		);
		const leaderboardSnap = await getDocs(q);

		if (leaderboardSnap.empty) return [];

		const leaderboard = leaderboardSnap.docs.map((d) => {
			// The data is already in snake_case in the DB,
			// so it matches our refined LeaderboardEntry interface directly.
			return d.data() as LeaderboardEntry;
		});

		// 2. Fetch Unique Teams
		const teamNames = [
			...new Set(
				leaderboard
					.map((entry) => entry.team_name) // Field: team_name
					.filter((n): n is string => !!n),
			),
		];

		// Collection matches: functions/model/upload_tos_teams.py -> "tos_teams"
		const teamPromises = teamNames.map((name) =>
			getDoc(doc(db, "tos_teams", name)),
		);
		const teamSnaps = await Promise.all(teamPromises);

		const teamMap = new Map<string, Team>();
		teamSnaps.forEach((snap) => {
			if (snap.exists()) {
				// The DB data matches the Team interface (team_name, members, etc.)
				teamMap.set(snap.id, snap.data() as Team);
			}
		});

		// 3. Fetch Unique Users (Players)
		const uidSet = new Set<string>();
		teamMap.forEach((team) =>
			// Field matches: functions/model/team_registration.py -> "members"
			team.members.forEach((uid) => uidSet.add(uid)),
		);

		const userPromises = Array.from(uidSet).map((uid) =>
			getDoc(doc(db, "users", uid)),
		);
		const userSnaps = await Promise.all(userPromises);

		const userMap = new Map<string, User>();
		userSnaps.forEach((snap) => {
			if (snap.exists()) userMap.set(snap.id, snap.data() as User);
		});

		// 4. Combine (Join) everything together
		return leaderboard.map((entry) => {
			// Use team_name to find the team
			const team = teamMap.get(entry.team_name || "");

			const players =
				team?.members // Use .members, not .memberUids
					.map((uid) => userMap.get(uid)?.name)
					.filter((name): name is string => !!name) ?? [];

			return {
				...entry,
				players,
			};
		});
	} catch (error) {
		console.error("Error fetching leaderboard:", error);
		throw error;
	}
};
