export type ActionType = "HARVEST" | "EXPAND" | "CONQUER";

export interface PlayerState {
	energy: number;
	nodes: number;
}

export interface Choice {
	type: ActionType;
	targetNode?: number;
	invalid?: boolean;
}

export interface Result {
	text: string;
}

export interface Round {
	round: number;
	inputs: {
		A: PlayerState;
		B: PlayerState;
	};
	choices: {
		A: Choice;
		B: Choice;
	};
	results: {
		A: Result;
		B: Result;
	};
}
export const matchData: Round[] = [
	{
		round: 1,
		inputs: { A: { energy: 0, nodes: 1 }, B: { energy: 0, nodes: 1 } },
		choices: { A: { type: "HARVEST" }, B: { type: "HARVEST" } },
		results: {
			A: { text: "harvested +5 Energy" },
			B: { text: "harvested +5 Energy" },
		},
	},
	{
		round: 2,
		inputs: { A: { energy: 5, nodes: 1 }, B: { energy: 5, nodes: 1 } },
		choices: {
			A: { type: "EXPAND", targetNode: 2 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "expanded to Node 2 (Cost: 5)" },
			B: { text: "harvested +5 Energy" },
		},
	},
	{
		round: 3,
		inputs: { A: { energy: 0, nodes: 2 }, B: { energy: 10, nodes: 1 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 3 },
		},
		results: {
			A: { text: "harvested +6 Energy" },
			B: { text: "expanded to Node 3 (Cost: 5)" },
		},
	},
	{
		round: 4,
		inputs: { A: { energy: 6, nodes: 2 }, B: { energy: 5, nodes: 2 } },
		choices: { A: { type: "HARVEST" }, B: { type: "HARVEST" } },
		results: {
			A: { text: "harvested +6 Energy" },
			B: { text: "harvested +6 Energy" },
		},
	},
	{
		round: 5,
		inputs: { A: { energy: 12, nodes: 2 }, B: { energy: 11, nodes: 2 } },
		choices: {
			A: { type: "CONQUER", targetNode: 3 },
			B: { type: "EXPAND", targetNode: 5 },
		},
		results: {
			A: { text: "conquered Node 3 from B (Cost: 8)" },
			B: { text: "expanded to Node 5 (Cost: 5)" },
		},
	},
	{
		round: 6,
		inputs: { A: { energy: 4, nodes: 3 }, B: { energy: 6, nodes: 2 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 6 },
		},
		results: {
			A: { text: "harvested +7 Energy" },
			B: { text: "expanded to Node 6 (Cost: 5)" },
		},
	},
	{
		round: 7,
		inputs: { A: { energy: 11, nodes: 3 }, B: { energy: 1, nodes: 3 } },
		choices: { A: { type: "HARVEST" }, B: { type: "HARVEST" } },
		results: {
			A: { text: "harvested +7 Energy" },
			B: { text: "harvested +7 Energy" },
		},
	},
	{
		round: 8,
		inputs: { A: { energy: 18, nodes: 3 }, B: { energy: 8, nodes: 3 } },
		choices: {
			A: { type: "EXPAND", targetNode: 4 },
			B: { type: "EXPAND", targetNode: 8 },
		},
		results: {
			A: { text: "expanded to Node 4 (Cost: 15)" },
			B: { text: "expanded to Node 8 (Cost: 5)" },
		},
	},
	{
		round: 9,
		inputs: { A: { energy: 3, nodes: 4 }, B: { energy: 3, nodes: 4 } },
		choices: { A: { type: "HARVEST" }, B: { type: "HARVEST" } },
		results: {
			A: { text: "harvested +12 Energy" },
			B: { text: "harvested +8 Energy" },
		},
	},
	{
		round: 10,
		inputs: { A: { energy: 15, nodes: 4 }, B: { energy: 11, nodes: 4 } },
		choices: {
			A: { type: "CONQUER", targetNode: 8 },
			B: { type: "EXPAND", targetNode: 9 },
		},
		results: {
			A: { text: "conquered Node 8 from B (Cost: 8)" },
			B: { text: "expanded to Node 9 (Cost: 5)" },
		},
	},
	{
		round: 11,
		inputs: { A: { energy: 7, nodes: 5 }, B: { energy: 6, nodes: 4 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 10 },
		},
		results: {
			A: { text: "harvested +13 Energy" },
			B: { text: "expanded to Node 10 (Cost: 5)" },
		},
	},
	{
		round: 12,
		inputs: { A: { energy: 20, nodes: 5 }, B: { energy: 1, nodes: 5 } },
		choices: {
			A: { type: "EXPAND", targetNode: 7 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "expanded to Node 7 (Cost: 15)" },
			B: { text: "harvested +9 Energy" },
		},
	},
	{
		round: 13,
		inputs: { A: { energy: 5, nodes: 6 }, B: { energy: 10, nodes: 5 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 12 },
		},
		results: {
			A: { text: "harvested +18 Energy" },
			B: { text: "expanded to Node 12 (Cost: 5)" },
		},
	},
	{
		round: 14,
		inputs: { A: { energy: 23, nodes: 6 }, B: { energy: 5, nodes: 6 } },
		choices: {
			A: { type: "CONQUER", targetNode: 12 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "conquered Node 12 from B (Cost: 8)" },
			B: { text: "harvested +9 Energy" },
		},
	},
	{
		round: 15,
		inputs: { A: { energy: 15, nodes: 7 }, B: { energy: 14, nodes: 5 } },
		choices: {
			A: { type: "EXPAND", targetNode: 11 },
			B: { type: "EXPAND", targetNode: 13 },
		},
		results: {
			A: { text: "expanded to Node 11 (Cost: 15)" },
			B: { text: "expanded to Node 13 (Cost: 5)" },
		},
	},
	{
		round: 16,
		inputs: { A: { energy: 0, nodes: 8 }, B: { energy: 9, nodes: 6 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 15 },
		},
		results: {
			A: { text: "harvested +24 Energy" },
			B: { text: "expanded to Node 15 (Cost: 5)" },
		},
	},
	{
		round: 17,
		inputs: { A: { energy: 24, nodes: 8 }, B: { energy: 4, nodes: 7 } },
		choices: {
			A: { type: "EXPAND", targetNode: 16 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "expanded to Node 16 (Cost: 5)" },
			B: { text: "harvested +11 Energy" },
		},
	},
	{
		round: 18,
		inputs: { A: { energy: 19, nodes: 9 }, B: { energy: 15, nodes: 7 } },
		choices: {
			A: { type: "EXPAND", targetNode: 17 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "expanded to Node 17 (Cost: 15)" },
			B: { text: "harvested +11 Energy" },
		},
	},
	{
		round: 19,
		inputs: { A: { energy: 4, nodes: 10 }, B: { energy: 26, nodes: 7 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 20 },
		},
		results: {
			A: { text: "harvested +30 Energy" },
			B: { text: "expanded to Node 20 (Cost: 15)" },
		},
	},
	{
		round: 20,
		inputs: { A: { energy: 34, nodes: 10 }, B: { energy: 11, nodes: 8 } },
		choices: {
			A: { type: "CONQUER", targetNode: 20 },
			B: { type: "EXPAND", targetNode: 18 },
		},
		results: {
			A: { text: "conquered Node 20 from B (Cost: 8)" },
			B: { text: "expanded to Node 18 (Cost: 5)" },
		},
	},
];
