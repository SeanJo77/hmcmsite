/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Layers,
  User,
  RefreshCw,
  LogOut,
  Clock,
  ChevronRight,
  ChevronDown,
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
  Trash2,
  FolderArchive,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import JSZip from "jszip";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import mermaid from "mermaid";
import { toHtml } from "hast-util-to-html";

const GITHUB_OWNER = "seanjo77";
const GITHUB_REPO = "hmcmsite";

function MermaidChart({ chart, isDark }: { chart: string; isDark: boolean }) {
  const [svgStr, setSvgStr] = useState("");
  const idRef = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "loose",
    });
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(idRef.current, chart);
        setSvgStr(svg);
      } catch (e) {
        console.error("Mermaid parsing error:", e);
      }
    };
    renderChart();
  }, [chart, isDark]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgStr }}
      className="my-4 flex justify-center w-full overflow-x-auto"
    />
  );
}

function MarkdownToc({
  content,
  isDark,
  filename,
}: {
  content: string;
  isDark: boolean;
  filename: string;
}) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo(() => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    const items: Array<{ level: number; text: string; id: string }> = [];

    // Custom slugify to match rehype-slug output
    const slugify = (text: string) => {
      return text
        .toLowerCase()
        .replace(/<[^>]*>/g, "") // Remove HTML tags
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-가-힣]/g, "");
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
      }
      if (!inCodeBlock) {
        const match = /^(#{1,6})\s+(.+)$/.exec(line);
        if (match) {
          const rawText = match[2];
          const text = rawText.replace(/<[^>]*>/g, "").trim(); // Remove basic HTML tags from text
          items.push({
            level: match[1].length,
            text: text,
            id: slugify(text),
          });
        }
      }
    }

    // Provide unique IDs for duplicates
    const idCount: Record<string, number> = {};
    return items.map((item) => {
      let id = item.id;
      if (idCount[id]) {
        const newId = `${id}-${idCount[id]}`;
        idCount[id]++;
        id = newId;
      } else {
        idCount[id] = 1;
      }
      return { ...item, id };
    });
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("markdown-scroll-container");
      if (!container) return;

      const elements = headings
        .map((h) => document.getElementById(h.id))
        .filter(Boolean);
      let currentActiveId = "";

      // Find the last element that is past the threshold
      for (const el of elements) {
        if (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          // If the element's top is less than the container's top + some offset
          if (rect.top - containerRect.top <= 100) {
            currentActiveId = el.id;
          }
        }
      }

      if (currentActiveId) {
        setActiveId(currentActiveId);
      }
    };

    const container = document.getElementById("markdown-scroll-container");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div
      className={`w-64 flex-shrink-0 border-l ${isDark ? "border-slate-800" : "border-slate-200"} overflow-y-auto hidden md:block py-6 px-4 sticky top-0 h-full ${
        isDark ? "custom-scrollbar-dark" : "custom-scrollbar"
      }`}
    >
      <h3
        className={`text-xs font-bold mb-4 uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}
      >
        Contents
      </h3>
      <div className="flex flex-col space-y-2">
        {headings.map((h, i) => (
          <button
            key={i}
            onClick={() => {
              const el = document.getElementById(h.id);
              const container = document.getElementById(
                "markdown-scroll-container",
              );
              if (el && container) {
                const elRect = el.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                container.scrollBy({
                  top: elRect.top - containerRect.top - 40,
                  behavior: "smooth",
                });
              }
            }}
            className={`text-left text-xs ${h.level === 1 ? "font-bold mt-2" : ""} ${h.level > 1 ? "ml-" + (h.level - 1) * 3 : ""} ${
              activeId === h.id
                ? "text-[#244d47] font-bold"
                : isDark
                  ? "text-slate-400 hover:text-slate-200"
                  : "text-slate-500 hover:text-slate-800"
            } transition-colors line-clamp-2`}
          >
            {h.text}
          </button>
        ))}
      </div>
    </div>
  );
}

const TEAMS = [
  "DfMA팀",
  "일반구조물팀",
  "CM기획팀",
];

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
  isFolder?: boolean;
}

function LoginPage({
  onLogin,
  onGuestAccess,
}: {
  onLogin: (
    token: string,
    userName: string,
    userTeam: string,
    userRole: string,
  ) => void;
  onGuestAccess: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = import.meta.env.VITE_GITHUB_TOKEN;
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
      };
      if (token) {
        headers["Authorization"] = `token ${token}`;
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/users.json`,
        { headers },
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch authentication data from GitHub. Please ensure users.json exists in the repository.",
        );
      }

      const data = await response.json();

      // Decode base64 utf-8
      const contentStr = decodeURIComponent(escape(atob(data.content)));
      const usersConfig = JSON.parse(contentStr);

      const user = usersConfig.find((u: any) => u.id === userId);

      if (user) {
        onLogin(
          token || "",
          user.name,
          user.team || "CM기획팀",
          user.role || "normal",
        );
      } else {
        setError("Invalid credentials. Check with your HMCM administrator.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-3xl font-black tracking-tighter text-slate-800 mb-2 font-display">
            HMCM Mock-up
          </h1>
          <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase text-center px-4 leading-relaxed">
            Professional Administrative Portal
            <br />
            Template Sync System
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ml-1">
              Member ID
            </label>
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

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isLoading || !userId}
              className="w-full bg-[#244d47] hover:bg-[#1a3834] disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 group overflow-hidden relative shadow-xl active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="tracking-widest uppercase text-xs">
                    Access Dashboard
                  </span>
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
          <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            HMCM_AUTH_PRO
          </span>
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userTeam, setUserTeam] = useState<string>("CM기획팀");
  const [userRole, setUserRole] = useState<string>("normal");
  const [selectedTeam, setSelectedTeam] = useState<string>("CM기획팀");
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [usersList, setUsersList] = useState<any[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"PREVIEW" | "UPLOAD">("UPLOAD");
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCommiting, setIsCommiting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMarkdownDark, setIsMarkdownDark] = useState(false);
  const [isWebExpanded, setIsWebExpanded] = useState(true);
  const [isMdExpanded, setIsMdExpanded] = useState(true);
  const [isOthersExpanded, setIsOthersExpanded] = useState(true);
  const [isWebOldExpanded, setIsWebOldExpanded] = useState(false);
  const [isMdOldExpanded, setIsMdOldExpanded] = useState(false);
  const [isOthersOldExpanded, setIsOthersOldExpanded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
      };

      if (githubToken) {
        headers["Authorization"] = `token ${githubToken}`;
      }

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/upload/${selectedTeam}`,
        {
          headers,
        },
      );

      if (response.status === 404) {
        setAssets([]);
        return;
      }

      if (!response.ok) {
        if (response.status === 403)
          throw new Error(
            "API rate limit exceeded or access denied. Please use a token.",
          );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Map basic data
      const mappedAssets: Asset[] = [];
      for (const item of data) {
        if (
          item.type === "file" &&
          (item.name.toLowerCase().endsWith(".html") ||
            item.name.toLowerCase().endsWith(".htm") ||
            item.name.toLowerCase().endsWith(".md") ||
            item.name.toLowerCase().endsWith(".txt"))
        ) {
          mappedAssets.push({
            id: item.sha,
            filename: item.name,
            author: GITHUB_OWNER,
            timestamp: "...", // Will be updated
            path: item.path,
            sha: item.sha,
            downloadUrl: item.download_url,
            size: item.size,
            isFolder: false,
          });
        } else if (item.type === "dir") {
          // It's a folder, presumably uploaded via ZIP
          mappedAssets.push({
            id: item.sha,
            filename: item.name,
            author: GITHUB_OWNER,
            timestamp: "...",
            path: item.path,
            sha: item.sha,
            downloadUrl: `https://raw.githack.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${item.path}/index.html`,
            size: 0,
            isFolder: true,
          });
        }
      }

      setAssets(mappedAssets);

      // Fetch commits for timestamps (batches)
      const updatedAssets = await Promise.all(
        mappedAssets.map(async (asset) => {
          try {
            const commitResp = await fetch(
              `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/commits?path=${asset.path}&per_page=1`,
              { headers },
            );
            if (commitResp.ok) {
              const commitData = await commitResp.json();
              if (commitData.length > 0) {
                const date = new Date(commitData[0].commit.committer.date);
                const committerName = commitData[0].commit.committer.name;

                return {
                  ...asset,
                  author: committerName,
                  rawDate: date.getTime(),
                  timestamp: date.toLocaleString("ko-KR", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                };
              }
            }
          } catch (e) {
            console.error("Failed to fetch commit date", e);
          }
          return { ...asset, rawDate: Date.now(), timestamp: "Recently" };
        }),
      );

      updatedAssets.sort((a, b) => (b.rawDate || 0) - (a.rawDate || 0));
      setAssets(updatedAssets);
    } catch (err: any) {
      setError(`Failed to fetch files: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [githubToken, selectedTeam]);

  const fetchPreview = useCallback(async (asset: Asset) => {
    if (!asset.downloadUrl) return;
    try {
      if (asset.isFolder) {
        // For folders (unzipped), we point iframe src directly to githack
        setPreviewContent(asset.downloadUrl);
        setViewMode("PREVIEW");
      } else {
        // For single files, we load the raw text
        const resp = await fetch(asset.downloadUrl);
        const text = await resp.text();
        setPreviewContent(text);
        setViewMode("PREVIEW");
      }
    } catch (err) {
      setError("Failed to load preview content");
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const loadUsersList = async () => {
        try {
          const headers: Record<string, string> = {
            Accept: "application/vnd.github.v3+json",
          };
          if (githubToken) headers["Authorization"] = `token ${githubToken}`;

          const response = await fetch(
            `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/users.json`,
            { headers },
          );
          if (response.ok) {
            const data = await response.json();
            const contentStr = decodeURIComponent(escape(atob(data.content)));
            setUsersList(JSON.parse(contentStr));
          }
        } catch (e) {
          console.error("Failed to fetch users list", e);
        }
      };
      loadUsersList();
    }
  }, [isLoggedIn, githubToken]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
      setActiveTab("All");
    }
  }, [isLoggedIn, fetchFiles, selectedTeam]);

  const onAssetSelect = (id: string) => {
    setSelectedAsset(id);
    const asset = assets.find((a) => a.id === id);
    if (asset) {
      fetchPreview(asset);
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
      setPendingFiles(Array.from(files));
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPendingFiles(Array.from(files));
    }
  };

  const handleUpload = async () => {
    if (pendingFiles.length === 0) return;

    if (!githubToken) {
      setError(
        "GitHub Token is not configured. Please set VITE_GITHUB_TOKEN in environment settings.",
      );
      return;
    }

    setIsCommiting(true);
    setError(null);

    try {
      // Refresh assets first to get latest SHA if any
      await fetchFiles();

      if (
        pendingFiles.length === 1 &&
        pendingFiles[0].name.toLowerCase().endsWith(".zip")
      ) {
        const file = pendingFiles[0];
        // Process ZIP file
        let zipNameWithoutExt = file.name.replace(/\.zip$/i, "");
        const isZipFolderExists = assets.some(
          (a) => a.isFolder && a.filename === zipNameWithoutExt,
        );
        if (isZipFolderExists) {
          zipNameWithoutExt = `${zipNameWithoutExt}_${Date.now()}`;
        }
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(file);

        // Find all actual files
        const filesToUpload: { path: string; content: string }[] = [];
        for (const relativePath in loadedZip.files) {
          const zipEntry = loadedZip.files[relativePath];
          if (
            !zipEntry.dir &&
            !relativePath.includes("__MACOSX") &&
            !relativePath.startsWith(".")
          ) {
            const content = await zipEntry.async("base64");
            filesToUpload.push({ path: relativePath, content });
          }
        }

        // Upload each file using PUT (Sequential to avoid overload)
        for (const f of filesToUpload) {
          const filePath = `${zipNameWithoutExt}/${f.path}`;
          const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/upload/${selectedTeam}/${filePath}`;

          await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Upload ZIP template file: ${f.path}`,
              content: f.content,
              committer: {
                name: `[${userTeam}] ${userName || "Unknown"}`,
                email: "system@hmcm.com",
              },
            }),
          });
        }
      } else if (pendingFiles.length > 1) {
        // Find the HTML file to use as folder name
        const htmlFile = pendingFiles.find(
          (f) =>
            f.name.toLowerCase().endsWith(".html") ||
            f.name.toLowerCase().endsWith(".htm"),
        );
        let folderName = htmlFile
          ? htmlFile.name.replace(/\.html?$/i, "")
          : `Project_${Date.now()}`;

        const isFolderExists = assets.some(
          (a) => a.isFolder && a.filename === folderName,
        );
        if (isFolderExists) {
          folderName = `${folderName}_${Date.now()}`;
        }

        for (const file of pendingFiles) {
          const content = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve((reader.result as string).split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const finalFileName = file === htmlFile ? "index.html" : file.name;
          const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/upload/${selectedTeam}/${folderName}/${finalFileName}`;

          await fetch(url, {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Upload multi-file template: ${file.name}`,
              content: content,
              committer: {
                name: `[${userTeam}] ${userName || "Unknown"}`,
                email: "system@hmcm.com",
              },
            }),
          });
        }
      } else {
        const pendingFile = pendingFiles[0];
        const existingFile = assets.find(
          (a) => a.filename === pendingFile.name && !a.isFolder,
        );

        const reader = new FileReader();
        const fileContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(pendingFile);
        });

        const response = await fetch(
          `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/upload/${selectedTeam}/${pendingFile.name}`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              Accept: "application/vnd.github.v3+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Broadcast template: ${pendingFile.name} (Updated at ${new Date().toLocaleString()})`,
              content: fileContent,
              sha: existingFile?.sha,
              committer: {
                name: `[${userTeam}] ${userName || "Unknown"}`,
                email: "system@hmcm.com",
              },
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to commit file");
        }
      }

      setPendingFiles([]);
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
      alert("Delete permission is restricted.");
      return;
    }

    const canDelete =
      userTeam === "ADMIN" ||
      userRole === "master" ||
      (userName && asset.author.includes(userName));
    if (!canDelete) {
      alert("You do not have permission to delete this file.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete "${asset.filename}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${asset.path}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `token ${githubToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Delete template: ${asset.filename}`,
            sha: asset.sha,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete file");
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
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.write(previewContent);
      newWindow.document.close();
    }
  };

  const selectedAssetData = assets.find((a) => a.id === selectedAsset);

  const handleLogin = (
    token: string,
    name: string,
    team: string,
    role: string,
  ) => {
    setGithubToken(token || null);
    setUserName(name);
    setUserTeam(team || "CM기획팀");
    setUserRole(role || "normal");
    setSelectedTeam(team === "ADMIN" ? "CM기획팀" : team || "CM기획팀");
    setIsAdmin(true);
    setIsLoggedIn(true);
  };

  const handleGuestAccess = () => {
    setGithubToken(import.meta.env.VITE_GITHUB_TOKEN || null);
    setUserName("Guest");
    setUserTeam("CM기획팀");
    setSelectedTeam("CM기획팀");
    setIsAdmin(false);
    setUserRole("guest");
    setIsLoggedIn(true);
    setViewMode("PREVIEW");
  };

  if (!isLoggedIn) {
    return (
      <LoginPage onLogin={handleLogin} onGuestAccess={handleGuestAccess} />
    );
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
            <span className="font-bold tracking-tight text-white text-base">
              HMCM Mock-up
            </span>
          </div>

          <div className="h-4 w-px bg-white/20" />

          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-white/10 text-emerald-100 font-bold text-[10px] tracking-widest uppercase border border-white/20 rounded-lg px-3 py-1 outline-none hover:bg-white/20 transition-all cursor-pointer appearance-none"
          >
            {TEAMS.map((team) => (
              <option
                key={team}
                value={team}
                className="bg-[#244d47] text-white py-1"
              >
                {team}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2 ml-2">
            <div
              className={`w-2 h-2 rounded-full ${isAdmin ? (githubToken ? "bg-emerald-400" : "bg-amber-400") : "bg-slate-400"}`}
            />
            <span className="font-bold text-xs uppercase tracking-widest text-emerald-100/90">
              {isAdmin
                ? githubToken
                  ? userTeam === "ADMIN"
                    ? `${userName} (ADMIN)`
                    : `${userName}`
                  : `${userName} (TOKEN MISSING)`
                : "GUEST MODE"}
            </span>
          </div>
        </div>

        {/* Mode Tabs in Navbar */}
        <div className="flex items-center bg-white/10 rounded-full p-0.5">
          <button
            onClick={() => setViewMode("UPLOAD")}
            className={`px-6 py-1.5 rounded-full text-[9px] font-bold tracking-widest transition-all ${
              viewMode === "UPLOAD"
                ? "bg-white text-[#244d47]"
                : "text-white/60 hover:text-white"
            }`}
          >
            BROADCAST
          </button>
          <button
            onClick={() => setViewMode("PREVIEW")}
            className={`px-6 py-1.5 rounded-full text-[9px] font-bold tracking-widest transition-all ${
              viewMode === "PREVIEW"
                ? "bg-white text-[#244d47]"
                : "text-white/60 hover:text-white"
            }`}
          >
            PREVIEW
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchFiles}
            className={`p-1.5 hover:bg-white/10 rounded-full transition-colors ${isLoading ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setIsAdmin(false);
              setUserName(null);
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
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
                Repository Contents
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1 pb-1">
              {[
                "All",
                ...usersList
                  .filter((u) => u.team === selectedTeam)
                  .map((u) => u.name),
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[10px] transition-all whitespace-nowrap font-bold ${
                    activeTab === tab
                      ? "bg-[#244d47] text-white shadow-sm"
                      : "bg-black/5 text-slate-500 hover:bg-black/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {isLoading && assets.length === 0 ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="font-bold text-[10px] tracking-widest uppercase">
                  Fetching files...
                </span>
              </div>
            ) : assets.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-[11px] text-slate-400">
                  No templates detected in target directory.
                </p>
              </div>
            ) : (
              (() => {
                const filteredAssets = assets.filter(
                  (asset) =>
                    activeTab === "All" ||
                    asset.author?.includes(activeTab) ||
                    asset.filename.includes(activeTab),
                );

                const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;

                const webAssetsAll = filteredAssets.filter(
                  (a) =>
                    a.isFolder || a.filename.toLowerCase().endsWith(".html"),
                );
                const webAssets = webAssetsAll.filter(
                  (a) => (a.rawDate || Date.now()) >= cutoff,
                );
                const webAssetsOld = webAssetsAll.filter(
                  (a) => (a.rawDate || Date.now()) < cutoff,
                );

                const mdAssetsAll = filteredAssets.filter((a) =>
                  a.filename.toLowerCase().endsWith(".md"),
                );
                const mdAssets = mdAssetsAll.filter(
                  (a) => (a.rawDate || Date.now()) >= cutoff,
                );
                const mdAssetsOld = mdAssetsAll.filter(
                  (a) => (a.rawDate || Date.now()) < cutoff,
                );

                const otherAssetsAll = filteredAssets.filter(
                  (a) =>
                    !a.isFolder &&
                    !a.filename.toLowerCase().endsWith(".html") &&
                    !a.filename.toLowerCase().endsWith(".md"),
                );
                const otherAssets = otherAssetsAll.filter(
                  (a) => (a.rawDate || Date.now()) >= cutoff,
                );
                const otherAssetsOld = otherAssetsAll.filter(
                  (a) => (a.rawDate || Date.now()) < cutoff,
                );

                const renderItem = (asset: Asset) => (
                  <div key={asset.id} className="relative group">
                    <button
                      onClick={() => onAssetSelect(asset.id)}
                      className={`w-full text-left py-3 px-4 border-b border-slate-100 transition-all relative ${
                        selectedAsset === asset.id
                          ? "bg-[#244d47]/5 border-l-4 border-l-[#244d47]"
                          : "hover:bg-black/[0.02]"
                      }`}
                    >
                      <div className="space-y-1 pr-6">
                        <h4
                          className={`text-[13px] font-bold truncate transition-colors ${
                            selectedAsset === asset.id
                              ? "text-[#244d47]"
                              : "text-slate-700 group-hover:text-[#244d47]"
                          }`}
                        >
                          {asset.filename}
                        </h4>
                        <div className="flex flex-col gap-1.5 text-slate-400 font-bold text-[11px] mt-2">
                          <div className="flex items-center justify-between uppercase tracking-tighter">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5" />
                              <span className="truncate">{asset.author}</span>
                            </div>
                            <div className="flex items-center text-emerald-600/60">
                              {asset.isFolder ? (
                                <FolderArchive className="w-3.5 h-3.5" />
                              ) : (
                                <Layers className="w-3.5 h-3.5" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 uppercase tracking-tighter">
                            <Clock className="w-3.5 h-3.5 text-emerald-600/60" />
                            {asset.timestamp}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-all ${
                          selectedAsset === asset.id
                            ? "text-[#244d47] translate-x-1"
                            : "text-slate-300 group-hover:translate-x-1 group-hover:text-[#244d47]"
                        }`}
                      />
                    </button>

                    {isAdmin &&
                      (userTeam === "ADMIN" ||
                        userRole === "master" ||
                        (userName && asset.author.includes(userName))) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(asset);
                          }}
                          className="absolute right-10 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-100 group-hover:opacity-100 z-10 bg-white/50 backdrop-blur-sm"
                          title="Delete Template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                  </div>
                );

                return (
                  <div className="flex flex-col h-full">
                    {webAssetsAll.length > 0 && (
                      <div
                        className={`flex flex-col min-h-0 border-b border-slate-200 ${isWebExpanded ? "shrink" : "shrink-0"}`}
                      >
                        <div className="sticky top-0 z-10 bg-[#f8faf9] border-y border-slate-200 flex items-center justify-between group">
                          <button
                            onClick={() => setIsWebExpanded(!isWebExpanded)}
                            className="flex-1 flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                              Web Templates{" "}
                              <span className="text-slate-400 font-normal ml-1">
                                ({webAssetsAll.length})
                              </span>
                            </span>
                          </button>
                          <div className="flex items-center">
                            {webAssetsOld.length > 0 && (
                              <button
                                onClick={() =>
                                  setIsWebOldExpanded(!isWebOldExpanded)
                                }
                                className={`px-2 py-0.5 mr-2 text-[9px] font-bold rounded flex items-center uppercase transition-colors ${
                                  isWebOldExpanded
                                    ? "bg-[#244d47] text-white hover:bg-[#1a3834]"
                                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                }`}
                              >
                                OLD({webAssetsOld.length})
                              </button>
                            )}
                            <button
                              onClick={() => setIsWebExpanded(!isWebExpanded)}
                              className="px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform ${isWebExpanded ? "" : "-rotate-90"}`}
                              />
                            </button>
                          </div>
                        </div>
                        {isWebExpanded && (
                          <div className="overflow-y-auto custom-scrollbar flex-1">
                            {webAssets.map(renderItem)}
                            {isWebOldExpanded && webAssetsOld.map(renderItem)}
                          </div>
                        )}
                      </div>
                    )}
                    {mdAssetsAll.length > 0 && (
                      <div
                        className={`flex flex-col min-h-0 border-b border-slate-200 ${isMdExpanded ? "shrink" : "shrink-0"}`}
                      >
                        <div className="sticky top-0 z-10 bg-[#f8faf9] border-y border-slate-200 flex items-center justify-between group">
                          <button
                            onClick={() => setIsMdExpanded(!isMdExpanded)}
                            className="flex-1 flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                              Markdown{" "}
                              <span className="text-slate-400 font-normal ml-1">
                                ({mdAssetsAll.length})
                              </span>
                            </span>
                          </button>
                          <div className="flex items-center">
                            {mdAssetsOld.length > 0 && (
                              <button
                                onClick={() =>
                                  setIsMdOldExpanded(!isMdOldExpanded)
                                }
                                className={`px-2 py-0.5 mr-2 text-[9px] font-bold rounded flex items-center uppercase transition-colors ${
                                  isMdOldExpanded
                                    ? "bg-[#244d47] text-white hover:bg-[#1a3834]"
                                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                }`}
                              >
                                OLD({mdAssetsOld.length})
                              </button>
                            )}
                            <button
                              onClick={() => setIsMdExpanded(!isMdExpanded)}
                              className="px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform ${isMdExpanded ? "" : "-rotate-90"}`}
                              />
                            </button>
                          </div>
                        </div>
                        {isMdExpanded && (
                          <div className="overflow-y-auto custom-scrollbar flex-1">
                            {mdAssets.map(renderItem)}
                            {isMdOldExpanded && mdAssetsOld.map(renderItem)}
                          </div>
                        )}
                      </div>
                    )}
                    {otherAssetsAll.length > 0 && (
                      <div
                        className={`flex flex-col min-h-0 ${isOthersExpanded ? "shrink" : "shrink-0"}`}
                      >
                        <div className="sticky top-0 z-10 bg-[#f8faf9] border-y border-slate-200 flex items-center justify-between group">
                          <button
                            onClick={() =>
                              setIsOthersExpanded(!isOthersExpanded)
                            }
                            className="flex-1 flex items-center px-4 py-2 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-left">
                              Others{" "}
                              <span className="text-slate-400 font-normal ml-1">
                                ({otherAssetsAll.length})
                              </span>
                            </span>
                          </button>
                          <div className="flex items-center">
                            {otherAssetsOld.length > 0 && (
                              <button
                                onClick={() =>
                                  setIsOthersOldExpanded(!isOthersOldExpanded)
                                }
                                className={`px-2 py-0.5 mr-2 text-[9px] font-bold rounded flex items-center uppercase transition-colors ${
                                  isOthersOldExpanded
                                    ? "bg-[#244d47] text-white hover:bg-[#1a3834]"
                                    : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                                }`}
                              >
                                OLD({otherAssetsOld.length})
                              </button>
                            )}
                            <button
                              onClick={() =>
                                setIsOthersExpanded(!isOthersExpanded)
                              }
                              className="px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <ChevronDown
                                className={`w-4 h-4 text-slate-400 transition-transform ${isOthersExpanded ? "" : "-rotate-90"}`}
                              />
                            </button>
                          </div>
                        </div>
                        {isOthersExpanded && (
                          <div className="overflow-y-auto custom-scrollbar flex-1">
                            {otherAssets.map(renderItem)}
                            {isOthersOldExpanded &&
                              otherAssetsOld.map(renderItem)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 relative flex flex-col bg-[#f0f4f3] overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === "UPLOAD" ? (
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
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tighter mb-2 font-display">
                        Authentication Required
                      </h2>
                      <p className="text-slate-500 text-sm normal-case leading-relaxed font-medium">
                        Sync capabilities are locked for Guest sessions. Please
                        authorize via Administrative credentials to execute
                        synchronization.
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
                      <h1 className="text-6xl font-black tracking-tighter text-slate-800 mb-2 font-display">
                        Fast Sync
                      </h1>
                    </div>

                    {!githubToken && (
                      <div className="w-full max-w-xl mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                            Secret Configuration Required
                          </p>
                          <p className="text-xs text-amber-700 leading-relaxed">
                            Admin session active, but GitHub API Token is
                            missing. Please add{" "}
                            <code className="bg-amber-100 px-1 rounded">
                              VITE_GITHUB_TOKEN
                            </code>{" "}
                            to AI Studio Secrets to enable deployments.
                          </p>
                        </div>
                      </div>
                    )}

                    {error && (
                      <div className="w-full max-w-xl mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-xs font-bold text-red-700">
                          {error}
                        </p>
                      </div>
                    )}

                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full max-w-xl aspect-[4/3] rounded-[48px] flex flex-col items-center justify-center p-12 transition-all duration-500 border-2 relative overflow-hidden bg-white cursor-pointer group shadow-xl ${
                        isDragOver
                          ? "border-emerald-500 bg-emerald-50 scale-[1.02]"
                          : "border-dashed border-slate-200 hover:border-emerald-400"
                      }`}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                        accept=".html,.htm,.zip,.css,.js"
                        multiple
                      />

                      <div
                        className={`w-32 h-32 rounded-[40px] bg-slate-50 border border-slate-200 flex items-center justify-center mb-8 transition-all duration-500 ${
                          isDragOver || pendingFiles.length > 0
                            ? "scale-110 border-emerald-500 bg-emerald-50 shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                            : "group-hover:scale-105 group-hover:border-emerald-200"
                        }`}
                      >
                        <Upload
                          className={`w-12 h-12 transition-colors ${isDragOver || pendingFiles.length > 0 ? "text-emerald-500" : "text-slate-300"}`}
                        />
                      </div>

                      <h2 className="text-2xl font-bold text-slate-800 mb-8 truncate max-w-full tracking-tight font-display">
                        {pendingFiles.length === 1
                          ? pendingFiles[0].name
                          : pendingFiles.length > 1
                            ? `${pendingFiles.length} files selected`
                            : "Select or Drop Content"}
                      </h2>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpload();
                        }}
                        disabled={pendingFiles.length === 0 || isCommiting}
                        className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.2em] transition-all text-xs ${
                          pendingFiles.length > 0
                            ? "bg-[#244d47] text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isCommiting ? (
                          <Loader2 className="animate-spin inline mr-2 h-4 w-4" />
                        ) : (
                          "Execute Synchronization"
                        )}
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
                className="flex-1 flex flex-col p-6 min-h-0"
              >
                {previewContent ? (
                  <div className="flex-1 w-full bg-white rounded-[32px] overflow-hidden shadow-xl border border-black/5 flex flex-col min-h-0">
                    <div className="h-12 px-6 flex items-center justify-between border-b border-black/5 bg-[#f8faf9] shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                          <div className="w-3 h-3 rounded-full bg-slate-200" />
                        </div>
                        <div className="h-4 w-px bg-slate-200 ml-4" />
                        <span className="font-bold text-[11px] text-slate-500 truncate max-w-xs uppercase tracking-widest">
                          {selectedAssetData?.filename}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedAssetData?.filename
                          .toLowerCase()
                          .endsWith(".md") && (
                          <button
                            onClick={() => setIsMarkdownDark(!isMarkdownDark)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all font-bold text-[10px] tracking-wide uppercase"
                          >
                            {isMarkdownDark ? "Light View" : "Dark View"}
                          </button>
                        )}
                        <button
                          onClick={openInNewWindow}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#244d47] text-white hover:bg-[#1a3834] transition-all font-bold text-[10px] tracking-widest uppercase shadow-md"
                        >
                          New Window
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {selectedAssetData?.isFolder ? (
                      <iframe
                        title="live-preview"
                        src={previewContent || ""}
                        className="flex-1 w-full bg-white border-none"
                      />
                    ) : selectedAssetData?.filename
                        .toLowerCase()
                        .endsWith(".md") ? (
                      <div
                        className={`flex-1 w-full flex overflow-hidden ${
                          isMarkdownDark ? "bg-[#1e1e1e]" : "bg-white"
                        }`}
                      >
                        <div
                          id="markdown-scroll-container"
                          className={`flex-1 overflow-y-auto p-12 lg:px-12 scroll-smooth ${
                            isMarkdownDark
                              ? "custom-scrollbar-dark"
                              : "custom-scrollbar"
                          }`}
                        >
                          <div className="max-w-4xl mx-auto">
                            <div
                              className={`prose max-w-none prose-headings:font-bold prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md marker:text-slate-400 ${
                                isMarkdownDark
                                  ? "prose-invert prose-slate prose-a:text-emerald-400 prose-code:bg-[#2d2d2d] prose-pre:bg-[#2d2d2d]"
                                  : "prose-slate prose-a:text-emerald-600 prose-code:bg-slate-100 prose-pre:bg-slate-50 prose-pre:text-slate-800 prose-code:text-slate-800"
                              }`}
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw, rehypeSlug]}
                                components={{
                                  div({ node, className, ...props }: any) {
                                    if (
                                      className === "raw-html-embed" &&
                                      props["data-html"]
                                    ) {
                                      let rawHtml = "";
                                      try {
                                        rawHtml = decodeURIComponent(
                                          escape(atob(props["data-html"])),
                                        );
                                      } catch (e) {
                                        rawHtml =
                                          "<div>[Embedded HTML decoding failed]</div>";
                                      }
                                      return (
                                        <div
                                          className="my-4 overflow-x-auto w-full flex justify-center bg-transparent rounded-lg"
                                          dangerouslySetInnerHTML={{
                                            __html: rawHtml,
                                          }}
                                        />
                                      );
                                    }
                                    return (
                                      <div className={className} {...props} />
                                    );
                                  },
                                  code({
                                    node,
                                    className,
                                    children,
                                    ...props
                                  }: any) {
                                    const match = /language-(\w+)/.exec(
                                      className || "",
                                    );
                                    const lang = match ? match[1] : "";
                                    if (lang === "mermaid") {
                                      return (
                                        <MermaidChart
                                          chart={String(children).replace(
                                            /\n$/,
                                            "",
                                          )}
                                          isDark={isMarkdownDark}
                                        />
                                      );
                                    }
                                    if (
                                      lang === "html" ||
                                      lang === "svg" ||
                                      lang === "xml"
                                    ) {
                                      const contentStr = String(
                                        children,
                                      ).replace(/\n$/, "");
                                      const trimmed = contentStr.trim();
                                      if (
                                        trimmed.startsWith("<svg") ||
                                        trimmed.startsWith("<table") ||
                                        trimmed.startsWith("<!--")
                                      ) {
                                        return (
                                          <div
                                            className="my-4 overflow-x-auto w-full flex justify-center bg-transparent rounded-lg"
                                            dangerouslySetInnerHTML={{
                                              __html: contentStr,
                                            }}
                                          />
                                        );
                                      }
                                    }
                                    return (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    );
                                  },
                                }}
                              >
                                {(previewContent || "")
                                  .replace(
                                    /<\s*svg[\s\S]*?<\/\s*svg\s*>/gi,
                                    (match) =>
                                      `<div class="raw-html-embed" data-html="${btoa(unescape(encodeURIComponent(match)))}"></div>`,
                                  )
                                  .replace(
                                    /<\s*table[\s\S]*?<\/\s*table\s*>/gi,
                                    (match) =>
                                      `<div class="raw-html-embed" data-html="${btoa(unescape(encodeURIComponent(match)))}"></div>`,
                                  )}
                              </ReactMarkdown>
                            </div>
                          </div>
                        </div>
                        <MarkdownToc
                          content={previewContent || ""}
                          isDark={isMarkdownDark}
                          filename={selectedAssetData?.filename || ""}
                        />
                      </div>
                    ) : selectedAssetData?.filename
                        .toLowerCase()
                        .endsWith(".txt") ? (
                      <div className="flex-1 w-full bg-white overflow-auto p-8">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800 font-medium">
                          {previewContent}
                        </pre>
                      </div>
                    ) : (
                      <iframe
                        title="live-preview"
                        srcDoc={previewContent || ""}
                        className="flex-1 w-full bg-white border-none"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
                      <Eye className="w-10 h-10 opacity-40" />
                    </div>
                    <p className="font-bold text-[12px] tracking-widest uppercase text-slate-400">
                      Select an asset to visualize
                    </p>
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
          <span className="font-bold text-[9px] uppercase tracking-[0.2em]">
            HM CM Planning Team
          </span>
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
