import { createButton } from "./components/button/button";
import "./reset.css";
import "./defaults.css";
import { initMusic, playSound, sounds } from "./systems/music";
import { el, mount, setTextContent, svgEl } from "./helpers/dom";
import { initState, resetState, state } from "./systems/state";
import { SVGs } from "./systems/svgs";
import { mathRandomInteger } from "./helpers/numbers";
import { initFireflies } from "./components/fireflies/fireflies";
import { EdgeLinkButton, EdgeButton } from "./components/edge-button/edge-button";
import { initGame, startGameLoop } from "./game/game";
import { easings, tween } from "./systems/animation";
import { ProgressBar } from "./components/progress-bar/progress-bar";
import { setGameColor } from "./helpers/colors";
import { closeModal, openModal } from "./components/modal/modal";
import { createScaleableContainer } from "./components/scaleable-container/scaleable-container";
import { stories } from "./stories";
import { Upgrade, upgrades } from "./upgrades";

export let bodyElement: HTMLElement;
export let gameContainer: HTMLElement;

export let soundToggle: EdgeButton;

function getEndTime() {
	const duration = (state.gameEndTime.value || Date.now()) - state.gameStartTime.value;
	const seconds = Math.floor(duration / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);

	if (hours > 0) {
		return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
	} else if (minutes > 0) {
		return `${minutes}m ${seconds % 60}s`;
	} else {
		return `${seconds}s`;
	}
}

const upgradeContainer = el("div.upgrades");
let upgradeRendered = false;
function addUpgradeButton(upgrade: Upgrade) {
	const button = createButton(
		el("div.upgrade", [el("strong", upgrade.title), el("span", upgrade.description)]),
		() => {
			upgradeContainer.innerHTML = "";
			upgradeRendered = false;

			upgrade.onPurchase();

			const nextUpgrade = upgrades.find((u) => u.powerRequirement > state.activeUpgradePower.value);
			if (nextUpgrade) {
				state.activeUpgradePower.value = nextUpgrade.powerRequirement;
			} else {
				state.activeUpgradePower.value = -1;
			}
		},
		"primary",
	);

	mount(upgradeContainer, button);
}

