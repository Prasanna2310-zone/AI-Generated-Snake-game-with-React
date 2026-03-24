/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020202] text-cyan-400 font-digital selection:bg-fuchsia-500/50 flex flex-col relative overflow-hidden">
      {/* Retro-Futurist Overlays */}
      <div className="bg-noise"></div>
      <div className="scanlines"></div>
      
      {/* Main Container with Screen Tear */}
      <div className="screen-tear flex-1 flex flex-col z-10 relative">
        
        {/* Header */}
        <header className="w-full p-4 flex justify-between items-center border-b-4 border-fuchsia-500 bg-[#020202]">
          <div className="flex items-center gap-4">
            <Terminal className="text-fuchsia-500 w-8 h-8" />
            <h1 
              className="text-4xl font-glitch tracking-widest uppercase text-cyan-400 glitch-text"
              data-text="SYS.INIT // SNAKE_PROTOCOL"
            >
              SYS.INIT // SNAKE_PROTOCOL
            </h1>
          </div>
          <div className="text-fuchsia-500 text-2xl animate-pulse hidden sm:block">
            [ STATUS: ONLINE ]
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-8 p-8 w-full max-w-7xl mx-auto">
          
          {/* Game Section */}
          <div className="flex-1 w-full flex justify-center border-2 border-cyan-400 p-4 bg-[#050505] shadow-[8px_8px_0px_#ff00ff]">
            <SnakeGame />
          </div>

          {/* Music Player Section */}
          <div className="w-full lg:w-96 flex flex-col justify-center border-2 border-fuchsia-500 p-4 bg-[#050505] shadow-[8px_8px_0px_#00ffff]">
            <MusicPlayer />
          </div>
          
        </main>
      </div>
    </div>
  );
}
