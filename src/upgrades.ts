import { state } from "./systems/state";

export type Upgrade = {
	powerRequirement: number;
	title: string | HTMLElement;
	description: string | HTMLElement;
	onPurchase: () => void;
};

export const upgrades: Upgrade[] = [
	{
		powerRequirement: 42,
		title: "Life",
		description: 'is too short to "tap" by yourself',
		onPurchase: () => {
			state.fistSpeed.value = 0.5;
		},
	},
	{
		powerRequirement: 90,
		title: "Double Power",
		description: `to get double power per "tap"`,
		onPurchase: () => {
			state.fistPower.value = 2;
		},
	},
	{
		powerRequirement: 90,
		title: "Double Speed",
		description: `to get double auto "tapping" speed`,
		onPurchase: () => {
			state.fistSpeed.value = 1;
		},
	},
	{
		powerRequirement: 150,
		title: "Look Ma!",
		description: "two hands!!!",
		onPurchase: () => {
			state.twoHands.value = true;
		},
	},
	{
		powerRequirement: 200,
		title: "RED",
		description: "All I see is RED!",
		onPurchase: () => {
			state.gameColor.value = "#E25041";
		},
	},
	{
		powerRequirement: 225,
		title: "Double Power",
		description: `to get double power per "tap"`,
		onPurchase: () => {
			state.fistPower.value *= 2;
		},
	},
	{
		powerRequirement: 225,
		title: "Double Speed",
		description: `to get double auto "tapping" speed`,
		onPurchase: () => {
			state.fistSpeed.value *= 2;
		},
	},
	{
		powerRequirement: 325,
		title: "Zombies",
		description: '"play" with some zombies',
		onPurchase: () => {
			state.gameColor.value = "#41A85F";
		},
	},
	{
		powerRequirement: 325,
		title: "Angels",
		description: '"play" with some angels',
		onPurchase: () => {
			state.gameColor.value = "#2C82C9";
		},
	},
	{
		powerRequirement: 400,
		title: "💯 MAX 💯",
		description: "just MAX everything",
		onPurchase: () => {
			state.fistPower.value = 69;
			state.fistSpeed.value = 8;
		},
	},
];
