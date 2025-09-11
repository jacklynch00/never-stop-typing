'use client';

import { useState } from 'react';
import { WritingEditor } from '@/components/WritingEditor';
import { MinimalControls } from '@/components/MinimalControls';
import { WritingPrompt } from '@/components/WritingPrompt';
import { AuthButton } from '@/components/AuthButton';
import { WelcomePopup } from '@/components/WelcomePopup';
import { SaveDialog } from '@/components/SaveDialog';
import { SessionHistoryModal } from '@/components/SessionHistoryModal';
import { useWritingSession, WritingSessionConfig } from '@/hooks/useWritingSession';
import { WritingPrompt as PromptType } from '@/data/writingPrompts';
import { authClient } from '@/lib/auth-client';

export default function Home() {
	const [sessionState, sessionActions] = useWritingSession();
	const [showSaveDialog, setShowSaveDialog] = useState(false);
	const [showHistoryModal, setShowHistoryModal] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState('creative');
	const [currentPrompt, setCurrentPrompt] = useState<PromptType | null>(null);
	const [isPromptVisible, setIsPromptVisible] = useState(true);
	const { data: session } = authClient.useSession();
	const user = session?.user;
	const [showWelcomePopup, setShowWelcomePopup] = useState(false);

	const handleStart = (config: WritingSessionConfig) => {
		// Include current prompt information in session config
		const configWithPrompt = {
			...config,
			promptId: currentPrompt?.id,
			promptText: currentPrompt?.text,
		};
		sessionActions.startSession(configWithPrompt);
	};

	const handleEnd = () => {
		sessionActions.endSession();
		if (sessionState.content.trim() && sessionState.wordCount > 0) {
			setShowSaveDialog(true);
		}
	};

	const handleContinueAsGuest = () => {
		setShowWelcomePopup(false);
	};

	const handleSignInWithGoogle = async () => {
		try {
			await authClient.signIn.social({
				provider: 'google',
				callbackURL: window.location.origin,
			});
			setShowWelcomePopup(false);
		} catch (error) {
			console.error('Google sign-in error:', error);
		}
	};

	const handleLogin = () => {
		setShowWelcomePopup(true);
	};

	const handleLogout = async () => {
		try {
			await authClient.signOut();
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<div className='min-h-screen bg-white'>
			{showWelcomePopup && (
				<WelcomePopup onSignInWithGoogle={handleSignInWithGoogle} onContinueAsGuest={handleContinueAsGuest} forceShow={true} onClose={() => setShowWelcomePopup(false)} />
			)}

			{/* Header with Title and Controls */}
			<header className='pt-4 px-4 flex justify-between items-center'>
				<h1 className='text-xl font-light text-gray-900'>Never stop typing</h1>
				<div className='flex items-center gap-2 sm:gap-3 flex-wrap'>
					<MinimalControls
						isActive={sessionState.isActive}
						difficulty={sessionState.difficulty}
						sessionDuration={sessionState.sessionDuration}
						wordCount={sessionState.wordCount}
						duration={sessionState.duration}
						isTyping={sessionState.isTyping}
						isDeletionPending={sessionState.isDeletionPending}
						onStart={handleStart}
						onEnd={handleEnd}
						onShowHistory={() => setShowHistoryModal(true)}
						isPromptVisible={isPromptVisible}
						onShowPrompt={() => setIsPromptVisible(true)}
					/>
					<AuthButton user={user} onLogin={handleLogin} onLogout={handleLogout} />
				</div>
			</header>

			{/* Prompt Section */}
			{isPromptVisible && (
				<div className='px-4 pt-4 sm:pt-6'>
					<WritingPrompt
						selectedCategory={selectedCategory}
						onCategoryChange={setSelectedCategory}
						onPromptChange={setCurrentPrompt}
						onHide={() => setIsPromptVisible(false)}
					/>
				</div>
			)}

			{/* Minimal Layout */}
			<div className='flex flex-col'>
				{/* Writing Area - Centered with max width */}
				<div className='flex-1 flex justify-center items-start px-4 sm:px-6 lg:px-8'>
					<div className='w-full max-w-3xl'>
						<WritingEditor
							content={sessionState.content}
							isActive={sessionState.isActive}
							onContentChange={sessionActions.updateContent}
							placeholder={
								currentPrompt ? `Start writing about: "${currentPrompt.text}"` : 'Start typing... Remember, stop for 5 seconds and your words start disappearing!'
							}
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
				promptId={sessionState.promptId}
				promptText={sessionState.promptText}
				isOpen={showSaveDialog}
				onOpenChange={setShowSaveDialog}
				onSaveComplete={() => sessionActions.resetSession()}
				userId={user?.id}
			/>

			<SessionHistoryModal userId={user?.id} isOpen={showHistoryModal} onOpenChange={setShowHistoryModal} />
		</div>
	);
}
