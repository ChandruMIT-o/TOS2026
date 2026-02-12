import type { User } from "./types";

const MOCK_USERS: Record<string, User> = {
	"operative1@tos.com": {
		id: "u1",
		name: "Viper",
		email: "operative1@tos.com",
		phone: "999-001-1001",
		ticketId: "TOS-001",
		hasTicket: true,
	},
	"operative2@tos.com": {
		id: "u2",
		name: "Ghost",
		email: "operative2@tos.com",
		phone: "999-002-2002",
		ticketId: "TOS-002",
		hasTicket: true,
	},
	"civilian@tos.com": {
		id: "u3",
		name: "Civilian",
		email: "civilian@tos.com",
		phone: "000-000-0000",
		ticketId: "",
		hasTicket: false,
	},
};

const MOCK_INVITES: Record<string, { from: User }> = {
	"operative2@tos.com": { from: MOCK_USERS["operative1@tos.com"] },
};

export const loginUser = async (email: string): Promise<User> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const user = MOCK_USERS[email];
			if (!user) {
				reject(new Error("User not found"));
			} else if (!user.hasTicket) {
				reject(
					new Error(
						"No valid ToS ticket found for this generated ID.",
					),
				);
			} else {
				resolve(user);
			}
		}, 800);
	});
};

export const checkInvites = async (
	email: string,
): Promise<{ from: User } | null> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(MOCK_INVITES[email] || null);
		}, 500);
	});
};

export const sendInvite = async (
	fromUser: User,
	toEmail: string,
): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`Invite sent from ${fromUser.email} to ${toEmail}`);
			// In a real app, this would update the backend
			resolve();
		}, 1000);
	});
};
