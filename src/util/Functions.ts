import jsLevenshtein from "js-levenshtein";

export const getClosest = (haystack: string[], needle: string) => {
	let minDistance = 3;
	return haystack.reduce((closest, cmd) => {
		const cmdDistance = jsLevenshtein(needle, cmd);
		if (cmdDistance < minDistance) {
			minDistance = cmdDistance;
			return cmd;
		}
		return closest;
	}, "");
};

export const sleep = (ms: number): Promise<void> => new Promise<void>(resolve => setTimeout(resolve, ms));
