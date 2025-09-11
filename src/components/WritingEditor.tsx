'use client';

import { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface WritingEditorProps {
	content: string;
	isActive: boolean;
	onContentChange: (content: string) => void;
	className?: string;
	placeholder?: string;
}

export function WritingEditor({ content, isActive, onContentChange, className, placeholder = 'Start typing... Remember, stop for 5 seconds and your words start disappearing!' }: WritingEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			// Disable Ctrl+Z and Cmd+Z during active sessions
			if (isActive && (e.ctrlKey || e.metaKey) && e.key === 'z') {
				e.preventDefault();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isActive]);

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onContentChange(e.target.value);
	};

	return (
		<div className='relative w-full h-full'>
			<Textarea
				ref={textareaRef}
				id='writing-editor'
				value={content}
				onChange={handleChange}
				placeholder={placeholder}
				className={cn(
					'w-full h-full min-h-[70vh] sm:min-h-[80vh] resize-none border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:border-transparent text-lg sm:text-xl leading-relaxed p-4 sm:p-8 bg-white transition-all duration-300 placeholder:text-gray-400 rounded-lg',
					className
				)}
				autoFocus
				spellCheck={false}
			/>
		</div>
	);
}
