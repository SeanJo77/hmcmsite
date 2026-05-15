/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect } from 'react';
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
  Loader2,
  AlertCircle,
  Eye,
  Code,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const GITHUB_OWNER = 'seanjo77';
const GITHUB_REPO = 'hmcmsite';

interface Asset {
  id: string;
  filename: string;
  author: string;
  timestamp: string;
  path: string;
  sha?: string;
  downloadUrl?: string;
  size?: number;
  rawDate?: number;
}

function LoginPage({ onLogin, onGuestAccess }: { onLogin: (token: string) => void, onGuestAccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    // Simulation: In a real app with Firebase, we would call signInWithEmailAndPassword
    // For this mock-up, we use a predefined team access logic
    setTimeout(() => {
      setIsLoading(false);
      const isValidAdmin = userId === 'admin' && (password === 'hmcm2024' || password === 'sync');
      
      if (isValidAdmin) {
        onLogin(import.meta.env.VITE_GITHUB_TOKEN || ''); 
      } else {
        setError('Invalid credentials. Check with your HMCM administrator.');
      }
    }, 1200);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f0f4f3] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#244d47]/5 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-[#244d47]/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-10 bg-white rounded-[40px] shadow-2xl border border-black/5 z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-[#244d47]/5 rounded-[32px] flex items-center justify-center border border-[#244d47]/10 mb-6 group">
            <Layers className="w-9 h-9 text-[#244d47] group-hover:rotate-6 transition-transform duration-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-800 mb-2 font-display">HMCM Mock-up</h1>
          <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase text-center px-4 leading-relaxed">
            Professional Administrative Portal<br/>Template Sync System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Member ID</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#244d47] transition-colors" />
              <input 
                type="text" 
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your ID"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm focus:outline-none focus:border-[#244d47] focus:ring-4 focus:ring-[#244d47]/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">Secure Password</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#244d47] transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm focus:outline-none focus:border-[#244d47] focus:ring-4 focus:ring-[#244d47]/5 transition-all outline-none"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="space-y-4 pt-2">
            <button 
              type="submit"
              disabled={isLoading || !userId || !password}
              className="w-full bg-[#244d47] hover:bg-[#1a3834] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group overflow-hidden relative shadow-xl active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="tracking-widest uppercase text-xs">Access Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={onGuestAccess}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 border border-slate-200 text-xs tracking-widest uppercase"
            >
              Enter as Guest (Viewer)
            </button>
          </div>
        </form>

        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-8">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Active Security v2.1
          </div>
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">HMCM_AUTH_PRO</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'PREVIEW' | 'UPLOAD'>('UPLOAD');
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommiting, setIsCommiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      
      if (githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/upload`, {
        headers
      });
      
      if (response.status === 404) {
        setAssets([]);
        return;
      }
      
      if (!response.ok) {
        if (response.status === 403) throw new Error('API rate limit exceeded or access denied. Please use a token.');
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Map basic data
      const mappedAssets: Asset[] = data
        .filter((file: any) => file.type === 'file' && (file.name.endsWith('.html') || file.name.endsWith('.htm')))
        .map((file: any) => ({
          id: file.sha,
          filename: file.name,
          author: GITHUB_OWNER,
          timestamp: '...', // Will be updated
          path: file.path,
          sha: file.sha,
          downloadUrl: file.download_url,
          size: file.size
        }));

      setAssets(mappedAssets);

      // Fetch commits for timestamps (batches)
      const updatedAssets = await Promise.all(mappedAssets.map(async (asset) => {
        try {
          const commitResp = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${asset.path}&per_page=1`, { headers });
          if (commitResp.ok) {
            const commitData = await commitResp.json();
            if (commitData.length > 0) {
              const date = new Date(commitData[0].commit.committer.date);
              const committerName = commitData[0].commit.committer.name;
              
              return { 
                ...asset,
                rawDate: date.getTime(),
                timestamp: date.toLocaleString('ko-KR', { 
                  month: 'numeric', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) 
              };
            }
          }
        } catch (e) {
          console.error('Failed to fetch commit date', e);
        }
        return { ...asset, rawDate: Date.now(), timestamp: 'Recently' };
      }));
      
      updatedAssets.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
      setAssets(updatedAssets);
    } catch (err: any) {
      setError(`Failed to fetch files: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [githubToken]);

  const fetchPreview = useCallback(async (url: string) => {
    try {
      const resp = await fetch(url);
      const text = await resp.text();
      setPreviewContent(text);
      setViewMode('PREVIEW');
    } catch (err) {
      setError('Failed to load preview content');
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn, fetchFiles]);

  const onAssetSelect = (id: string) => {
    setSelectedAsset(id);
    const asset = assets.find(a => a.id === id);
    if (asset?.downloadUrl) {
      fetchPreview(asset.downloadUrl);
    }
  };

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

  const handleUpload = async () => {
    if (!pendingFile) return;

    if (!githubToken) {
      setError('GitHub Token is not configured. Please set VITE_GITHUB_TOKEN in environment settings.');
      return;
    }

    setIsCommiting(true);
    setError(null);
    
    try {
      // Refresh assets first to get latest SHA if any
      await fetchFiles();
      
      const existingFile = assets.find(a => a.filename === pendingFile.name);
      
      const reader = new FileReader();
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(pendingFile);
      });

      const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/upload/${pendingFile.name}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Broadcast template: ${pendingFile.name} (Updated at ${new Date().toLocaleString()})`,
          content: fileContent,
          sha: existingFile?.sha
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to commit file');
      }

      setPendingFile(null);
      // Wait a moment for GitHub to process before refresh
      setTimeout(async () => {
        await fetchFiles();
        setSelectedAsset(null);
        setPreviewContent(null);
      }, 500);
    } catch (err: any) {
      setError(`Commit failed: ${err.message}`);
    } finally {
      setIsCommiting(false);
    }
  };

  const handleDelete = async (asset: Asset) => {
    if (!githubToken) {
      alert('Delete permission is restricted to administrators.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${asset.filename}"? This action cannot be undone.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${asset.path}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete template: ${asset.filename}`,
          sha: asset.sha
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete file');
      }

      if (selectedAsset === asset.id) {
        setSelectedAsset(null);
        setPreviewContent(null);
      }
      
      await fetchFiles();
    } catch (err: any) {
      setError(`Delete failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openInNewWindow = () => {
    if (!previewContent) return;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(previewContent);
      newWindow.document.close();
    }
  };

  const selectedAssetData = assets.find(a => a.id === selectedAsset);

  const handleLogin = (token: string) => {
    setGithubToken(token || null);
    setIsAdmin(true);
    setIsLoggedIn(true);
  };

  const handleGuestAccess = () => {
    setGithubToken(null);
    setIsAdmin(false);
    setIsLoggedIn(true);
    setViewMode('PREVIEW');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} onGuestAccess={handleGuestAccess} />;
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-white text-slate-900 tracking-tight">
      {/* Top Navbar */}
      <nav className="h-12 px-6 flex items-center justify-between border-b border-black/5 bg-[#244d47] text-white z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/10 border border-white/20">
              <Layers className="w-4 h-4 text-emerald-300" />
            </div>
            <span className="font-bold tracking-tight text-white text-base">HMCM Mock-up</span>
          </div>
          
          <div className="h-4 w-px bg-white/20" />
          
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? (githubToken ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-slate-400'}`} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-emerald-100/70">
              {isAdmin ? (githubToken ? 'ADMIN ACCESS' : 'ADMIN (TOKEN MISSING)') : 'GUEST MODE'}
            </span>
          </div>
        </div>

        {/* Mode Tabs in Navbar */}
        <div className="flex items-center bg-white/10 rounded-full p-0.5">
          <button 
            onClick={() => setViewMode('UPLOAD')}
            className={`px-6 py-1.5 rounded-full text-[9px] font-bold tracking-widest transition-all ${
              viewMode === 'UPLOAD' ? 'bg-white text-[#244d47]' : 'text-white/60 hover:text-white'
            }`}
          >
            BROADCAST
          </button>
          <button 
            onClick={() => setViewMode('PREVIEW')}
            className={`px-6 py-1.5 rounded-full text-[9px] font-bold tracking-widest transition-all ${
              viewMode === 'PREVIEW' ? 'bg-white text-[#244d47]' : 'text-white/60 hover:text-white'
            }`}
          >
            PREVIEW
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchFiles}
            className={`p-1.5 hover:bg-white/10 rounded-full transition-colors ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={() => {
              setIsLoggedIn(false);
              setIsAdmin(false);
              setGithubToken(null);
            }}
            className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded font-bold text-[10px] uppercase tracking-widest transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </nav>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 flex flex-col border-r border-slate-200 bg-[#f8faf9] transition-all shrink-0">
          <div className="py-3 px-4 border-b-2 border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">Repository Contents</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading && assets.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="font-bold text-[10px] tracking-widest uppercase">Fetching files...</span>
              </div>
            ) : assets.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[11px] text-slate-400">No templates detected in target directory.</p>
              </div>
            ) : (
              assets.map((asset) => (
                <div key={asset.id} className="relative group">
                  <button
                    onClick={() => onAssetSelect(asset.id)}
                    className={`w-full text-left py-3 px-4 border-b border-slate-100 transition-all relative ${
                      selectedAsset === asset.id 
                      ? 'bg-[#244d47]/5 border-l-4 border-l-[#244d47]' 
                      : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <div className="space-y-1 pr-6">
                      <h4 className={`text-[12px] font-bold truncate transition-colors ${
                        selectedAsset === asset.id ? 'text-[#244d47]' : 'text-slate-700 group-hover:text-[#244d47]'
                      }`}>
                        {asset.filename}
                      </h4>
                      <div className="flex items-center gap-4 text-slate-400 font-bold text-[10px]">
                        <div className="flex items-center gap-1 uppercase tracking-tighter">
                          <Clock className="w-3 h-3 text-emerald-600/60" />
                          {asset.timestamp}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${
                      selectedAsset === asset.id ? 'text-[#244d47] translate-x-1' : 'text-slate-300 group-hover:translate-x-1 group-hover:text-[#244d47]'
                    }`} />
                  </button>
                  
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(asset);
                      }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col bg-[#f0f4f3] overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === 'UPLOAD' ? (
              <motion.div 
                key="upload-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto"
              >
                {!isAdmin ? (
                  <div className="max-w-md text-center space-y-6 bg-white p-10 rounded-[40px] shadow-2xl border border-black/5">
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                      <Lock className="w-10 h-10 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tighter mb-2 font-display">Authentication Required</h2>
                      <p className="text-slate-500 text-sm normal-case leading-relaxed font-medium">
                        Sync capabilities are locked for Guest sessions. Please authorize via Administrative credentials to execute synchronization.
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsAdmin(false);
                        setGithubToken(null);
                      }}
                      className="w-full py-4 bg-[#244d47] text-white rounded-2xl font-bold text-xs tracking-widest hover:bg-[#1a3834] transition-all uppercase shadow-lg"
                    >
                      Return to Secure Login
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="max-w-2xl w-full text-center mb-10">
                      <h1 className="text-6xl font-black tracking-tighter text-slate-800 mb-2 font-display">Fast Sync</h1>
                      <p className="text-slate-500 text-lg normal-case font-medium">
                        Seamlessly broadcast HTML templates to the production environment.
                      </p>
                    </div>

                    {!githubToken && (
                      <div className="w-full max-w-xl mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">Secret Configuration Required</p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Admin session active, but GitHub API Token is missing. Please add <code className="bg-amber-100 px-1 rounded">VITE_GITHUB_TOKEN</code> to AI Studio Secrets to enable deployments.
                          </p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="w-full max-w-xl mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-xs font-bold text-red-700">{error}</p>
                      </div>
                    )}

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full max-w-xl aspect-[4/3] rounded-[48px] flex flex-col items-center justify-center p-12 transition-all duration-500 border-2 relative overflow-hidden bg-white cursor-pointer group shadow-xl ${
                        isDragOver ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' : 'border-dashed border-slate-200 hover:border-emerald-400'
                      }`}
                    >
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} accept=".html,.htm" />
                      
                      <div className={`w-32 h-32 rounded-[40px] bg-slate-50 border border-slate-200 flex items-center justify-center mb-8 transition-all duration-500 ${
                        isDragOver || pendingFile ? 'scale-110 border-emerald-500 bg-emerald-50 shadow-[0_0_40px_rgba(16,185,129,0.1)]' : 'group-hover:scale-105 group-hover:border-emerald-200'
                      }`}>
                        <Upload className={`w-12 h-12 transition-colors ${isDragOver || pendingFile ? 'text-emerald-500' : 'text-slate-300'}`} />
                      </div>

                      <h2 className="text-2xl font-bold text-slate-800 mb-8 truncate max-w-full tracking-tight font-display">
                        {pendingFile ? pendingFile.name : 'Select or Drop Content'}
                      </h2>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                        disabled={!pendingFile || isCommiting}
                        className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all text-xs ${
                          pendingFile 
                          ? 'bg-[#244d47] text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {isCommiting ? <Loader2 className="animate-spin inline mr-2 h-4 w-4" /> : 'Execute Synchronization'}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="preview-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col p-6"
              >
                {previewContent ? (
                  <div className="flex-1 w-full bg-white rounded-[32px] overflow-hidden shadow-xl border border-black/5 flex flex-col">
                    <div className="h-12 px-6 flex items-center justify-between border-b border-black/5 bg-[#f8faf9]">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                        </div>
                        <div className="h-4 w-px bg-slate-200 ml-4" />
                        <span className="font-bold text-[11px] text-slate-500 truncate max-w-xs uppercase tracking-widest">{selectedAssetData?.filename}</span>
                      </div>
                      
                      <button 
                        onClick={openInNewWindow}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#244d47] text-white hover:bg-[#1a3834] transition-all font-bold text-[10px] tracking-widest uppercase shadow-md"
                      >
                        New Window
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <iframe 
                      title="live-preview"
                      srcDoc={previewContent} 
                      className="flex-1 w-full bg-white border-none"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                      <Eye className="w-10 h-10 opacity-40" />
                    </div>
                    <p className="font-bold text-[12px] tracking-widest uppercase text-slate-400">Select an asset to visualize</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isDragOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none border-2 border-emerald-400/20 rounded-[48px] border-dashed animate-pulse z-50 m-12"
              />
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 px-6 flex items-center justify-between border-t border-slate-200 bg-white text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-3 h-3 text-emerald-600/40" />
          <span className="font-bold text-[9px] uppercase tracking-[0.2em]">HM CM Planning Team</span>
        </div>

        <div className="flex items-center gap-2 text-emerald-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[9px] tracking-widest uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            System Secure
          </span>
        </div>
      </footer>
    </div>
  );
}

