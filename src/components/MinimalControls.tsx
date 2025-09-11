'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DifficultyMode } from '@/utils/textDeletion';
import { formatDuration } from '@/utils/wordCount';
import { MoreVertical, Square, RotateCcw, History } from 'lucide-react';

interface MinimalControlsProps {
	// Session state
	isActive: boolean;
	difficulty: DifficultyMode;
	sessionDuration: number;
	topic?: string;
	wordCount: number;
	duration: number;
	isTyping: boolean;
	isDeletionPending: boolean;

	// Session actions
	onStart: (config: { difficulty: DifficultyMode; sessionDuration: number; topic?: string }) => void;
	onEnd: () => void;
	onReset: () => void;

	// Other actions
	onShowHistory: () => void;
}

const DURATION_OPTIONS = [
	{ value: 300, label: '5 minutes' },
	{ value: 600, label: '10 minutes' },
	{ value: 900, label: '15 minutes' },
	{ value: 1200, label: '20 minutes' },
	{ value: 1800, label: '30 minutes' },
];

const TOPIC_OPTIONS = [
	{ value: 'creative', label: 'Creative Writing' },
	{ value: 'personal', label: 'Personal Reflection' },
	{ value: 'academic', label: 'Academic' },
	{ value: 'business', label: 'Business' },
	{ value: 'fiction', label: 'Fiction' },
	{ value: 'journal', label: 'Journal Entry' },
	{ value: 'free', label: 'Free Writing' },
];

export function MinimalControls({
	isActive,
	difficulty,
	sessionDuration,
	topic,
	wordCount,
	duration,
	isTyping,
	isDeletionPending,
	onStart,
	onEnd,
	onReset,
	onShowHistory,
}: MinimalControlsProps) {
	const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>(difficulty);
	const [selectedDuration, setSelectedDuration] = useState(sessionDuration);
	const [selectedTopic, setSelectedTopic] = useState(topic || 'none');
	const [isConfigOpen, setIsConfigOpen] = useState(false);

	const handleStart = () => {
		onStart({
			difficulty: selectedDifficulty,
			sessionDuration: selectedDuration,
			topic: selectedTopic === 'none' ? undefined : selectedTopic,
		});
		setIsConfigOpen(false);
	};

	const remainingTime = Math.max(0, sessionDuration - duration);

	// Determine timer badge color based on state
	const getTimerBadgeVariant = () => {
		if (isDeletionPending) return 'destructive'; // Red when deletion is pending
		if (isTyping) return 'success'; // Green when actively typing
		return 'secondary'; // Default gray
	};

	return (
		<div className='flex items-center gap-2'>
			{isActive && (
				<>
					<Badge variant='default' className='text-sm'>
						{wordCount} words
					</Badge>
					<Badge variant={getTimerBadgeVariant()} className='text-sm'>
						{formatDuration(remainingTime)} left
					</Badge>
				</>
			)}


			{/* History Button */}
			<Button variant='outline' size='sm' onClick={onShowHistory} className='p-2'>
				<History className='w-4 h-4' />
			</Button>

			{/* Reset Button */}
			<Button onClick={onReset} variant='outline' size='sm' className='p-2'>
				<RotateCcw className='w-4 h-4' />
			</Button>

			{/* Session Controls */}
			{!isActive ? (
				<Popover open={isConfigOpen} onOpenChange={setIsConfigOpen}>
					<PopoverTrigger asChild>
						<Button variant='outline' size='sm' className='p-2'>
							<MoreVertical className='w-4 h-4' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-80' align='end'>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<h4 className='font-medium leading-none'>Start Writing Session</h4>
								<p className='text-sm text-muted-foreground'>Configure your session settings</p>
							</div>

							<div className='space-y-4'>
								<div className='space-y-2'>
									<label className='text-sm font-medium'>Difficulty Mode</label>
									<Select value={selectedDifficulty} onValueChange={(value: DifficultyMode) => setSelectedDifficulty(value)}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='easy'>Easy (Delete from end)</SelectItem>
											<SelectItem value='hard'>Hard (Delete randomly)</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Session Duration</label>
									<Select value={selectedDuration.toString()} onValueChange={(value) => setSelectedDuration(Number(value))}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{DURATION_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value.toString()}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='space-y-2'>
									<label className='text-sm font-medium'>Topic (Optional)</label>
									<Select value={selectedTopic} onValueChange={setSelectedTopic}>
										<SelectTrigger>
											<SelectValue placeholder='Choose a topic...' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='none'>No specific topic</SelectItem>
											{TOPIC_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className='text-xs text-red-600 bg-red-50 p-2 rounded'>⚠️ Stop typing for 5 seconds and words will be deleted!</div>

								<Button onClick={handleStart} className='w-full' size='sm'>
									Start Writing
								</Button>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			) : (
				<Button onClick={onEnd} variant='destructive' size='sm' className='p-2'>
					<Square className='w-4 h-4' />
				</Button>
			)}
		</div>
	);
}
