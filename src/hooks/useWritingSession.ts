import { useState, useEffect, useCallback, useRef } from 'react';
import { DifficultyMode, DeletionConfig, DEFAULT_DELETION_CONFIG, deleteWordsFromText } from '@/utils/textDeletion';
import { countWords } from '@/utils/wordCount';

export interface WritingSessionState {
	content: string;
	wordCount: number;
	duration: number;
	isActive: boolean;
	isDeleting: boolean;
	showWarning: boolean;
	difficulty: DifficultyMode;
	topic?: string;
	sessionDuration: number; // Target duration in seconds
}

export interface WritingSessionActions {
	updateContent: (content: string) => void;
	startSession: (config?: Partial<WritingSessionConfig>) => void;
	pauseSession: () => void;
	endSession: () => void;
	resetSession: () => void;
}

export interface WritingSessionConfig {
	difficulty: DifficultyMode;
	topic?: string;
	sessionDuration: number;
	deletionConfig?: Partial<DeletionConfig>;
}

const DEFAULT_CONFIG: WritingSessionConfig = {
	difficulty: 'easy',
	sessionDuration: 600, // 10 minutes
};

export function useWritingSession() {
	const [state, setState] = useState<WritingSessionState>({
		content: '',
		wordCount: 0,
		duration: 0,
		isActive: false,
		isDeleting: false,
		showWarning: false,
		difficulty: 'easy',
		sessionDuration: 600,
	});

	const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
	const deletionTimerRef = useRef<NodeJS.Timeout | null>(null);
	const deletionIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const deletionConfigRef = useRef<DeletionConfig>(DEFAULT_DELETION_CONFIG);

	const clearAllTimers = useCallback(() => {
		[deletionTimerRef, deletionIntervalRef, sessionTimerRef].forEach((ref) => {
			if (ref.current) {
				clearTimeout(ref.current);
				clearInterval(ref.current);
				ref.current = null;
			}
		});
	}, []);

	const startDeletionCountdown = useCallback(() => {
		// Clear any existing deletion timer
		if (deletionTimerRef.current) {
			clearTimeout(deletionTimerRef.current);
			deletionTimerRef.current = null;
		}

		// Clear any existing deletion interval
		if (deletionIntervalRef.current) {
			clearInterval(deletionIntervalRef.current);
			deletionIntervalRef.current = null;
		}

		// Stop any active deletion
		setState((prev) => ({ ...prev, isDeleting: false }));

		// Start 5 second countdown
		deletionTimerRef.current = setTimeout(() => {
			// Start deleting words
			setState((prev) => ({ ...prev, isDeleting: true }));

			deletionIntervalRef.current = setInterval(() => {
				setState((prev) => {
					if (!prev.isActive) {
						return prev;
					}

					const newContent = deleteWordsFromText(prev.content, prev.difficulty, deletionConfigRef.current.deletionAmount);

					return {
						...prev,
						content: newContent,
						wordCount: countWords(newContent),
					};
				});
			}, deletionConfigRef.current.deletionInterval);
		}, 5000);
	}, []);

	const endSession = useCallback(() => {
		setState((prev) => ({ ...prev, isActive: false, isDeleting: false }));
		clearAllTimers();
	}, [clearAllTimers]);

	const startSession = useCallback(
		(config: Partial<WritingSessionConfig> = {}) => {
			const finalConfig = { ...DEFAULT_CONFIG, ...config };
			deletionConfigRef.current = {
				...DEFAULT_DELETION_CONFIG,
				mode: finalConfig.difficulty,
				...finalConfig.deletionConfig,
			};

			setState((prev) => ({
				...prev,
				isActive: true,
				difficulty: finalConfig.difficulty,
				topic: finalConfig.topic,
				sessionDuration: finalConfig.sessionDuration,
				duration: 0,
			}));

			// Start session timer
			const startTime = Date.now();
			sessionTimerRef.current = setInterval(() => {
				const elapsed = Math.floor((Date.now() - startTime) / 1000);
				setState((prev) => ({ ...prev, duration: elapsed }));

				// Auto-end session when time limit reached
				if (elapsed >= finalConfig.sessionDuration) {
					endSession();
				}
			}, 1000);

			// Start deletion countdown
			startDeletionCountdown();
		},
		[startDeletionCountdown, endSession]
	);

	const updateContent = useCallback(
		(content: string) => {
			// First, update the content
			setState((prev) => ({
				...prev,
				content,
				wordCount: countWords(content),
			}));

			// Auto-start if user begins typing and no session is active
			if (!state.isActive && content.trim().length > 0 && state.content.trim().length === 0) {
				setTimeout(() => startSession(), 0);
			} else {
				startDeletionCountdown();
			}
		},
		[state, startSession, startDeletionCountdown]
	);

	const pauseSession = useCallback(() => {
		setState((prev) => ({ ...prev, isActive: false, isDeleting: false }));
		clearAllTimers();
	}, [clearAllTimers]);

	const resetSession = useCallback(() => {
		setState({
			content: '',
			wordCount: 0,
			duration: 0,
			isActive: false,
			isDeleting: false,
			showWarning: false,
			difficulty: 'easy',
			sessionDuration: 600,
		});
		clearAllTimers();
	}, [clearAllTimers]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			clearAllTimers();
		};
	}, [clearAllTimers]);

	const actions: WritingSessionActions = {
		updateContent,
		startSession,
		pauseSession,
		endSession,
		resetSession,
	};

	return [state, actions] as const;
}
