import React, { useState } from 'react';
import { MAUI_FILES } from '../data/mauiFiles';
import { MauiFile } from '../types/gamestan';
import { FileCode, Copy, Check, Terminal, Play, Search, Code2, AlertCircle } from 'lucide-react';

export const CodeInspector: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<MauiFile>(MAUI_FILES[1]); // MauiProgram.cs
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [codeContent, setCodeContent] = useState<string>(selectedFile.content);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleSelectFile = (file: MauiFile) => {
    setSelectedFile(file);
    setCodeContent(file.content);
    setAnalysisResult(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runMauiAnalyzer = () => {
    // Perform simulated .NET 9 MAUI analysis
    let issues: string[] = [];
    if (codeContent.includes('TargetFramework') && !codeContent.includes('net9.0')) {
      issues.push('⚠️ فریمورک باید net9.0-android باشد.');
    }
    if (selectedFile.type === 'cs' && !codeContent.includes('namespace MauiApp5')) {
      issues.push('⚠️ فضای نام (Namespace) باید MauiApp5 باشد.');
    }
    if (selectedFile.id === 'maui-program' && !codeContent.includes('UseLocalNotification')) {
      issues.push('💡 پیشنهاد: افزودن UseLocalNotification() برای اعلانات درون بازی.');
    }

    if (issues.length === 0) {
      setAnalysisResult('✅ کد کاملاً طبق استاندارد پروژه صحیح و بدون خطا است.');
    } else {
      setAnalysisResult(issues.join('\n'));
    }
  };

  const filteredFiles = MAUI_FILES.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.path.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" dir="rtl">
      {/* Code Inspector Header */}
      <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-extrabold text-sm text-white">تحلیلگر کدهای C# و XAML پروژه</h3>
            <p className="text-[11px] text-slate-400">نمایش و بررسی ساختار C# و XAML کلاینت گیمستان</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runMauiAnalyzer}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-lg shadow flex items-center gap-1.5 transition active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            تحلیل کدهای پروژه
          </button>
          <button
            onClick={handleCopy}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
            title="کپی کد"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* File Sidebar */}
        <div className="w-full md:w-64 bg-slate-950/80 border-b md:border-b-0 md:border-l border-slate-800 p-2 flex flex-col gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="جستجوی فایل‌های سورس..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pr-8 pl-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* File list */}
          <div className="flex-1 overflow-y-auto space-y-1">
            {filteredFiles.map(file => {
              const isSelected = selectedFile.id === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`w-full p-2 rounded-lg text-right transition flex items-center gap-2 text-xs font-mono ${
                    isSelected
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <FileCode className={`w-4 h-4 shrink-0 ${file.type === 'cs' ? 'text-blue-400' : 'text-amber-400'}`} />
                  <div className="truncate">
                    <p className="font-bold truncate">{file.name}</p>
                    <p className="text-[9px] text-slate-500 truncate">{file.path}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 flex flex-col bg-slate-900/90 overflow-hidden">
          {/* File bar */}
          <div className="bg-slate-950/50 px-4 py-2 border-b border-slate-800/60 flex items-center justify-between text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">{selectedFile.name}</span>
              <span className="text-slate-600">({selectedFile.path})</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
              {selectedFile.type.toUpperCase()}
            </span>
          </div>

          {/* Code Text Area */}
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-950/40">
            <textarea
              value={codeContent}
              onChange={e => setCodeContent(e.target.value)}
              className="w-full h-full bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* Analysis Results Footer */}
          {analysisResult && (
            <div className="bg-slate-950 p-3 border-t border-slate-800 text-xs font-mono whitespace-pre-wrap flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-slate-300">{analysisResult}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
