import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Globe, 
  MessageCircle, 
  Instagram, 
  Mail, 
  MapPin, 
  IndianRupee,
  ShieldCheck,
  Database,
  HardDrive,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { StorageService } from '../../services/storageService';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface AdminSettingsProps {
  settings: WebsiteSettings;
  onShowNotification: (msg: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  settings,
  onShowNotification,
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected?: boolean;
    ready: boolean;
    bucketExists?: boolean;
    url?: string;
    bucket: string;
    message?: string;
    isChecking?: boolean;
  }>({
    connected: false,
    ready: false,
    bucketExists: false,
    bucket: 'tutor-documents',
  });

  useEffect(() => {
    checkStorageStatus();
  }, []);

  const checkStorageStatus = async () => {
    setSupabaseStatus(prev => ({ ...prev, isChecking: true }));
    try {
      const res = await fetch('/api/storage/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus({
          connected: Boolean(data.connected),
          ready: Boolean(data.ready),
          bucketExists: Boolean(data.bucketExists),
          url: data.url,
          bucket: data.bucket || 'tutor-documents',
          message: data.message,
          isChecking: false,
        });
      } else {
        setSupabaseStatus(prev => ({ ...prev, isChecking: false }));
      }
    } catch {
      setSupabaseStatus(prev => ({ ...prev, isChecking: false }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings(formData);
    onShowNotification('Website settings saved successfully!');
  };

  const handleDownloadBackup = () => {
    const backupJson = StorageService.exportBackupJson();
    const blob = new Blob([backupJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ranchihometutor_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    onShowNotification('Backup downloaded successfully!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      const success = StorageService.importBackupJson(content);
      if (success) {
        onShowNotification('Backup restored successfully! Refreshing data...');
        window.location.reload();
      } else {
        onShowNotification('Invalid backup JSON file. Please check format.');
      }
    };
    reader.readAsText(file);
  };

  const confirmResetDefaults = () => {
    StorageService.resetToDefaults();
    onShowNotification('Reset to defaults complete! Reloading...');
    window.location.reload();
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      <div>
        <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
          Website Configuration
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          Settings & Coordinator Controls
        </h2>
        <p className="text-xs text-slate-400">
          Update public contact channels, branding, WhatsApp numbers, and backup storage.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Branding & Texts */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Branding & Header Texts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={formData.websiteName}
                onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hero Heading
            </label>
            <input
              type="text"
              value={formData.heroHeading}
              onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Hero Subtitle / Description
            </label>
            <textarea
              rows={2}
              value={formData.heroDescription || formData.heroSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, heroDescription: e.target.value, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>
        </div>

        {/* Public Contact Channels */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Contact Numbers & Links</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp Coordinator Number
              </label>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                placeholder="7520907126"
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Receives all parent inquiry submissions</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instagram Profile Link / Username
              </label>
              <input
                type="text"
                value={formData.instagramProfile}
                onChange={(e) => setFormData({ ...formData, instagramProfile: e.target.value })}
                placeholder="ranchi_hometuition_wala"
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rahulkrg2008@gmail.com"
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                City / Office Address
              </label>
              <input
                type="text"
                value={formData.officeAddress}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                placeholder="Ranchi, Jharkhand"
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Business Rule / Fee Guidelines Reference */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <IndianRupee className="w-4 h-4" />
            <span>Coordinator Fee Reference</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block">Parent Service Fee:</span>
              <strong className="text-white text-sm">₹599</strong>
              <div className="text-[10px] text-slate-500 mt-0.5">One-time coordination charge</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block">Tutor Verification Fee:</span>
              <strong className="text-white text-sm">₹499</strong>
              <div className="text-[10px] text-slate-500 mt-0.5">Aadhaar / KYC validation</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block">Tuition Commission:</span>
              <strong className="text-emerald-400 text-sm">50%</strong>
              <div className="text-[10px] text-slate-500 mt-0.5">Of 1st month tuition fee</div>
            </div>
          </div>
        </div>

        {/* Save Settings Button */}
        <div>
          <button
            type="submit"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>

      </form>

      {/* Supabase Free Cloud Storage Configuration */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Supabase Cloud Storage (1 GB Free Forever)</span>
                {supabaseStatus.ready ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected & Bucket Ready
                  </span>
                ) : supabaseStatus.connected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-semibold">
                    Connected (Create '{supabaseStatus.bucket}' Bucket)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 text-[11px] font-semibold">
                    Local / PostgreSQL Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Store Aadhaar KYC cards, degree certificates, and photos in your personal free Supabase bucket.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={checkStorageStatus}
            disabled={supabaseStatus.isChecking}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-2xl border border-slate-700 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${supabaseStatus.isChecking ? 'animate-spin' : ''}`} />
            <span>{supabaseStatus.isChecking ? 'Checking...' : 'Check Connection'}</span>
          </button>
        </div>

        {/* Current status & details */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5 font-medium">Supabase Project URL</span>
              <span className="text-slate-200 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 inline-block text-[11px]">
                {supabaseStatus.url || 'Not configured yet (see instructions below)'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 font-medium">Storage Bucket Name</span>
              <span className="text-emerald-400 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 inline-block text-[11px]">
                {supabaseStatus.bucket}
              </span>
            </div>
          </div>

          {supabaseStatus.message && (
            <div className={`p-2.5 rounded-2xl text-xs flex items-center gap-2 ${
              supabaseStatus.ready 
                ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-200'
                : supabaseStatus.connected 
                ? 'bg-amber-950/40 border border-amber-800/40 text-amber-200'
                : 'bg-slate-900 border border-slate-800 text-slate-400'
            }`}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{supabaseStatus.message}</span>
            </div>
          )}

          {/* Quick Setup Guide */}
          <div className="pt-2 border-t border-slate-850">
            <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <span>Private Document Storage Setup (Only 2 Server Keys Needed):</span>
              <a 
                href="https://supabase.com" 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1 text-[11px] font-normal"
              >
                Open Supabase.com <ExternalLink className="w-3 h-3" />
              </a>
            </h4>
            <div className="p-2.5 rounded-2xl bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200 mb-2.5 leading-relaxed">
              <strong>100% Confidential:</strong> Tutor KYC (Aadhaar & degrees) and parent contact details are never public. All uploads are routed strictly through the backend server. You do <strong>NOT</strong> need any <code className="text-amber-300">VITE_</code> public keys or <code className="text-amber-300">SERVICE_ROLE_KEY</code>.
            </div>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-400 leading-relaxed">
              <li>
                Sign up for free at <strong className="text-slate-200">supabase.com</strong> (no card required) and create a project.
              </li>
              <li>
                In your Supabase left menu, click <strong className="text-slate-200">Storage</strong> ➔ <strong className="text-slate-200">New Bucket</strong> ➔ name it <code className="text-emerald-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">tutor-documents</code>.
              </li>
              <li>
                In Supabase, go to <strong className="text-slate-200">Project Settings</strong> ➔ <strong className="text-slate-200">API</strong>. Copy your <code className="text-sky-300">Project URL</code> and <code className="text-sky-300">anon public key</code>, and paste them into AI Studio secrets as <code className="text-amber-300">SUPABASE_URL</code> and <code className="text-amber-300">SUPABASE_ANON_KEY</code>. That's all!
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* Database Backup & Restore */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white">Database Backup & Recovery</h3>
          <p className="text-xs text-slate-400">
            Export a full JSON backup of all tutors, requirements, and reviews, or restore previous data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download JSON Backup</span>
          </button>

          <label className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Restore from JSON File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-red-800/40 cursor-pointer ml-auto transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Initial Data</span>
          </button>
        </div>
      </div>

      {/* In-App Interactive Reset Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isResetModalOpen}
        title="Reset to Initial Data"
        itemName="All Website Settings & Records"
        itemDetails="This will reset all tutor approvals, parent requirements, and website settings back to their default factory state. Make sure you export a backup first if you have active student or tutor records."
        confirmText="Yes, Reset Everything"
        onConfirm={confirmResetDefaults}
        onClose={() => setIsResetModalOpen(false)}
      />

    </div>
  );
};
