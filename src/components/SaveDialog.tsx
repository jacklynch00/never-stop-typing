'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Save, Download, Copy } from 'lucide-react';
import { useSaveSession } from '@/hooks/useWritingSessions';
import { useLocalStorage, LocalWritingSession } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface SaveDialogProps {
  content: string;
  wordCount: number;
  duration: number;
  difficulty: 'easy' | 'hard';
  topic?: string;
  promptId?: string;
  promptText?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveComplete?: () => void;
  userId?: string; // If user is signed in
}

export function SaveDialog({
  content,
  wordCount,
  duration,
  difficulty,
  topic,
  promptId,
  promptText,
  isOpen,
  onOpenChange,
  onSaveComplete,
  userId,
}: SaveDialogProps) {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [, setLocalData] = useLocalStorage('rawWritingData', {
    sessions: [] as LocalWritingSession[],
    preferences: { defaultDifficulty: 'easy' as const, defaultDuration: 600 },
    hasSeenWelcome: false,
  });

  const saveSessionMutation = useSaveSession();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (userId) {
        // Save to cloud database
        await saveSessionMutation.mutateAsync({
          userId,
          title: title || undefined,
          content,
          wordCount,
          durationSeconds: duration,
          topicCategory: topic,
          difficultyMode: difficulty,
        });
      } else {
        // Save to local storage
        const newSession: LocalWritingSession = {
          id: Date.now().toString(),
          title: title || undefined,
          content,
          wordCount,
          duration,
          topic,
          promptId,
          promptText,
          difficulty,
          timestamp: Date.now(),
          completed: true,
        };

        setLocalData(prev => ({
          ...prev,
          sessions: [newSession, ...prev.sessions].slice(0, 50), // Keep only last 50
        }));
      }

      onOpenChange(false);
      onSaveComplete?.();
    } catch (error) {
      console.error('Failed to save session:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = title ? `${title}-${timestamp}.txt` : `writing-session-${timestamp}.txt`;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Save Your Writing</DialogTitle>
          <DialogDescription>
            {wordCount} words • {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')} minutes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 min-h-0">
          <div>
            <label className="text-sm font-medium">Title (Optional)</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your writing a title..."
              className="mt-1"
            />
          </div>

          <div className="flex-1 min-h-0">
            <label className="text-sm font-medium">Preview</label>
            <Textarea
              value={content}
              readOnly
              className="mt-1 h-64 resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : userId ? 'Save to Cloud' : 'Save Locally'}
            </Button>
            
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            
            <Button onClick={handleCopy} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}