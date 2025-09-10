'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Eye } from 'lucide-react';
import { useWritingSessions, useDeleteSession, WritingSessionData } from '@/hooks/useWritingSessions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { formatDuration } from '@/utils/wordCount';

interface LocalWritingSessionData {
  id: string;
  content: string;
  wordCount: number;
  duration: number;
  topic?: string;
  difficulty: 'easy' | 'hard';
  timestamp: number;
  completed: boolean;
}

interface SessionHistoryModalProps {
  userId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onViewSession?: (session: WritingSessionData | LocalWritingSessionData) => void;
}

export function SessionHistoryModal({ userId, isOpen, onOpenChange, onViewSession }: SessionHistoryModalProps) {
  const [localData] = useLocalStorage('rawWritingData', {
    sessions: [] as LocalWritingSessionData[],
    preferences: { defaultDifficulty: 'easy' as const, defaultDuration: 600 },
    hasSeenWelcome: false,
  });

  // Cloud sessions
  const { data: cloudSessions = [], isLoading, error } = useWritingSessions(userId);
  const deleteSessionMutation = useDeleteSession();

  // Combine cloud and local sessions
  const allSessions = userId ? cloudSessions : localData.sessions;

  const handleDelete = async (sessionId: string) => {
    if (userId) {
      await deleteSessionMutation.mutateAsync(sessionId);
    } else {
      // Handle local deletion - would need to implement this
      console.log('Local delete not implemented yet');
    }
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

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Session History</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Session History</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8 text-red-500">Failed to load sessions</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Session History</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 overflow-hidden">
          {allSessions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No saved sessions yet. Complete a writing session to see it here!
            </div>
          ) : (
            <div className="space-y-4 h-full overflow-y-auto pr-2">
              {allSessions.map((session: WritingSessionData | LocalWritingSessionData) => (
                <div
                  key={session.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {'title' in session ? session.title || 'Untitled Session' : 'Untitled Session'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date('createdAt' in session ? session.createdAt : session.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewSession?.(session)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(session)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">
                      {session.wordCount} words
                    </Badge>
                    <Badge variant="secondary">
                      {formatDuration('durationSeconds' in session ? session.durationSeconds : session.duration)}
                    </Badge>
                    <Badge variant="outline">
                      {'difficultyMode' in session ? session.difficultyMode : session.difficulty}
                    </Badge>
                    {(('topicCategory' in session ? session.topicCategory : ('topic' in session ? session.topic : undefined))) && (
                      <Badge variant="outline">
                        {'topicCategory' in session ? session.topicCategory : ('topic' in session ? session.topic : '')}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {session.content.substring(0, 150)}
                    {session.content.length > 150 && '...'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}