/* =========================
   Common helpers
========================= */

// Use: import { Timestamp } from "firebase/firestore"
export type Timestamp = any;

export type UserRole = "PARTICIPANT" | "ADMIN";

/* =========================
   Users
   collection: users/{uid}
   Matches: functions/model/users.py
========================= */

export interface User {
	uid: string;
	name: string;
	email: string;
	phone: string;
	institute: string;
	year: number;
	role: UserRole;

	// Python dataclass uses CamelCase for these two specifically
	createdAt?: Timestamp;
	updatedAt?: Timestamp;
}

/* =========================
   Teams
   docId = team_name (immutable)
   collection: tos_teams/{team_name}
   Matches: functions/model/team_registration.py
========================= */

export interface Team {
	/** slug used as document ID */
	team_name: string;

	mode: string;

	/** list of user UIDs */
	members: string[];

	finalized_strategy?: string;

	created_at: Timestamp;

	// Note: In Python, this is a Dict. If you move to subcollections,
	// this field might not exist on the parent doc, or it might be a summary.
	// drafts?: Record<string, Draft>;
}

/* =========================
   Strategy Stats (shared shape)
   Matches: functions/model/team_registration.py
========================= */

export interface StrategyStats {
	strategy: string; // strategy slug
	rank: number;
	points: number;
	wins: number;
	draws: number;
	losses: number;

	total_nodes: number; // snake_case
	matches: number;

	// Optional because it appears in leaderboard.py but not team_registration.py
	team_name?: string;
}

/* =========================
   Drafts
   Matches: functions/model/team_registration.py
   (Assuming subcollection structure based on your previous TS snippet)
========================= */

export interface Draft {
	strategy_name?: string; // snake_case
	strategy_desc?: string; // snake_case
	code?: string;

	// In Python, this is a Dict[str, StrategyStats]
	tournament_result?: Record<string, StrategyStats>;

	// timestamps weren't in the python Draft class,
	// but are good practice for DB entries
	created_at?: Timestamp;
	updated_at?: Timestamp;
}

/* =========================
   Leaderboard
   collection: tos_leaderboard/{strategy}
========================= */

export interface LeaderboardEntry extends StrategyStats {}
