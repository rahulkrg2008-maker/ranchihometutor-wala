import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowLeft, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2,
  FileCheck2,
  Users2
} from 'lucide-react';
import { StorageService } from '../../services/storageService';
import { LOGO_IMG } from '../../assets/images';
import { GeometryCompass, Protractor, FountainPen, DraftingPencil } from '../public/StationeryItems';

interface AdminPortalViewProps {
  onLoginSuccess: () => void;
  onExitToPublic: () => void;
  onShowNotification: (msg: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  onLoginSuccess,
  onExitToPublic,
  onShowNotification,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await StorageService.loginAdmin(email, password);
      setIsLoading(false);
      if (res.success) {
        onShowNotification('Coordinator login successful. Welcome to Control Center!');
        setPassword(''); onLoginSuccess();
      } else {
        setErrorMsg(res.error || 'Invalid email or password. Only authorized coordinators may access /admin.');
      }
    } catch {
      setIsLoading(false);
      setErrorMsg('Could not connect to authentication server. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#071A36] text-white flex flex-col relative overflow-hidden font-sans selection:bg-[#0BA3FF] selection:text-white">
      {/* Background Blueprint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(11, 163, 255, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 163, 255, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '26px 26px',
        }}
      />

      {/* Ambient Lighting Gradients */}
      <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-[#0BA3FF]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      {/* Decorative Stationary Drafts in Background */}
      <div className="absolute top-12 left-8 opacity-25 hidden lg:block -rotate-12 pointer-events-none">
        <GeometryCompass size={180} />
      </div>
      <div className="absolute bottom-10 left-12 opacity-20 hidden md:block rotate-12 pointer-events-none">
        <Protractor size={200} />
      </div>
      <div className="absolute top-16 right-12 opacity-25 hidden lg:block rotate-45 pointer-events-none">
        <FountainPen length={200} />
      </div>
      <div className="absolute bottom-16 right-16 opacity-20 hidden md:block -rotate-15 pointer-events-none">
        <DraftingPencil length={190} />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full border-b border-sky-900/60 bg-[#071A36]/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white p-0.5 border border-[#0BA3FF] shadow-sm flex items-center justify-center overflow-hidden">
            <img src={LOGO_IMG} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Ranchi HomeTutor Wala
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#0BA3FF]/20 text-[#0BA3FF] text-[10px] font-black border border-[#0BA3FF]/40">
                ADMIN PORTAL
              </span>
            </div>
            <p className="text-[11px] text-sky-200/70 font-mono">
              Dedicated URL: <span className="text-[#0BA3FF] font-semibold">domain/admin</span>
            </p>
          </div>
        </div>

        <button
          onClick={onExitToPublic}
          className="px-3.5 py-1.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 hover:border-[#0BA3FF] text-sky-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#0BA3FF] group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Website</span>
        </button>
      </header>

      {/* Main Login Screen Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md">
          
          {/* Card Container */}
          <div className="bg-[#092247]/95 border-2 border-[#0BA3FF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-sky-950/60 backdrop-blur-xl relative">
            
            {/* Corner Decorative Accent */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-[#0BA3FF] text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-md flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 stroke-[2.5]" />
              <span>Restricted Access</span>
            </div>

            {/* Header / Lock Emblem */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#0BA3FF]/20 border-2 border-[#0BA3FF] text-[#0BA3FF] flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-[#0BA3FF]/25">
                <Lock className="w-7 h-7 stroke-[2.2]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Coordinator Control Center
              </h1>
              <p className="text-xs text-sky-200/80 mt-1.5 max-w-xs mx-auto leading-relaxed">
                Log in to manage tuition leads, verify tutors, approve ratings, and coordinate demo classes.
              </p>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-950/70 border border-red-500/60 rounded-2xl text-red-200 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-sky-200 mb-1.5 tracking-wide">
                  Coordinator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="rht-admin-id"
                    autoComplete="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="coordinator@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#07172C] border border-sky-800/80 text-white placeholder-sky-500 text-xs sm:text-sm focus:outline-none focus:border-[#0BA3FF] focus:ring-2 focus:ring-[#0BA3FF]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-sky-200 tracking-wide">
                    Security Password
                  </label>
                  <span className="text-[11px] text-sky-400 font-mono">Protected</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-sky-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="rht-admin-key"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-2xl bg-[#07172C] border border-sky-800/80 text-white placeholder-sky-500 text-xs sm:text-sm focus:outline-none focus:border-[#0BA3FF] focus:ring-2 focus:ring-[#0BA3FF]/20 transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-[#0BA3FF] hover:bg-[#0892e6] text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-[#0BA3FF]/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4 stroke-[2.5]" />
                    <span>Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            {/* Coordinator Assistance */}
            <div className="mt-5 pt-4 border-t border-sky-900/60 text-center">
              <p className="text-[11px] text-sky-200/70">
                🔒 Direct coordinator login with Supabase verified credentials.
              </p>
            </div>

            {/* Features Preview Badges */}
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[10px] text-sky-200/70 border-t border-sky-900/40 pt-3">
              <div className="flex flex-col items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-[#0BA3FF]" />
                <span>Requirements</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Users2 className="w-3.5 h-3.5 text-[#0BA3FF]" />
                <span>Tutors DB</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0BA3FF]" />
                <span>Demo Classes</span>
              </div>
            </div>

          </div>

          {/* Bottom Security Note */}
          <div className="mt-4 text-center text-[11px] text-sky-300/50">
            <span>🔒 Direct Route: </span>
            <code className="text-[#0BA3FF] font-mono">/admin</code>
            <span> • Authorized personnel only</span>
          </div>

        </div>
      </main>
    </div>
  );
};
