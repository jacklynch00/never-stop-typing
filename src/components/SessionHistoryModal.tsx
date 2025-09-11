'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Copy } from 'lucide-react';
import { useWritingSessions, useDeleteSession, WritingSessionData } from '@/hooks/useWritingSessions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDuration } from '@/utils/wordCount';
import { toast } from 'sonner';

interface LocalWritingSessionData {
	id: string;
	title?: string;
	content: string;
	wordCount: number;
	duration: number;
	topic?: string;
	promptId?: string;
	promptText?: string;
	difficulty: 'easy' | 'hard';
	timestamp: number;
	completed: boolean;
}

interface SessionHistoryModalProps {
	userId?: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}

export function SessionHistoryModal({ userId, isOpen, onOpenChange }: SessionHistoryModalProps) {
	const [localData, setLocalData] = useLocalStorage('rawWritingData', {
		sessions: [] as LocalWritingSessionData[],
		preferences: { defaultDifficulty: 'easy' as const, defaultDuration: 600 },
		hasSeenWelcome: false,
	});

	const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
	const [freshLocalData, setFreshLocalData] = useState(localData);

	// Refresh local data when modal opens
	useEffect(() => {
		if (isOpen && !userId) {
			try {
				const item = window.localStorage.getItem('rawWritingData');
				if (item) {
					const parsedData = JSON.parse(item);
					setFreshLocalData(parsedData);
				}
			} catch (error) {
				console.error('Error reading fresh localStorage:', error);
			}
		}
	}, [isOpen, userId]);

	// Cloud sessions
	const { data: cloudSessions = [], isLoading, error } = useWritingSessions(userId);
	const deleteSessionMutation = useDeleteSession();

	// Combine cloud and local sessions
	const allSessions = userId ? cloudSessions : freshLocalData.sessions;

	const handleDeleteClick = (sessionId: string) => {
		setSessionToDelete(sessionId);
	};

	const handleDeleteConfirm = async () => {
		if (!sessionToDelete) return;

		if (userId) {
			await deleteSessionMutation.mutateAsync(sessionToDelete);
		} else {
			// Delete from local storage
			const updatedData = {
				...freshLocalData,
				sessions: freshLocalData.sessions.filter((session) => session.id !== sessionToDelete),
			};
			setLocalData(updatedData);
			setFreshLocalData(updatedData);
		}

		setSessionToDelete(null);
	};

	const handleDeleteCancel = () => {
		setSessionToDelete(null);
	};

	const handleDownload = (session: WritingSessionData | LocalWritingSessionData) => {
		const timestamp = new Date('createdAt' in session ? session.createdAt : session.timestamp).toISOString().split('T')[0];
		const filename = `writing-session-${timestamp}.txt`;

		const element = document.createElement('a');
		const file = new Blob([session.content], { type: 'text/plain' });
		element.href = URL.createObjectURL(file);
		element.download = filename;
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	};

	const handleCopy = async (session: WritingSessionData | LocalWritingSessionData) => {
		try {
			await navigator.clipboard.writeText(session.content);
			toast.success('Content copied to clipboard!');
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
			toast.error('Failed to copy to clipboard');
		}
	};

	if (isLoading) {
		return (
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className='max-w-4xl max-h-[80vh]'>
					<DialogHeader>
						<DialogTitle>Session History</DialogTitle>
					</DialogHeader>
					<div className='text-center py-8 text-gray-500'>Loading...</div>
				</DialogContent>
			</Dialog>
		);
	}

	if (error) {
		return (
			<Dialog open={isOpen} onOpenChange={onOpenChange}>
				<DialogContent className='max-w-4xl max-h-[80vh]'>
					<DialogHeader>
						<DialogTitle>Session History</DialogTitle>
					</DialogHeader>
					<div className='text-center py-8 text-red-500'>Failed to load sessions</div>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-4xl max-h-[80vh] w-[95vw] sm:w-full flex flex-col'>
				<DialogHeader>
					<DialogTitle>Session History</DialogTitle>
				</DialogHeader>

				<div className='flex-1 min-h-0 overflow-hidden'>
					{allSessions.length === 0 ? (
						<div className='text-center py-8 text-gray-500'>No saved sessions yet. Complete a writing session to see it here!</div>
					) : (
						<div className='space-y-4 h-full overflow-y-auto pr-2'>
							{allSessions.map((session: WritingSessionData | LocalWritingSessionData) => (
								<div key={session.id} className='border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors'>
									<div className='flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2 sm:gap-0'>
										<div className='flex-1'>
											<h3 className='font-medium'>{session.title || 'Untitled Session'}</h3>
											<p className='text-sm text-gray-600 mt-1'>
												{new Date('createdAt' in session ? session.createdAt : session.timestamp).toLocaleDateString()}
											</p>
										</div>
										<div className='flex gap-1 sm:gap-2'>
											<Button size='sm' variant='outline' onClick={() => handleCopy(session)}>
												<Copy className='w-4 h-4' />
											</Button>
											<Button size='sm' variant='outline' onClick={() => handleDownload(session)}>
												<Download className='w-4 h-4' />
											</Button>
											<Button size='sm' variant='outline' onClick={() => handleDeleteClick(session.id)}>
												<Trash2 className='w-4 h-4' />
											</Button>
										</div>
									</div>

									<div className='flex gap-1 sm:gap-2 mb-2 flex-wrap'>
										<Badge variant='secondary'>{session.wordCount} words</Badge>
										<Badge variant='secondary'>{formatDuration('durationSeconds' in session ? session.durationSeconds : session.duration)}</Badge>
										<Badge variant='outline'>{'difficultyMode' in session ? session.difficultyMode : session.difficulty}</Badge>
										{('topicCategory' in session ? session.topicCategory : 'topic' in session ? session.topic : undefined) && (
											<Badge variant='outline'>{'topicCategory' in session ? session.topicCategory : 'topic' in session ? session.topic : ''}</Badge>
										)}
									</div>

									{'promptText' in session && session.promptText && (
										<div className='mb-2'>
											<p className='text-sm text-blue-600 bg-blue-50 p-2 rounded'>💡 Prompt: &quot;{session.promptText}&quot;</p>
										</div>
									)}

									<p className='text-sm text-gray-600 line-clamp-3'>
										{session.content.split('\n').slice(0, 3).join('\n')}
										{session.content.split('\n').length > 3 && '...'}
									</p>
								</div>
							))}
						</div>
					)}
				</div>
			</DialogContent>

			{/* Delete Confirmation Dialog */}
			<Dialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
				<DialogContent className='max-w-md'>
					<DialogHeader>
						<DialogTitle>Delete Session</DialogTitle>
					</DialogHeader>
					<div className='py-4'>
						<p className='text-sm text-gray-600'>Are you sure you want to delete this writing session? This action cannot be undone.</p>
					</div>
					<div className='flex gap-2 justify-end'>
						<Button variant='outline' onClick={handleDeleteCancel}>
							Cancel
						</Button>
						<Button variant='destructive' onClick={handleDeleteConfirm}>
							Delete
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</Dialog>
	);
}
