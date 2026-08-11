import React, { useState } from 'react';
import { GENERATE_LINUX_SCRIPT } from '../data/linuxScript';
import { Terminal, Copy, Check, Download, Server, ShieldCheck, Globe, Cpu, RefreshCw, Play, Settings, AlertCircle, Trash2 } from 'lucide-react';

export const LinuxDeployer: React.FC = () => {
  const [port, setPort] = useState<number>(3000);
  const [domain, setDomain] = useState<string>('gamestan.ir');
  const [enableSsl, setEnableSsl] = useState<boolean>(true);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [copiedCommand, setCopiedCommand] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'cli' | 'code' | 'guide'>('cli');

  // Simulated CLI Terminal State
  const [cliOutput, setCliOutput] = useState<string[]>([]);
  const [currentMenuStep, setCurrentMenuStep] = useState<'main' | 'installing' | 'status' | 'uninstalled'>('main');

  const scriptContent = GENERATE_LINUX_SCRIPT(port, domain, enableSsl);

  const oneLinerCommand = `curl -sSL https://raw.githubusercontent.com/gamestan/app/main/setup-gamestan.sh | sudo bash`;

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([scriptContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'setup-gamestan.sh';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // CLI Action Simulators
  const runCliOption = (option: number) => {
    if (option === 1) {
      setCliOutput([
        `🚀 شروع نصب وب‌اپلیکیشن گیمستان روی پورت ${port}...`,
        `🔄 در حال نصب پیش‌نیازهای لینوکس (Node.js 20, Nginx, Certbot)...`,
        `✅ پکیج‌ها با موفقیت در /opt/gamestan نصب شدند.`,
        `🔨 در حال ساخت فایل‌های اجرایی Production Build...`,
        `⚙️ سرویس Systemd (gamestan.service) ساخته و فعال شد.`,
        `🌐 Nginx Reverse Proxy روی دامنه ${domain} (پورت ${port}) تنظیم گردید.`,
        enableSsl ? `🔒 گواهی SSL Certbot برای ${domain} با موفقیت دریافت و فعال گردید.` : `⚠️ گواهی SSL غیرفعال انتخاب شد.`,
        `🎉 نصب با موفقیت پایان یافت! آدرس: http://${domain} (یا https://${domain})`
      ]);
      setCurrentMenuStep('installing');
    } else if (option === 2) {
      setCliOutput([
        `🔄 در حال به‌روزرسانی پروژه گیمستان...`,
        `📥 دریافت آخرین تغییرات و نصب پکیج‌ها (npm install)...`,
        `🔨 ساخت مجدد پروژه (npm run build)...`,
        `🔄 ریستارت سرویس systemctl restart gamestan...`,
        `✅ آپدیت وب‌اپلیکیشن با موفقیت کامل شد!`
      ]);
      setCurrentMenuStep('installing');
    } else if (option === 3) {
      setCliOutput([
        `⚙️ تغییر تنظیمات پورت و دامنه:`,
        `پورت فعلی: ${port} | دامنه: ${domain}`,
        `✅ سرویس gamestan.service با پورت ${port} بروزرسانی گردید.`,
        `✅ پیکربندی Nginx reloaded.`
      ]);
      setCurrentMenuStep('installing');
    } else if (option === 4) {
      setCliOutput([
        `📊 وضعیت سرویس gamestan.service:`,
        `● gamestan.service - Gamestan Web App Service`,
        `   Loaded: loaded (/etc/systemd/system/gamestan.service; enabled)`,
        `   Active: active (running) since Tue 2026-08-11 15:45:00 UTC`,
        `   Main PID: 14205 (node)`,
        `   Memory: 64.2M`,
        `   CGroup: /system.slice/gamestan.service`,
        `           └─14205 node /opt/gamestan/node_modules/.bin/vite preview --port ${port}`,
        `📑 لاگ‌های اخیر: [INFO] Server started on http://0.0.0.0:${port}`
      ]);
      setCurrentMenuStep('status');
    } else if (option === 5) {
      setCliOutput([
        `⚠️ در حال حذف کامل گیمستان از سرور...`,
        `🛑 توقف سرویس gamestan.service...`,
        `🗑️ حذف فایل‌های Nginx و سرویس...`,
        `🗑️ پاکسازی پوشه /opt/gamestan...`,
        `✅ گیمستان با موفقیت از سیستم حذف شد.`
      ]);
      setCurrentMenuStep('uninstalled');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl" dir="rtl">
      {/* Header */}
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
            🐧
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">نصب‌کننده و مدیر سرور لینوکس (Gamestan Linux Installer)</h3>
            <p className="text-xs text-slate-400">اسکریپت بش کاملاً خودکار با منوی تعاملی، Nginx، SSL و پورت سفارشی</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('cli')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'cli' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            شبیه‌ساز منوی بش لینوکس
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'code' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-4 h-4" />
            مشاهده سورس کدهای Bash
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'guide' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            راهنمای استقرار سرور
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Settings Panel */}
        <div className="w-full md:w-80 bg-slate-950/90 border-b md:border-b-0 md:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
          <h4 className="font-extrabold text-xs text-amber-400 flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            تنظیمات اسکریپت لینوکس:
          </h4>

          {/* Port input */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-bold block">پورت اجرای برنامه‌ روی لینوکس:</label>
            <input
              type="number"
              value={port}
              onChange={e => setPort(Number(e.target.value))}
              placeholder="مثال: 3000"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <p className="text-[10px] text-slate-500">پورت داخلی Node.js / Systemd (مثلا 3000 یا 8080)</p>
          </div>

          {/* Domain Input */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-300 font-bold block">نام دامنه یا زیردامنه:</label>
            <input
              type="text"
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="gamestan.example.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <p className="text-[10px] text-slate-500">جهت پیکربندی خودکار Nginx Reverse Proxy</p>
          </div>

          {/* SSL Checkbox */}
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-200 font-bold">فعال‌سازی SSL رایگان (Certbot)</span>
            </div>
            <input
              type="checkbox"
              checked={enableSsl}
              onChange={e => setEnableSsl(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          {/* Download & Copy Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-98"
            >
              <Download className="w-4 h-4" />
              دانلود فایل setup-gamestan.sh
            </button>

            <button
              onClick={() => copyToClipboard(scriptContent, setCopiedScript)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copiedScript ? 'کد اسکریپت کپی شد!' : 'کپی کامل سورس Bash'}
            </button>
          </div>

          {/* One-Liner Command Box */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1.5 mt-auto">
            <p className="text-[10px] text-amber-400 font-bold">دستور تک‌خطی نصب سریع در لینوکس:</p>
            <div className="bg-slate-950 p-2 rounded-lg font-mono text-[10px] text-emerald-400 break-all border border-slate-800 relative">
              {oneLinerCommand}
            </div>
            <button
              onClick={() => copyToClipboard(oneLinerCommand, setCopiedCommand)}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition"
            >
              {copiedCommand ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              کپی دستور تک‌خطی
            </button>
          </div>
        </div>

        {/* Display Area based on tab */}
        <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden p-4">
          {activeTab === 'cli' && (
            <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              {/* Terminal Titlebar */}
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-slate-300 font-bold mr-2">root@gamestan-server:~# ./setup-gamestan.sh</span>
                </div>
                <span className="text-cyan-400 font-bold">Linux Bash Menu v2.0</span>
              </div>

              {/* Terminal Content */}
              <div className="flex-1 p-4 font-mono text-xs text-slate-200 overflow-y-auto space-y-2 bg-slate-950/80">
                {/* Banner */}
                <div className="text-cyan-400 font-extrabold leading-relaxed">
                  ==========================================================================<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🎮 اسکریپت نصب و مدیریت هوشمند سرور «گیمستان» (Gamestan) 🎮<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;پشتیبانی کامل از وب‌اپلیکیشن، پورت سفارشی و SSL<br />
                  ==========================================================================
                </div>

                {/* Options Menu Buttons */}
                <div className="my-4 bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-2">
                  <p className="text-amber-400 font-bold">لطفاً برای تست منوی لینوکس، یکی از گزینه‌های زیر را کلیک کنید:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <button
                      onClick={() => runCliOption(1)}
                      className="p-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-right font-bold transition flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>۱) 🚀 نصب کامل گیمستان (پورت {port} / دامنه {domain})</span>
                    </button>

                    <button
                      onClick={() => runCliOption(2)}
                      className="p-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-xl text-right font-bold transition flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4 shrink-0 text-blue-400" />
                      <span>۲) 🔄 به‌روزرسانی پروژه (Update & Build)</span>
                    </button>

                    <button
                      onClick={() => runCliOption(3)}
                      className="p-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded-xl text-right font-bold transition flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>۳) ⚙️ تنظیم مجدد پورت و SSL</span>
                    </button>

                    <button
                      onClick={() => runCliOption(4)}
                      className="p-2.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 rounded-xl text-right font-bold transition flex items-center gap-2"
                    >
                      <Cpu className="w-4 h-4 shrink-0 text-purple-400" />
                      <span>۴) 📊 مشاهده وضعیت سرویس و لاگ‌ها</span>
                    </button>

                    <button
                      onClick={() => runCliOption(5)}
                      className="p-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-right font-bold transition flex items-center gap-2 md:col-span-2"
                    >
                      <Trash2 className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>۵) 🗑️ حذف کامل (Uninstall) گیمستان از لینوکس</span>
                    </button>
                  </div>
                </div>

                {/* Output console log */}
                {cliOutput.length > 0 && (
                  <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                    <p className="text-slate-400 text-[11px]">خروجی اجرای گزینه منو:</p>
                    {cliOutput.map((line, idx) => (
                      <p key={idx} className="text-emerald-300 font-mono text-xs">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 text-xs font-mono text-amber-400 font-bold flex justify-between items-center">
                <span>setup-gamestan.sh</span>
                <span className="text-slate-500">Bash Script (Linux)</span>
              </div>
              <textarea
                value={scriptContent}
                readOnly
                className="flex-1 w-full bg-slate-950 p-4 font-mono text-xs text-slate-200 focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-200">
              <h3 className="text-base font-extrabold text-amber-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                مراحل استقرار «گیمستان» روی لینوکس (Ubuntu / Debian / CentOS / RHEL)
              </h3>

              <div className="space-y-3">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-300 text-sm">مرحله ۱: دانلود و اعطای دسترسی اجرایی</h4>
                  <p className="text-slate-400">فایل اسکریپت را به سرور منتقل کرده یا مستقیماً دانلود نمایید:</p>
                  <pre className="bg-slate-900 p-2.5 rounded-lg font-mono text-emerald-400">
                    wget https://raw.githubusercontent.com/gamestan/app/main/setup-gamestan.sh{'\n'}
                    chmod +x setup-gamestan.sh
                  </pre>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-300 text-sm">مرحله ۲: اجرای منوی لینوکس</h4>
                  <p className="text-slate-400">اسکریپت را با دسترسی Root یا Sudo اجرای فرمایید:</p>
                  <pre className="bg-slate-900 p-2.5 rounded-lg font-mono text-emerald-400">
                    sudo ./setup-gamestan.sh
                  </pre>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-cyan-300 text-sm">ویژگی‌های برجسته منوی لینوکس گیمستان:</h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    <li><strong>تعیین پورت اختصاصی:</strong> امکان اجرای برنامه روی پورت‌های دلخواه (مانند 3000، 8080 و ...)</li>
                    <li><strong>پیکربندی Nginx Reverse Proxy:</strong> متصل‌سازی پورت برنامه به دامنه اینترنتی</li>
                    <li><strong>گواهی SSL رایگان:</strong> دریافت خودکار گواهی HTTPS از Let's Encrypt / Certbot</li>
                    <li><strong>مدیریت با Systemd:</strong> ایجاد سرویس <code className="text-amber-300">gamestan.service</code> برای اجرای دائمی و راه‌اندازی خودکار پس از ریستارت سرور</li>
                    <li><strong>منوی جامع لینوکس:</strong> گزینه‌های اختصاصی برای نصب، آپدیت کدهای پروژه، چک لاگ‌ها و آنینستال کامل.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
