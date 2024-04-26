import { rng } from "../helpers/numbers";
import { Signal, createSignal } from "./signals";

const STATE_KEY = "red-right-fist";

export type Path = "sound" | "screen";

export type State = {
	seed: Signal<number>;
	lastProcessedAt: Signal<number>;
	sound: Signal<boolean | null>;
	level: Signal<number>;
	power: Signal<number>;
	storyIndex: Signal<number>;
	storyProgress: Signal<number>;
	fistSpeed: Signal<number>;
	fistPower: Signal<number>;
	twoHands: Signal<boolean>;
	activeUpgradePower: Signal<number>;
	gameColor: Signal<string>;
	gameStartTime: Signal<number>;
	gameEndTime: Signal<number>;
};

export const emptyState: State = {
	seed: createSignal(Date.now()),
	lastProcessedAt: createSignal(Date.now()),
	sound: createSignal(null),
	level: createSignal(0),
	power: createSignal(0),
	storyIndex: createSignal(0),
	storyProgress: createSignal(0),
	fistSpeed: createSignal(0),
	fistPower: createSignal(1),
	twoHands: createSignal(false),
	activeUpgradePower: createSignal(42),
	gameColor: createSignal("#444444"),
	gameStartTime: createSignal(Date.now()),
	gameEndTime: createSignal(0),
};

export let state: State;

let stateLoaded = false;
let autoSaveInterval: number;

export function initState() {
	loadState();

	autoSaveInterval = setInterval(saveState, 15000);
	globalThis.onbeforeunload = () => {
		saveState();
	};
}

export function resetState() {
	clearInterval(autoSaveInterval);
	globalThis.onbeforeunload = null;
	localStorage.removeItem(STATE_KEY);

	setTimeout(() => {
		globalThis.location.reload();
	}, 500);
}

function loadState() {
	const encodedState = localStorage.getItem(STATE_KEY);
	const decodedState = encodedState ? atob(encodedState) : "{}";
	const jsonState = JSON.parse(decodedState) as State | undefined;

	state = Object.entries(emptyState).reduce((acc, [key, signal]) => {
		acc[key] = jsonState?.[key] !== undefined ? createSignal(jsonState[key]) : signal;
		return acc;
	}, {} as State);

	rng.setSeed(state.seed.value);

	stateLoaded = true;
}

function saveState() {
	if (!stateLoaded) {
		return;
	}

	state.seed.value = rng.getSeed();

	const jsonState = Object.entries(state).reduce(
		(acc, [key, signal]) => {
			acc[key] = signal.value;
			return acc;
		},
		{} as Record<string, any>,
	);

	const encodedState = btoa(JSON.stringify(jsonState));
	localStorage.setItem(STATE_KEY, encodedState);
}
