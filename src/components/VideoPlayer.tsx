import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  isHost: boolean;
  onVideoControl: (action: string, currentTime?: number) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  isHost,
  onVideoControl,
  onTimeUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [onTimeUpdate]);

  const handlePlayPause = () => {
    if (!isHost) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      onVideoControl('play', video.currentTime);
    } else {
      onVideoControl('pause', video.currentTime);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isHost) return;

    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    onVideoControl('seek', newTime);
  };

  const handleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Externally triggered sync (from socket)
  const syncVideoControl = async (action: string, time?: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (typeof time === 'number') {
      video.currentTime = time;
    }

    try {
      if (action === 'play') await video.play();
      if (action === 'pause') video.pause();
    } catch (err) {
      console.warn('Auto-play prevented:', err);
    }
  };

  useEffect(() => {
    (window as any).syncVideoControl = syncVideoControl;
    return () => {
      delete (window as any).syncVideoControl;
    };
  }, []);

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video"
        onClick={handlePlayPause}
        controls={isHost}
        muted={isMuted}
      />

      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Play Overlay (if paused) */}
        {!isPlaying && isHost && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={handlePlayPause}
              className="w-20 h-20 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center"
            >
              <Play className="h-10 w-10 text-white ml-1" />
            </button>
          </div>
        )}

        {/* Host-only badge */}
        {!isHost && (
          <div className="absolute top-4 left-4">
            <div className="bg-orange-500/80 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              <RotateCcw className="inline h-3 w-3 mr-1" />
              Host controls playback
            </div>
          </div>
        )}

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              disabled={!isHost}
              className={`p-2 rounded-full transition-colors ${
                isHost ? 'hover:bg-white/20 text-white' : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <span className="text-white text-sm font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Progress bar */}
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                disabled={!isHost}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                  isHost ? 'bg-white/30 slider-thumb-purple' : 'bg-gray-600 cursor-not-allowed'
                }`}
                style={{
                  background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                }}
              />
            </div>

            <button onClick={handleMute} className="p-2 rounded-full hover:bg-white/20 text-white">
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            <button onClick={handleFullscreen} className="p-2 rounded-full hover:bg-white/20 text-white">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