window.addEventListener("DOMContentLoaded", () => {
	bodyElement = document.body;

	initState();
	setGameColor(state.gameColor.value);
	initFireflies();

	state.gameColor.subscribe((color) => {
		setGameColor(color);
	});

	gameContainer = createScaleableContainer(bodyElement, 360, 780, "bottom", "game");
	mount(bodyElement, gameContainer);

	initMusic();

	new EdgeLinkButton(bodyElement, SVGs.discord, "#5865F2", 8, -8, "https://discord.gg/kPf8XwNuZT");
	new EdgeLinkButton(bodyElement, SVGs.coffee, "#FBAA19", 64, -8, "https://ko-fi.com/martintale?ref=red-right-fist");

	soundToggle = new EdgeButton(bodyElement, SVGs.sound, "sound", 8, 8);

	new EdgeLinkButton(
		bodyElement,
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M255 34.8c-30.5-.2-59 22-79.6 62.1l-.2.4L43 326.8l-.3.3c-24.3 38.3-29.4 74.4-14.3 101 15 26.4 48.6 40 93.5 37.8h265c45 2.3 78.5-11.4 93.6-37.9 15-26.5 10-62.6-14.4-100.8l-.2-.4L335.3 98l-.2-.4c-21-40.2-49.6-62.8-80.1-63zm0 18.8c13.6.1 26.5 7 38.2 18.3a189.8 189.8 0 0 1 33.4 48.4l.1.3L442 322.2v.1l.2.3a183 183 0 0 1 25.3 54c3.9 16 3 30.6-3.9 42.3-6.9 11.8-19.2 19.6-34.8 24a182 182 0 0 1-57.4 4.4H137.6a179 179 0 0 1-60.4-5c-15.8-5-27.7-13.5-33.7-25.8-6-12.2-5.9-26.8-1.5-42.4a198.6 198.6 0 0 1 24.9-51.5l.2-.4L183.6 120l.2-.4a183 183 0 0 1 33-48.2c11.7-11.3 24.7-18 38.2-17.8zm47.7 62-28.5 224.1h-41.9l-27.9-219.2a293 293 0 0 0-4.2 8v.2l-.2.2L83 332v.2l-.2.1a184 184 0 0 0-22.8 47c-3.6 12.8-3.1 22.2.3 29 3.3 6.9 9.9 12.3 22.4 16.2a167 167 0 0 0 54.4 4.3H372c21.9 1.1 39.3-.3 52-3.8 12.5-3.6 19.7-8.9 23.6-15.4 3.9-6.6 5-15.6 1.8-28.5-3.2-13-10.7-29.4-23-48.8l-.2-.1-.1-.3-115.7-202.2v-.2l-.1-.2c-2.5-4.8-5-9.3-7.5-13.5zM231.3 362h43.9v43.9h-44v-44z"/></svg>`,
		"#f00",
		-8,
		-8,
		() => {
			openModal(
				gameContainer,
				"HARD RESET",
				"This will delete all progress!",
				[
					{
						content: "Cancel",
						type: "normal",
						onClickCallback: () => {
							closeModal();
						},
					},
					{
						content: "Reset",
						type: "danger",
						onClickCallback: () => {
							resetState();
							closeModal();
						},
					},
				],
				null,
			);
		},
	);

	if (state.activeUpgradePower.value <= state.power.value) {
		const availableUpgrades = upgrades.filter(
			(upgrade) => upgrade.powerRequirement === state.activeUpgradePower.value,
		);
		availableUpgrades.forEach((upgrade, index) => {
			if (index % 2 === 1) {
				mount(upgradeContainer, el("span.or-upgrade", "OR"));
			}
			addUpgradeButton(upgrade);
		});
		upgradeRendered = true;
	}

	mount(gameContainer, upgradeContainer);

	const bar = new ProgressBar(gameContainer, 0, 100, state.storyProgress.value * 100);
	bar.container.classList.toggle("story-progress", true);
	state.storyProgress.subscribe((progress) => {
		bar.setValue(progress * 100);
	});
	// bar.container.onclick = () => {
	// bar.setValue(bar.value + 10);
	// };

	// state.level.subscribe((level) => {
	// 	setTextContent(testButton, `Test ${abbreviateNumber(level)}`);
	// });

	// state.level.subscribe((level) => {
	// 	setTextContent(testButton2, `Test ${abbreviateNumber(level * 80)}`);
	// });

	const storyContainer = el("div.stories");
	stories
		.filter((_story, index) => index < state.storyIndex.value)
		.forEach((story) => {
			if (story.content === "THE END") {
				story.content = "THE END in " + getEndTime();
			}

			mount(
				storyContainer,
				el("p.story", [el("span.mono", story.powerRequirement.toLocaleString()), el("strong", story.content)]),
			);
		});
	mount(gameContainer, storyContainer);

	state.storyIndex.subscribe((index) => {
		const story = stories[index - 1] ?? { powerRequirement: 0, content: "" };

		if (story.content === "THE END") {
			story.content = "THE END in " + getEndTime();
		}

		mount(
			storyContainer,
			el("p.story", [el("span.mono", story.powerRequirement.toLocaleString()), el("strong", story.content)]),
		);
	});

	const leftFistIcon = svgEl(SVGs.fist, "var(--color)");
	const leftFistContainer = el("div.fist.left-hand", leftFistIcon);
	const rightFistIcon = svgEl(SVGs.fist, "var(--color)");
	const rightFistContainer = el("div.fist.right-hand", rightFistIcon);
	const powerElement = el("strong", state.power.value.toLocaleString());
	const tapToFistElement = el("span.mono", `"TAP"`);

	const powerTapArea = el("div.power-tap-area");

	const powerContainer = el("div.power", [
		powerElement,
		leftFistContainer,
		rightFistContainer,
		tapToFistElement,
		powerTapArea,
	]);

	if (state.twoHands.value) {
		powerContainer.classList.toggle("two-hands", true);
	}
	state.twoHands.subscribe((twoHands) => {
		powerContainer.classList.toggle("two-hands", twoHands);
	});

	mount(gameContainer, powerContainer);

	state.power.subscribe((power) => {
		setTextContent(powerElement, power.toLocaleString());
	});

	let tapToFistHintTimeout: number;
	let arm = 0;

	const castFist = () => {
		const powerGain = state.fistPower.value;

		state.power.value += powerGain;
		playSound(sounds.punch);

		let targetHand = arm % 2 === 0 ? leftFistIcon : rightFistIcon;

		if (state.twoHands.value) {
			arm += 1;
		}

		tween(targetHand, {
			from: {
				x: 0,
				y: 0,
			},
			to: {
				x: 0,
				y: -16,
			},
			duration: 100,
			easing: easings.easeOutQuad,
			onComplete: () => {
				const plusPowerElement = el("span.plus-power", "+" + powerGain);
				mount(gameContainer, plusPowerElement);

				const from = {
					x: mathRandomInteger(-10, 10),
					y: -10,
					opacity: 0,
				};

				const to = {
					x: mathRandomInteger(-30, 30),
					y: mathRandomInteger(-50, 10) - 50,
					opacity: 1,
				};

				tween(plusPowerElement, {
					from,
					to,
					duration: 500,
					easing: easings.swingTo,
					onComplete: () => {
						const end = { ...to };
						end.opacity = 0;

						tween(plusPowerElement, {
							from: to,
							to: end,
							duration: 300,
							easing: easings.easeInQuad,
							onComplete: () => {
								plusPowerElement.remove();
							},
						});
					},
				});

				tween(targetHand, {
					from: {
						x: 0,
						y: -16,
					},
					to: {
						x: 0,
						y: 0,
					},
					duration: 150,
					easing: easings.linear,
				});

				if (state.storyIndex.value === stories.length && state.gameEndTime.value === 0) {
					state.gameEndTime.value = Date.now();
				}

				if (state.storyIndex.value < stories.length) {
					const nextStory = stories[state.storyIndex.value];
					const currentStory = stories[state.storyIndex.value - 1] ?? { powerRequirement: 0, content: "" };

					if (state.power.value >= nextStory.powerRequirement) {
						state.storyIndex.value += 1;
						playSound(sounds.victory3);
					}

					const progress =
						(state.power.value - currentStory.powerRequirement) /
						(nextStory.powerRequirement - currentStory.powerRequirement);

					state.storyProgress.value = progress;
				}

				if (state.activeUpgradePower.value <= state.power.value && !upgradeRendered) {
					const availableUpgrades = upgrades.filter(
						(upgrade) => upgrade.powerRequirement === state.activeUpgradePower.value,
					);
					availableUpgrades.forEach((upgrade, index) => {
						if (index % 2 === 1) {
							mount(upgradeContainer, el("span.or-upgrade", "OR"));
						}
						addUpgradeButton(upgrade);
					});
					upgradeRendered = true;
				}
			},
		});

		if (tapToFistHintTimeout) {
			clearTimeout(tapToFistHintTimeout);
		}

		tapToFistElement.style.opacity = "0";
		tapToFistHintTimeout = setTimeout(() => {
			tween(tapToFistElement, {
				from: {
					opacity: 0,
				},
				to: {
					opacity: 1,
				},
				duration: 500,
				easing: easings.easeOutQuad,
			});
		}, 5000);
	};

	powerTapArea.onclick = castFist;

	function castIdleFist() {
		setTimeout(
			() => {
				if (state.fistSpeed.value > 0) {
					castFist();
				}

				castIdleFist();
			},
			1000 / state.fistSpeed.value || 1,
		);
	}

	castIdleFist();

	setRealViewportValues();

	initGame();
	startGameLoop();
});

function setRealViewportValues() {
	// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
	let vw = window.innerWidth * 0.01;
	let vh = window.innerHeight * 0.01;
	// Then we set the value in the --vh custom property to the root of the document
	document.documentElement.style.setProperty("--vw", `${vw}px`);
	document.documentElement.style.setProperty("--vh", `${vh}px`);
}

window.addEventListener("resize", setRealViewportValues);
