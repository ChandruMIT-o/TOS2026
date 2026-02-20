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
		round: 3,
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
		round: 4,
		inputs: { A: { energy: 11, nodes: 3 }, B: { energy: 1, nodes: 3 } },
		choices: {
			A: { type: "HARVEST", invalid: true },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "harvested +7 Energy" },
			B: { text: "harvested +7 Energy" },
		},
	},
	{
		round: 5,
		inputs: { A: { energy: 3, nodes: 4 }, B: { energy: 3, nodes: 4 } },
		choices: { A: { type: "HARVEST" }, B: { type: "HARVEST" } },
		results: {
			A: { text: "harvested +12 Energy" },
			B: { text: "harvested +8 Energy" },
		},
	},
	{
		round: 6,
		inputs: { A: { energy: 7, nodes: 5 }, B: { energy: 6, nodes: 4 } },
		choices: {
			A: { type: "HARVEST", invalid: true },
			B: { type: "EXPAND", targetNode: 10 },
		},
		results: {
			A: { text: "harvested +13 Energy" },
			B: { text: "expanded to Node 10 (Cost: 5)" },
		},
	},
	{
		round: 7,
		inputs: { A: { energy: 5, nodes: 6 }, B: { energy: 10, nodes: 5 } },
		choices: {
			A: { type: "HARVEST", invalid: true },
			B: { type: "EXPAND", targetNode: 12 },
		},
		results: {
			A: { text: "harvested +18 Energy" },
			B: { text: "expanded to Node 12 (Cost: 5)" },
		},
	},
	{
		round: 8,
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
		round: 9,
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
		round: 10,
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
		round: 11,
		inputs: { A: { energy: 14, nodes: 11 }, B: { energy: 6, nodes: 8 } },
		choices: {
			A: { type: "CONQUER", targetNode: 18 },
			B: { type: "EXPAND", targetNode: 19 },
		},
		results: {
			A: { text: "conquered Node 18 from B (Cost: 8)" },
			B: { text: "expanded to Node 19 (Cost: 5)" },
		},
	},
	{
		round: 12,
		inputs: { A: { energy: 1, nodes: 13 }, B: { energy: 13, nodes: 8 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "EXPAND", targetNode: 22 },
		},
		results: {
			A: { text: "harvested +37 Energy" },
			B: { text: "expanded to Node 22 (Cost: 5)" },
		},
	},
	{
		round: 13,
		inputs: { A: { energy: 30, nodes: 14 }, B: { energy: 3, nodes: 9 } },
		choices: {
			A: { type: "EXPAND", targetNode: 24 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "expanded to Node 24 (Cost: 15)" },
			B: { text: "harvested +13 Energy" },
		},
	},
	{
		round: 14,
		inputs: { A: { energy: 10, nodes: 15 }, B: { energy: 11, nodes: 10 } },
		choices: {
			A: { type: "CONQUER", targetNode: 25 },
			B: { type: "EXPAND", targetNode: 26 },
		},
		results: {
			A: { text: "conquered Node 25 from B (Cost: 8)" },
			B: { text: "expanded to Node 26 (Cost: 5)" },
		},
	},
	{
		round: 15,
		inputs: { A: { energy: 46, nodes: 16 }, B: { energy: 20, nodes: 10 } },
		choices: {
			A: { type: "CONQUER", targetNode: 26 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "conquered Node 26 from B (Cost: 8)" },
			B: { text: "harvested +13 Energy" },
		},
	},
	{
		round: 16,
		inputs: { A: { energy: 83, nodes: 16 }, B: { energy: 23, nodes: 10 } },
		choices: {
			A: { type: "CONQUER", targetNode: 2 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "conquered Node 2 from B (Cost: 8)" },
			B: { text: "harvested +13 Energy" },
		},
	},
	{
		round: 17,
		inputs: { A: { energy: 120, nodes: 16 }, B: { energy: 26, nodes: 10 } },
		choices: {
			A: { type: "CONQUER", targetNode: 2 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "conquered Node 2 from B (Cost: 8)" },
			B: { text: "harvested +13 Energy" },
		},
	},
	{
		round: 18,
		inputs: { A: { energy: 157, nodes: 16 }, B: { energy: 29, nodes: 10 } },
		choices: {
			A: { type: "CONQUER", targetNode: 2 },
			B: { type: "HARVEST" },
		},
		results: {
			A: { text: "conquered Node 2 from B (Cost: 8)" },
			B: { text: "harvested +13 Energy" },
		},
	},
	{
		round: 19,
		inputs: { A: { energy: 194, nodes: 16 }, B: { energy: 32, nodes: 10 } },
		choices: {
			A: { type: "CONQUER", targetNode: 2 },
			B: { type: "CONQUER", targetNode: 3 },
		},
		results: {
			A: { text: "conquered Node 2 from B (Cost: 8)" },
			B: { text: "conquered Node 3 from A (Cost: 10)" },
		},
	},
	{
		round: 20,
		inputs: { A: { energy: 178, nodes: 17 }, B: { energy: 35, nodes: 9 } },
		choices: {
			A: { type: "HARVEST" },
			B: { type: "CONQUER", targetNode: 2 },
		},
		results: {
			A: { text: "harvested +45 Energy" },
			B: { text: "conquered Node 2 from A (Cost: 10)" },
		},
	},
];
