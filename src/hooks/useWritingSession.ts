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
	isTyping: boolean; // True when user is actively typing
	isDeletionPending: boolean; // True when deletion countdown is active
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
		isTyping: false,
		isDeletionPending: false,
	});

	const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);
	const deletionTimerRef = useRef<NodeJS.Timeout | null>(null);
	const deletionIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const deletionConfigRef = useRef<DeletionConfig>(DEFAULT_DELETION_CONFIG);
	const sessionStartTimeRef = useRef<number>(0);
	const pausedDurationRef = useRef<number>(0);
	const lastPauseTimeRef = useRef<number>(0);
	const timerWhenStoppedTypingRef = useRef<number>(0);
	const lastTypingTimeRef = useRef<number>(0);
	const timerWhenDeletionStartsRef = useRef<number>(0);

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

		// User is actively typing, clear deletion states and resume timer
		setState((prev) => {
			// If we were paused (only during actual deletion), adjust the session timing
			if (prev.isDeleting) {
				const pausedTime = Date.now() - lastPauseTimeRef.current;
				pausedDurationRef.current += pausedTime;
				
				// Adjust session start time so that timer continues from deletion start point
				const now = Date.now();
				const desiredElapsed = timerWhenDeletionStartsRef.current;
				sessionStartTimeRef.current = now - (desiredElapsed * 1000) - pausedDurationRef.current;
				
				return { ...prev, isDeleting: false, isDeletionPending: false, isTyping: true };
			}
			return { ...prev, isDeleting: false, isDeletionPending: false, isTyping: true };
		});

		// Record when user is typing (this gets called every keystroke)
		lastTypingTimeRef.current = Date.now();

		// Start 5 second countdown
		deletionTimerRef.current = setTimeout(() => {
			// Deletion countdown started - show warning
			setState((prev) => ({ ...prev, isDeletionPending: true, isTyping: false }));
			
			// Start deleting words and pause timer - capture timer at THIS moment
			setState((prev) => {
				// Capture the current timer value right when deletion starts
				const currentElapsed = Math.floor((Date.now() - sessionStartTimeRef.current - pausedDurationRef.current) / 1000);
				timerWhenDeletionStartsRef.current = currentElapsed;
				lastPauseTimeRef.current = Date.now();
				return { ...prev, isDeleting: true, duration: currentElapsed };
			});

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
		setState((prev) => ({ ...prev, isActive: false, isDeleting: false, isTyping: false, isDeletionPending: false }));
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
			sessionStartTimeRef.current = Date.now();
			pausedDurationRef.current = 0;
			sessionTimerRef.current = setInterval(() => {
				setState((prev) => {
					// If we're currently paused (only during actual deletion), don't update the timer
					if (prev.isDeleting) {
						return prev;
					}
					
					const elapsed = Math.floor((Date.now() - sessionStartTimeRef.current - pausedDurationRef.current) / 1000);
					
					// Auto-end session when time limit reached
					if (elapsed >= finalConfig.sessionDuration) {
						setTimeout(() => endSession(), 0);
					}
					
					return { ...prev, duration: elapsed };
				});
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
			} else if (state.isActive) {
				startDeletionCountdown();
			}
		},
		[state, startSession, startDeletionCountdown]
	);

	const pauseSession = useCallback(() => {
		setState((prev) => ({ ...prev, isActive: false, isDeleting: false, isTyping: false, isDeletionPending: false }));
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
			isTyping: false,
			isDeletionPending: false,
		});
		clearAllTimers();
		sessionStartTimeRef.current = 0;
		pausedDurationRef.current = 0;
		lastPauseTimeRef.current = 0;
		timerWhenStoppedTypingRef.current = 0;
		lastTypingTimeRef.current = 0;
		timerWhenDeletionStartsRef.current = 0;
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
