import { el } from "./helpers/dom";

export type Story = {
	powerRequirement: number;
	content: string | HTMLElement | HTMLElement[];
};

export const stories: Story[] = [
	{
		powerRequirement: 5,
		content: "Hey there!",
	},
	{
		powerRequirement: 10,
		content: "So you seek power?",
	},
	{
		powerRequirement: 15,
		content: "Lets see what you got!",
	},
	{
		powerRequirement: 20,
		content: `"Tap" faster!`,
	},
	{
		powerRequirement: 30,
		content: "FASTER!",
	},
	{
		powerRequirement: 42,
		content: "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
	},
	{
		powerRequirement: 69,
		content: "😎",
	},
	{
		powerRequirement: 80,
		content: "Alright, we're past that now!",
	},
	{
		powerRequirement: 90,
		content: "Upgrade time - choose wisely!",
	},
	{
		powerRequirement: 120,
		content: "I don't know if you have noticed 🤔",
	},
	{
		powerRequirement: 150,
		content: "but you're using the wrong fist 😅",
	},
	{
		powerRequirement: 200,
		content: "nor is the fist red 🤪",
	},
	{
		powerRequirement: 225,
		content: "Nice! More upgrades!",
	},
	{
		powerRequirement: 250,
		content: "Accurate game title at least, kinda...",
	},
	{
		powerRequirement: 275,
		content: [el("s", "Who"), el("strong", '&nbsp;What are you even "tapping"?')],
	},
	{
		powerRequirement: 300,
		content: "No! Don't tell me... 🫣",
	},
	{
		powerRequirement: 325,
		content: "🧟🧟🧟 Zombies or Angels 👼👼👼",
	},
	{
		powerRequirement: 350,
		content: "Really???",
	},
	{
		powerRequirement: 360,
		content: "🤮🤮🤮",
	},
	{
		powerRequirement: 400,
		content: "I just can't.. Take this!",
	},
	{
		powerRequirement: 500,
		content: "Happy now? You got the power!",
	},
	{
		powerRequirement: 5000,
		content: "Why are you still here?",
	},
	{
		powerRequirement: 10000,
		content: "There is no end...",
	},
	{
		powerRequirement: 15000,
		content: "kinda...",
	},
	{
		powerRequirement: 25000,
		content: "THE END",
	},
];
