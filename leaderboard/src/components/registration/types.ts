export type User = {
	id: string;
	name: string; // Call Sign
	email: string;
	phone: string; // Priority Com Link
	ticketId: string;
	hasTicket: boolean;
};

export type Team = {
	name: string;
	members: User[];
	mode: "SOLO" | "DUO";
};

export type RegistrationStep =
	| "LOGIN"
	| "MODE_SELECTION"
	| "SOLO_CONFIRMATION"
	| "DUO_INVITE"
	| "DUO_PENDING"
	| "DUO_CONFIRMED"
	| "TEAM_NAME"
	| "COMPLETED"
	| "INVITE_RECEIVED"; // Special state for when a user logs in and has an invite
