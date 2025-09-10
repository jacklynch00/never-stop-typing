'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DifficultyMode } from '@/utils/textDeletion';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface ConfigPanelProps {
  isActive: boolean;
  difficulty: DifficultyMode;
  sessionDuration: number;
  topic?: string;
  onStart: (config: { difficulty: DifficultyMode; sessionDuration: number; topic?: string }) => void;
  onPause: () => void;
  onEnd: () => void;
  onReset: () => void;
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

export function ConfigPanel({
  isActive,
  difficulty,
  sessionDuration,
  topic,
  onStart,
  onPause,
  onEnd,
  onReset,
}: ConfigPanelProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyMode>(difficulty);
  const [selectedDuration, setSelectedDuration] = useState(sessionDuration);
  const [selectedTopic, setSelectedTopic] = useState(topic || 'none');

  const handleStart = () => {
    onStart({
      difficulty: selectedDifficulty,
      sessionDuration: selectedDuration,
      topic: selectedTopic === 'none' ? undefined : selectedTopic,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg">Writing Session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isActive && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Mode</label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value: DifficultyMode) => setSelectedDifficulty(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy (Delete from end)</SelectItem>
                  <SelectItem value="hard">Hard (Delete randomly)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Duration</label>
              <Select
                value={selectedDuration.toString()}
                onValueChange={(value) => setSelectedDuration(Number(value))}
              >
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic (Optional)</label>
              <Select
                value={selectedTopic}
                onValueChange={setSelectedTopic}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a topic..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No specific topic</SelectItem>
                  {TOPIC_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={handleStart} className="flex-1" size="lg">
              <Play className="w-4 h-4 mr-2" />
              Start Writing
            </Button>
          ) : (
            <>
              <Button onClick={onPause} variant="outline" size="lg">
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
              <Button onClick={onEnd} variant="destructive" size="lg">
                <Square className="w-4 h-4 mr-2" />
                End
              </Button>
            </>
          )}
          
          <Button onClick={onReset} variant="outline" size="lg">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {isActive && (
          <div className="text-sm text-gray-600 space-y-1">
            <div>Mode: <span className="font-medium">{difficulty === 'easy' ? 'Easy' : 'Hard'}</span></div>
            {topic && <div>Topic: <span className="font-medium">{TOPIC_OPTIONS.find(t => t.value === topic)?.label}</span></div>}
            <div className="text-xs text-red-600 mt-2">
              ⚠️ Stop typing for 5 seconds and words will be deleted!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}