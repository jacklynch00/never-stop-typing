'use client';

import { useState } from 'react';
import { WritingEditor } from '@/components/WritingEditor';
import { MinimalControls } from '@/components/MinimalControls';
import { WelcomePopup } from '@/components/WelcomePopup';
import { SaveDialog } from '@/components/SaveDialog';
import { SessionHistoryModal } from '@/components/SessionHistoryModal';
import { useWritingSession, WritingSessionConfig } from '@/hooks/useWritingSession';

export default function Home() {
	const [sessionState, sessionActions] = useWritingSession();
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const [showHistoryModal, setShowHistoryModal] = useState(false);
	const [userId] = useState<string | undefined>(undefined); // TODO: Get from auth
	
	const handleStart = (config: WritingSessionConfig) => {
		sessionActions.startSession(config);
	};

	const handleEnd = () => {
		sessionActions.endSession();
		if (sessionState.content.trim() && sessionState.wordCount > 0) {
			setShowSaveDialog(true);
		}
	};

	const handleSave = () => {
		if (sessionState.content.trim() && sessionState.wordCount > 0) {
			setShowSaveDialog(true);
		}
	};

	const handleContinueAsGuest = () => {
		// Just continue - the popup will close
	};

	const handleSignInWithGoogle = () => {
		// TODO: Implement Google sign-in
		console.log('Sign in with Google');
	};

	return (
		<div className='min-h-screen bg-white'>
			<WelcomePopup onSignInWithGoogle={handleSignInWithGoogle} onContinueAsGuest={handleContinueAsGuest} />

			{/* Header with Title and Controls */}
			<header className='pt-4 px-4 flex justify-between items-center'>
				<h1 className='text-xl font-light text-gray-900'>Never stop typing</h1>
				<MinimalControls
					isActive={sessionState.isActive}
					difficulty={sessionState.difficulty}
					sessionDuration={sessionState.sessionDuration}
					topic={sessionState.topic}
					wordCount={sessionState.wordCount}
					duration={sessionState.duration}
					onStart={handleStart}
					onPause={sessionActions.pauseSession}
					onEnd={handleEnd}
					onReset={sessionActions.resetSession}
					onSave={handleSave}
					onShowHistory={() => setShowHistoryModal(true)}
					canSave={sessionState.content.trim().length > 0 && sessionState.wordCount > 0}
				/>
			</header>

			{/* Minimal Layout */}
			<div className='h-screen flex flex-col pt-4'>
				{/* Writing Area - Centered with max width */}
				<div className='flex-1 flex justify-center items-start px-4 pt-8'>
					<div className='w-full max-w-3xl'>
						<WritingEditor 
							content={sessionState.content}
							isActive={sessionState.isActive}
							onContentChange={sessionActions.updateContent}
						/>
					</div>
				</div>
			</div>

			{/* Modals */}
			<SaveDialog
				content={sessionState.content}
				wordCount={sessionState.wordCount}
				duration={sessionState.duration}
				difficulty={sessionState.difficulty}
				topic={sessionState.topic}
				isOpen={showSaveDialog}
				onOpenChange={setShowSaveDialog}
				userId={userId}
			/>

			<SessionHistoryModal
				userId={userId}
				isOpen={showHistoryModal}
				onOpenChange={setShowHistoryModal}
				onViewSession={(session) => {
					// TODO: Implement view session
					console.log('View session:', session);
				}}
			/>
		</div>
	);
}
