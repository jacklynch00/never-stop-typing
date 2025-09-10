export type DifficultyMode = 'easy' | 'hard';

export interface DeletionConfig {
	mode: DifficultyMode;
	gracePeriod: number; // milliseconds
	warningPeriod: number; // milliseconds before deletion starts
	deletionInterval: number; // milliseconds between deletions
	deletionAmount: number; // number of words to delete per interval
}

export const DEFAULT_DELETION_CONFIG: DeletionConfig = {
	mode: 'easy',
	gracePeriod: 5000,
	warningPeriod: 3000,
	deletionInterval: 2000,
	deletionAmount: 1,
};

export function deleteWordsFromText(text: string, mode: DifficultyMode, amount: number = 1): string {
	if (!text.trim()) return '';

	// Split into words while preserving whitespace structure
	const parts = text.split(/(\s+)/); // Captures whitespace in groups
	const words: string[] = [];
	const wordIndices: number[] = [];

	// Identify which parts are words (not whitespace)
	parts.forEach((part, index) => {
		if (!/^\s*$/.test(part)) {
			// Not just whitespace
			words.push(part);
			wordIndices.push(index);
		}
	});

	if (words.length === 0) return '';

	const indicesToDelete: Set<number> = new Set();

	if (mode === 'easy') {
		// Delete from the end
		const wordsToDelete = Math.min(amount, words.length);
		for (let i = words.length - wordsToDelete; i < words.length; i++) {
			indicesToDelete.add(i);
		}
	} else {
		// Delete randomly
		const wordsToDelete = Math.min(amount, words.length);
		while (indicesToDelete.size < wordsToDelete) {
			const randomIndex = Math.floor(Math.random() * words.length);
			indicesToDelete.add(randomIndex);
		}
	}

	// Remove the words from the original parts array
	indicesToDelete.forEach((wordIndex) => {
		const partIndex = wordIndices[wordIndex];
		parts[partIndex] = '';
	});

	// Join back together and clean up extra spaces
	return parts
		.join('')
		.replace(/[ \t]+/g, ' ')
		.trim();
}

export function createDeleteSound(audioContext: AudioContext): void {
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	oscillator.frequency.value = 400; // 400Hz beep
	gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

	oscillator.start();
	oscillator.stop(audioContext.currentTime + 0.1);
}
