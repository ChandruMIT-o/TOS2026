import { Timestamp } from "firebase/firestore";

interface TeamFormation {
	inviter_email: string;
	invitee_email: string;
	inviter_name?: string;
	created_at: Timestamp;
	responded_at?: Timestamp;
	status: "PENDING" | "ACCEPTED" | "REJECTED";
}
