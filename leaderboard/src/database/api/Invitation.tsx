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
	type Unsubscribe,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type { User } from "../../components/registration/types";

export interface TeamFormation {
	id?: string;
	inviter_email: string;
	invitee_email: string;
	inviter_name?: string;
	created_at: Timestamp;
	responded_at?: Timestamp;
	status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const INVITES_COLLECTION = "tos_invites";

// Create a new invite
export const createInvite = async (inviter: User, inviteeEmail: string) => {
	// check if invitee has any pending invite or accepted invite
	const q = query(
		collection(db, INVITES_COLLECTION),
		where("invitee_email", "==", inviteeEmail),
		where("status", "in", ["PENDING", "ACCEPTED"]),
	);
	const snapshot = await getDocs(q);
	if (!snapshot.empty) {
		throw new Error("User already has a pending or accepted invite.");
	}

	// check if inviter has any pending invite
	const q2 = query(
		collection(db, INVITES_COLLECTION),
		where("inviter_email", "==", inviter.email),
		where("status", "in", ["PENDING", "ACCEPTED"]),
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
		where("status", "in", ["PENDING", "ACCEPTED"]),
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
		where("status", "in", ["PENDING", "ACCEPTED"]),
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
export const acceptInvite = async (inviteId: string) => {
	const inviteRef = doc(db, INVITES_COLLECTION, inviteId);
	await updateDoc(inviteRef, {
		status: "ACCEPTED",
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
