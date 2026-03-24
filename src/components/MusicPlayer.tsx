import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, TerminalSquare } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "DATA_STREAM_01", artist: "UNKNOWN_ENTITY", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CORRUPT_SECTOR", artist: "SYS_ADMIN", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "VOID_PROTOCOL", artist: "GHOST_IN_MACHINE", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  const toggleMute = () => setIsMuted(!isMuted);

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="w-full flex flex-col items-center gap-6 font-digital">
      <div className="w-full flex items-center gap-2 border-b-2 border-cyan-400 pb-2">
        <TerminalSquare className="text-cyan-400 w-6 h-6" />
        <h2 className="text-2xl text-cyan-400 uppercase tracking-widest">AUDIO_SUBSYSTEM</h2>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="text-center w-full bg-[#020202] border border-fuchsia-500 p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-fuchsia-500/10 animate-pulse pointer-events-none"></div>
        <h3 
          className="text-fuchsia-500 font-bold text-3xl tracking-widest uppercase glitch-text"
          data-text={currentTrack.title}
        >
          {currentTrack.title}
        </h3>
        <p className="text-cyan-400 text-xl tracking-widest uppercase mt-2">
          SRC: {currentTrack.artist}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-4">
        <button 
          onClick={prevTrack}
          className="p-3 bg-[#020202] border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#020202] transition-colors"
        >
          <SkipBack size={28} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="p-4 bg-[#020202] border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-[#020202] transition-colors"
        >
          {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={nextTrack}
          className="p-3 bg-[#020202] border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-[#020202] transition-colors"
        >
          <SkipForward size={28} />
        </button>
      </div>

      <div className="w-full flex justify-between items-center mt-4 px-2 border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 ${isPlaying ? 'bg-fuchsia-500 animate-ping' : 'bg-gray-700'}`}></div>
          <span className="text-xl text-cyan-400 uppercase tracking-widest">
            {isPlaying ? 'STREAMING...' : 'IDLE'}
          </span>
        </div>
        <button 
          onClick={toggleMute}
          className="text-fuchsia-500 hover:text-cyan-400 transition-colors"
        >
          {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
        </button>
      </div>
    </div>
  );
}
