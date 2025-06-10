import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioRecorderProps {
  value: File | null;
  onChange: (file: Blob) => void;
  maxDuration?: number; // in seconds
  className?: string;
  disabled?: boolean;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  value,
  onChange,
  maxDuration = 30,
  className,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Clean up any object URLs to prevent memory leaks
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionGranted(false);
      return null;
    }
  };

  const startRecording = async () => {
    if (disabled) return;
    
    const stream = streamRef.current || await requestMicrophonePermission();
    if (!stream) return;

    audioChunksRef.current = [];
    setDuration(0);
    setCurrentTime(0);
    
    // Clean up previous audio URL if it exists
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const newAudioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(newAudioUrl);
      onChange(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);

    // Start timer
    intervalRef.current = setInterval(() => {
      setDuration(prev => {
        const newDuration = prev + 1;
        if (newDuration >= maxDuration) {
          stopRecording();
        }
        return newDuration;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (!audioUrl) return;

    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    const audio = new Audio(audioUrl);
    audioElementRef.current = audio;

    audio.addEventListener('loadedmetadata', () => {
      setCurrentTime(0);
    });

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.play();
    setIsPlaying(true);
  };

  const pausePlayback = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Clean up the audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    
    onChange(new Blob());
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (permissionGranted === false) {
    return (
      <div className={cn("p-4 border-2 border-dashed border-red-300 rounded-lg text-center", className)}>
        <Mic className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="text-sm text-red-600 mb-2">Microphone access denied</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={requestMicrophonePermission}
          disabled={disabled}
        >
          Request Permission
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Recording Controls */}
      <div className="flex items-center justify-center space-x-4 p-4 border rounded-lg bg-gray-50">
        {!audioUrl && !isRecording && (
          <Button
            type="button"
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600 text-white"
            size="lg"
            disabled={disabled}
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
        )}

        {isRecording && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-600">Recording...</span>
            </div>
            <Button
              type="button"
              onClick={stopRecording}
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          </div>
        )}

        {audioUrl && !isRecording && (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              onClick={isPlaying ? pausePlayback : playRecording}
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              type="button"
              onClick={resetRecording}
              variant="outline"
              size="sm"
              disabled={disabled}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Duration Display */}
      <div className="text-center">
        <div className="text-lg font-mono">
          {isRecording ? formatTime(duration) : audioUrl ? formatTime(currentTime) : '0:00'}
          <span className="text-gray-500"> / {formatTime(maxDuration)}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              isRecording ? "bg-red-500" : "bg-blue-500"
            )}
            style={{
              width: `${Math.min(
                ((isRecording ? duration : currentTime) / maxDuration) * 100,
                100
              )}%`
            }}
          />
        </div>
      </div>

      {/* Recording Status */}
      {audioUrl && (
        <div className="text-center text-sm text-green-600">
          ✓ Recording saved ({formatTime(duration)} duration)
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
