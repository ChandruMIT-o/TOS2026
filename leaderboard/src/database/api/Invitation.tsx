import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
	Timestamp,
	onSnapshot,
	deleteDoc,
	getDoc,
	type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { User } from "../../components/registration/types";

export interface TeamFormation {
	id?: string;
	inviter_email: string;
	invitee_email: string;
	inviter_name?: string;
	invitee_uid?: string; // UID of the invitee, set upon acceptance
	team_name?: string; // Set when inviter finalizes the team
	created_at: Timestamp;
	responded_at?: Timestamp;
	status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
}

const INVITES_COLLECTION = "tos_invites";

// Create a new invite
export const createInvite = async (inviter: User, inviteeEmail: string) => {
	// check if invitee exists in users collection
	const usersQ = query(
		collection(db, "users"),
		where("email", "==", inviteeEmail),
	);
	const usersSnapshot = await getDocs(usersQ);
	if (usersSnapshot.empty) {
		throw new Error("No operative found with this email address.");
	}

	// check if invitee has any pending invite or accepted invite (AS INVITEE)
	const q = query(
		collection(db, INVITES_COLLECTION),
		where("invitee_email", "==", inviteeEmail),
		where("status", "in", ["PENDING", "ACCEPTED", "COMPLETED"]),
	);
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		throw new Error(
			"This user has already received an invite and cannot accept new ones.",
		);
	}

	// check if invitee has any pending invite or accepted invite (AS INVITER)
	const q3 = query(
		collection(db, INVITES_COLLECTION),
		where("inviter_email", "==", inviteeEmail),
		where("status", "in", ["PENDING", "ACCEPTED", "COMPLETED"]),
	);
	const snapshot3 = await getDocs(q3);
	if (!snapshot3.empty) {
		throw new Error(
			"This user has already sent an invite to someone else and it.",
		);
	}

	// check if inviter has any pending invite
	const q2 = query(
		collection(db, INVITES_COLLECTION),
		where("inviter_email", "==", inviter.email),
		where("status", "in", ["PENDING", "ACCEPTED", "COMPLETED"]),
	);
	const snapshot2 = await getDocs(q2);
	if (!snapshot2.empty) {
		throw new Error("You already have a pending or accepted invite.");
	}

	const newInvite: TeamFormation = {
		inviter_email: inviter.email,
		invitee_email: inviteeEmail,
		inviter_name: inviter.name,
		created_at: Timestamp.now(),
		status: "PENDING",
	};

	const docRef = await addDoc(collection(db, INVITES_COLLECTION), newInvite);
	return { id: docRef.id, ...newInvite };
};

// Check if the current user has sent or received any invites
export const checkUserInviteStatus = async (email: string) => {
	// Check if user is invitee
	const qInvitee = query(
		collection(db, INVITES_COLLECTION),
		where("invitee_email", "==", email),
		where("status", "in", ["PENDING", "ACCEPTED", "COMPLETED"]),
	);
	const snapshotInvitee = await getDocs(qInvitee);
	if (!snapshotInvitee.empty) {
		const docData = snapshotInvitee.docs[0].data() as TeamFormation;
		return {
			id: snapshotInvitee.docs[0].id,
			...docData,
			role: "invitee" as const,
		};
	}

	// Check if user is inviter
	const qInviter = query(
		collection(db, INVITES_COLLECTION),
		where("inviter_email", "==", email),
		where("status", "in", ["PENDING", "ACCEPTED", "COMPLETED"]),
	);
	const snapshotInviter = await getDocs(qInviter);
	if (!snapshotInviter.empty) {
		const docData = snapshotInviter.docs[0].data() as TeamFormation;
		return {
			id: snapshotInviter.docs[0].id,
			...docData,
			role: "inviter" as const,
		};
	}

	return null;
};

// Accept an invite
export const acceptInvite = async (inviteId: string, userUid: string) => {
	const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
	await updateDoc(inviteRef, {
		status: "ACCEPTED",
		invitee_uid: userUid,
		responded_at: Timestamp.now(),
	});
};

// Reject an invite
export const rejectInvite = async (inviteId: string) => {
	const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
	await updateDoc(inviteRef, {
		status: "REJECTED",
		responded_at: Timestamp.now(),
	});
};

