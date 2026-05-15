/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef } from 'react';
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
  FileCode,
  Lock,
  Mail,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Asset {
  id: string;
  filename: string;
  author: string;
  timestamp: string;
  isActive?: boolean;
}

const INITIAL_ASSETS: Asset[] = [
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
  }
];

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0c1324] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 glass-panel rounded-[32px] border-white/10 z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-cyan-400/10 rounded-2xl flex items-center justify-center border border-cyan-400/20 mb-6 group">
            <Layers className="w-8 h-8 text-cyan-400 group-hover:rotate-12 transition-transform duration-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">SYNC_CORE v2.0</h1>
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">Admin Terminal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono ml-1">Terminal ID</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sync.core"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-slate-500 font-mono ml-1">Secure Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5 transition-all outline-none"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-400 hover:bg-cyan-300 disabled:bg-cyan-900 disabled:text-cyan-400/30 text-cyan-950 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group overflow-hidden relative"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Initialize Session
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Network Stable</span>
          </div>
          <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">V2.0.4.R3</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<string>('2');
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setPendingFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPendingFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!pendingFile) return;

    const newAsset: Asset = {
      id: Date.now().toString(),
      filename: pendingFile.name,
      author: 'admin',
      timestamp: new Date().toLocaleString(),
    };

    setAssets(prev => [newAsset, ...prev]);
    setSelectedAsset(newAsset.id);
    setPendingFile(null);
  };

  const selectedAssetData = assets.find(a => a.id === selectedAsset);

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

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
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-cyan-400"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded font-mono text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all hover:text-red-400 hover:border-red-400/30"
          >
            <LogOut className="w-4 h-4" />
            Exit
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 flex flex-col border-r border-white/10 bg-[#070d1f]/40 transition-all shrink-0">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">HMCM TEAM PORTAL</p>
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
              {['ALL', '김00', '강00', '황00', '조00'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-sm font-mono text-[11px] transition-all whitespace-nowrap ${
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
            {assets.map((asset) => (
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
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`mt-16 w-full max-w-xl aspect-[4/3] rounded-[48px] flex flex-col items-center justify-center p-12 transition-all duration-500 border relative overflow-hidden glass-panel cursor-pointer group ${
              isDragOver ? 'border-cyan-400/50 bg-cyan-400/5 scale-[1.02]' : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect}
              accept=".html,.htm"
            />
            
            <div className={`w-32 h-32 rounded-[32px] bg-slate-800/50 border border-white/10 flex items-center justify-center mb-8 transition-all duration-500 ${
              isDragOver || pendingFile ? 'scale-110 border-cyan-400 bg-cyan-400/20 shadow-[0_0_30px_rgba(34,211,238,0.2)]' : 'group-hover:scale-105'
            }`}>
              <Upload className={`w-12 h-12 transition-colors ${isDragOver || pendingFile ? 'text-cyan-400' : 'text-slate-300'}`} />
            </div>

            <h2 className="text-3xl font-bold text-slate-100 mb-8">
              {pendingFile ? pendingFile.name : 'Drop File or Click'}
            </h2>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={!pendingFile}
              className={`w-full py-5 rounded-xl border border-white/5 font-mono font-bold uppercase tracking-[0.2em] transition-all ${
                pendingFile 
                ? 'bg-cyan-400 text-cyan-950 border-cyan-400 pulse shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                : 'bg-white/5 text-slate-600 cursor-not-allowed'
              }`}
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
          <AnimatePresence mode="wait">
            {selectedAssetData && (
              <motion.div 
                key={selectedAssetData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute right-12 bottom-12 flex flex-col gap-4"
              >
                <div className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                    <FileCode className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Selected Template</p>
                    <p className="text-xs font-mono font-bold text-slate-200 truncate max-w-[200px]">
                      {selectedAssetData.filename}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-10 px-8 flex items-center justify-between border-t border-white/5 bg-surface-dark/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">HM CM PLANNING V1.0.0</span>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[9px] font-bold tracking-widest uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3" />
            Verified Access
          </span>
        </div>
      </footer>
    </div>
  );
}

