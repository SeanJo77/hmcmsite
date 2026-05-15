/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { 
  Layers, 
  User, 
  RefreshCw, 
  LogOut, 
  Clock, 
  ChevronRight, 
  Upload, 
  Terminal, 
  ShieldCheck, 
  Search,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Asset {
  id: string;
  filename: string;
  author: string;
  timestamp: string;
  isActive?: boolean;
}

const MOCK_ASSETS: Asset[] = [
  {
    id: '1',
    filename: 'AI공사도우미 예시.html',
    author: 'admin',
    timestamp: '2026. 5. 14. PM 11:30:28'
  },
  {
    id: '2',
    filename: 'cfs_보배포트.html',
    author: 'admin',
    timestamp: '2026. 5. 14. PM 11:25:21',
    isActive: true
  },
  {
    id: '3',
    filename: '1778799798275-cfs_2026.05.14(1).html',
    author: 'user_v1',
    timestamp: '2026. 5. 14. PM 11:03:18'
  },
  {
    id: '4',
    filename: '1778799618279-CFS-dual-v0.1.5-standalone',
    author: 'root',
    timestamp: '2026. 5. 14. PM 11:00:18'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState<string>('2');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-[#0c1324] text-slate-200">
      {/* Top Navbar */}
      <nav className="h-16 px-8 flex items-center justify-between border-b border-white/10 bg-surface-dark/80 backdrop-blur-xl z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/20">
              <Layers className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-mono font-bold tracking-[0.2em] text-cyan-400 text-sm">SYNC_CORE v2.0</span>
          </div>
          
          <div className="h-6 w-px bg-white/10" />
          
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400/70" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400">Active: Admin</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-cyan-400">
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded font-mono text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all">
            <LogOut className="w-4 h-4" />
            Exit
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex flex-col border-r border-white/10 bg-[#070d1f]/40 transition-all shrink-0">
          <div className="p-6">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-4">HMCM TEAM PORTAL</p>
            <div className="flex gap-1">
              {['ALL', '김00', '강00', '황00', '조00'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-sm font-mono text-[11px] transition-all ${
                    activeTab === tab 
                    ? 'bg-slate-200 text-slate-900 font-bold' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-white/5">
            {MOCK_ASSETS.map((asset) => (
              <button
                key={asset.id}
                onClick={() => setSelectedAsset(asset.id)}
                className={`w-full text-left p-6 border-b border-white/5 transition-all group relative ${
                  selectedAsset === asset.id 
                  ? 'bg-cyan-400/5 border-l-2 border-l-cyan-400' 
                  : 'hover:bg-white/5'
                }`}
              >
                <div className="space-y-2">
                  <h4 className={`font-mono text-[13px] font-bold truncate ${
                    selectedAsset === asset.id ? 'text-cyan-400' : 'group-hover:text-cyan-400'
                  }`}>
                    {asset.filename}
                  </h4>
                  <div className="flex items-center gap-4 opacity-50 font-mono text-[10px]">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {asset.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {asset.timestamp}
                    </div>
                  </div>
                </div>
                <ChevronRight className={`absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform ${
                  selectedAsset === asset.id ? 'text-cyan-400' : 'text-white/20 group-hover:translate-x-1 group-hover:text-cyan-400'
                }`} />
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col p-12 overflow-y-auto items-center justify-center bg-gradient-to-b from-transparent to-black/20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl w-full text-center space-y-2"
          >
            <h1 className="text-6xl font-black italic tracking-tighter text-slate-100">Fast Sync</h1>
            <p className="text-slate-400 text-lg">
              Drag your HTML template here to broadcast to the administrative repository.
            </p>
          </motion.div>

          <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-16 w-full max-w-xl aspect-[4/3] rounded-[48px] flex flex-col items-center justify-center p-12 transition-all duration-500 border relative overflow-hidden glass-panel ${
              isDragOver ? 'border-cyan-400/50 bg-cyan-400/5 scale-[1.02]' : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <div className={`w-32 h-32 rounded-[32px] bg-slate-800/50 border border-white/10 flex items-center justify-center mb-8 transition-all duration-500 ${
              isDragOver ? 'scale-110 border-cyan-400 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : ''
            }`}>
              <Upload className={`w-12 h-12 transition-colors ${isDragOver ? 'text-cyan-400' : 'text-slate-300'}`} />
            </div>

            <h2 className="text-3xl font-bold text-slate-100 mb-8">Drop File or Click</h2>
            
            <button 
              disabled
              className="w-full py-5 rounded-xl border border-white/5 bg-white/5 text-sm font-mono font-bold uppercase tracking-[0.2em] text-slate-600 cursor-not-allowed transition-all"
            >
              Finalize Commit
            </button>

            <AnimatePresence>
              {isDragOver && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none border-2 border-cyan-400/30 rounded-[48px] border-dashed animate-pulse"
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Quick Stats Overlay */}
          <div className="absolute right-12 bottom-12 flex flex-col gap-4">
            <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <FileCode className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Selected Template</p>
                <p className="text-xs font-mono font-bold text-slate-200">cfs_보배포트.html</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-10 px-8 flex items-center justify-between border-t border-white/5 bg-surface-dark/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">HM CM PLANNING V1.0.0</span>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[9px] font-bold tracking-widest text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            VERIFIED ACCESS
          </span>
        </div>
      </footer>
    </div>
  );
}