// Cancel an invite (delete it)
export const cancelInvite = async (inviteId: string) => {
	const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
	await deleteDoc(inviteRef);
};

// Real-time listener for an invite
export const listenToInvite = (
	inviteId: string,
	callback: (data: TeamFormation | null) => void,
): Unsubscribe => {
	const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
	return onSnapshot(inviteRef, (docSnap) => {
		if (docSnap.exists()) {
			callback({ id: docSnap.id, ...docSnap.data() } as TeamFormation);
		} else {
			callback(null);
		}
	});
};

// Complete an invite (finalize team)
export const completeInvite = async (inviteId: string, teamName: string) => {
	const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
	await updateDoc(inviteRef, {
		status: "COMPLETED",
		team_name: teamName,
		responded_at: Timestamp.now(),
	});
};

// Check if user is already in a team
export const getTeamByMemberUid = async (uid: string) => {
	const q = query(
		collection(db, "tos_teams"),
		where("members", "array-contains", uid),
	);
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		return snapshot.docs[0].data();
	}
	return null;
};

// Delete a team (Abort)
export const deleteTeam = async (teamName: string) => {
	// 1. Delete the team document
	await deleteDoc(doc(db, "tos_teams", teamName));

	// 2. Find and delete associated invites (to allow re-inviting)
	// We need to find invites where team_name == teamName
	const q = query(
		collection(db, INVITES_COLLECTION),
		where("team_name", "==", teamName),
	);
	const snapshot = await getDocs(q);
	const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
	await Promise.all(deletePromises);
};

// Create a self-invite for Solo users (to block incoming invites)
export const createSelfInvite = async (user: User, teamName: string) => {
	const newInvite: TeamFormation = {
		inviter_email: user.email,
		invitee_email: user.email, // Self
		inviter_name: user.name,
		invitee_uid: user.id,
		team_name: teamName,
		created_at: Timestamp.now(),
		responded_at: Timestamp.now(),
		status: "COMPLETED",
	};
	await addDoc(collection(db, INVITES_COLLECTION), newInvite);
};

// Get user profile by UID
export const getUserProfile = async (uid: string) => {
	const userDoc = await getDocs(
		query(collection(db, "users"), where("uid", "==", uid)),
	);
	if (!userDoc.empty) {
		return userDoc.docs[0].data() as User;
	}
	// Fallback if querying by document ID directly (if uid IS docId)
	// The models.ts says collection: users/{uid}, so docId IS uid.
	// But let's try getDoc just in case the above query fails or if structure matches
	const directDoc = await getDoc(doc(db, "users", uid));
	if (directDoc.exists()) return directDoc.data() as User;

	return null;
};

// Check if team name exists
export const checkTeamNameExists = async (teamName: string) => {
	const teamRef = doc(db, "tos_teams", teamName);
	const teamSnap = await getDoc(teamRef);
	return teamSnap.exists();
};

// Verify user has a valid event ticket
export const verifyUserTicket = async (uid: string) => {
	// First, check if the user is explicitly registered for TOS
	const userRef = doc(db, "users", uid);
	const userSnap = await getDoc(userRef);

	if (userSnap.exists()) {
		const userData = userSnap.data();
		if (userData.tos_registered === true) {
			return "TOS_PRE_REGISTERED";
		}
	}

	const ordersQuery = query(
		collection(db, "orders"),
		where("userId", "==", uid),
		where("status", "==", "PAID"),
	);
	const ordersSnapshot = await getDocs(ordersQuery);

	if (ordersSnapshot.empty) {
		throw new Error(
			"No order found. Please ensure you have purchased an eligible pass.",
		);
	}

	const validEventIds = [
		"pass-global",
		"pass-tech",
		"combo1",
		"combo2",
		"combo3",
	];
	let hasValidTicket = false;
	let ticketId = "";

	for (const docSnap of ordersSnapshot.docs) {
		const data = docSnap.data();
		if (data.items && Array.isArray(data.items)) {
			for (const item of data.items) {
				if (item.eventId && validEventIds.includes(item.eventId)) {
					hasValidTicket = true;
					ticketId = docSnap.id;
					break;
				}
			}
		}
		if (hasValidTicket) break;
	}

	if (!hasValidTicket) {
		throw new Error(
			"No valid ticket found. Please ensure you have purchased an eligible pass.",
		);
	}

	return ticketId;
};
