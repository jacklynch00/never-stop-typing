'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface WelcomePopupProps {
	onSignInWithGoogle?: () => void;
	onContinueAsGuest: () => void;
	forceShow?: boolean;
	onClose?: () => void;
}

export function WelcomePopup({ onSignInWithGoogle, onContinueAsGuest, forceShow, onClose }: WelcomePopupProps) {
	const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage('hasSeenWelcome', false);

	if (hasSeenWelcome && !forceShow) return null;

	const handleContinueAsGuest = () => {
		setHasSeenWelcome(true);
		onContinueAsGuest();
	};

	const handleSignIn = () => {
		setHasSeenWelcome(true);
		onSignInWithGoogle?.();
	};

	const handleClose = () => {
		onClose?.();
	};

	return (
		<Dialog open={!hasSeenWelcome || forceShow} onOpenChange={handleClose}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-2xl font-bold text-center'>Welcome to Raw Writing</DialogTitle>
					<DialogDescription className='text-center space-y-4'>Practice continuous writing with our deletion-based timer.</DialogDescription>
					<DialogDescription className='text-center space-y-4'>
						Stop typing for <span className='text-red-600 font-medium'>5 seconds</span> and your words start disappearing!
					</DialogDescription>
					<DialogDescription className='text-center space-y-4'>
						This app encourages flow state by preventing overthinking and editing. Keep writing to keep your words!
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-3 pt-4'>
					{onSignInWithGoogle && (
						<Button onClick={handleSignIn} className='w-full' size='lg'>
							Sign up with Google
						</Button>
					)}
					<Button variant='outline' onClick={handleContinueAsGuest} className='w-full' size='lg'>
						Continue as Guest
					</Button>
				</div>

				<p className='text-xs text-center text-gray-500 pt-2'>{onSignInWithGoogle && 'You can always sign up later to save your writing to the cloud.'}</p>
			</DialogContent>
		</Dialog>
	);
}
