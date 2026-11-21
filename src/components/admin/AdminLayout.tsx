import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Globe, 
  ShieldCheck, 
  Settings,
  BookOpen,
  Calendar
} from 'lucide-react';
import { WebsiteSettings, TuitionRequirement, Tutor, Review, ServiceItem, DemoAssignment } from '../../types';
import { AdminDashboard } from './AdminDashboard';
import { TutorsManager } from './TutorsManager';
import { RequirementsManager } from './RequirementsManager';
import { DemoAssignmentsManager } from './DemoAssignmentsManager';
import { ReviewsManager } from './ReviewsManager';
import { ServicesManager } from './ServicesManager';
import { AdminSettings } from './AdminSettings';
import { LOGO_IMG } from '../../assets/images';

interface AdminLayoutProps {
  settings: WebsiteSettings;
  requirements: TuitionRequirement[];
  tutors: Tutor[];
  demos?: DemoAssignment[];
  reviews: Review[];
  services: ServiceItem[];
  onLogout: () => void;
  onExitToPublic: () => void;
  onShowNotification: (msg: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  settings,
  requirements,
  tutors,
  demos = [],
  reviews,
  services,
  onLogout,
  onExitToPublic,
  onShowNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requirements' | 'demos' | 'tutors' | 'reviews' | 'services' | 'settings'>('dashboard');

  const pendingTutorsCount = tutors.filter((t) => t.status === 'Pending').length;
  const newReqsCount = requirements.filter((r) => r.status === 'New').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'Pending').length;
  const scheduledDemosCount = demos.filter((d) => d.status === 'DEMO_SCHEDULED').length;

  interface NavItem {
    id: 'dashboard' | 'requirements' | 'demos' | 'tutors' | 'reviews' | 'services' | 'settings';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requirements', label: 'Requirements', icon: FileText, badge: newReqsCount },
    { id: 'demos', label: 'Demo Classes', icon: Calendar, badge: scheduledDemosCount },
    { id: 'tutors', label: 'Tutors Database', icon: Users, badge: pendingTutorsCount },
    { id: 'reviews', label: 'Parent Reviews', icon: MessageSquare, badge: pendingReviewsCount },
    { id: 'services', label: 'Services', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#bfe2fb] via-[#dbeffd] to-[#c3e5fc] dark:from-[#07182e] dark:via-[#07182e] dark:to-[#07182e] text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      
      {/* Top Coordinator Navbar */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0B4A94] to-[#087ED1] px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-lg shadow-sky-900/25">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-sky-200 dark:border-sky-400 flex items-center justify-center p-1 shadow-md shadow-sky-900/10 overflow-hidden">
            <img
              src={LOGO_IMG}
              alt="Ranchi HomeTutor Wala Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base text-white tracking-tight">
                Ranchi HomeTutor Wala <span className="text-sky-200">Control Center</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border-1.5 border-sky-200 shadow-md shadow-sky-900/10">
                Live Admin
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black border-1.5 border-sky-200 shadow-md shadow-sky-900/10" title="Supabase Database & Storage Active">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Supabase
              </span>
            </div>
            <p className="text-[11px] text-sky-100">
              Coordinator: <code className="text-white font-bold">rahulkrg2008@gmail.com</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onExitToPublic}
            className="px-3.5 py-2 bg-white dark:bg-slate-800 hover:bg-sky-50 text-slate-900 dark:text-sky-300 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 dark:shadow-[2px_2px_0px_#38bdf8] active:translate-x-0.5 active:translate-y-0.5"
            title="View Live Public Website"
          >
            <Globe className="w-3.5 h-3.5 text-[#087ED1]" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-2xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border border-sky-200 shadow-md shadow-sky-900/10 active:translate-x-0.5 active:translate-y-0.5"
            title="Log Out of Admin Panel"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-gradient-to-b from-[#0B4A94] to-[#052A5C] text-white md:rounded-tr-[28px] md:rounded-br-[28px] md:my-3 shadow-xl shadow-sky-900/30 p-4 space-y-2 shrink-0">
          <div className="text-[11px] font-black text-sky-200 uppercase tracking-wider px-3 mb-2">
            Operations Management
          </div>

          <div className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30 shadow-lg shadow-black/10'
                      : 'border-transparent text-sky-100 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-200'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      isActive 
                        ? 'bg-white text-[#052A5C] border-white' 
                        : 'bg-amber-100 text-amber-900 border-amber-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick status card in sidebar */}
          <div className="hidden md:block pt-6 border-t border-white/20 mt-6 text-xs text-sky-100 space-y-2">
            <div className="font-black text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Coordinator Guide</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Broadcast inquiries to your private Tutor WhatsApp group with 1-click formatted templates.
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl">
          {activeTab === 'dashboard' && (
            <AdminDashboard
              settings={settings}
              requirements={requirements}
              tutors={tutors}
              demos={demos}
              onNavigateTab={(tab: string) => setActiveTab(tab as any)}
              onShowNotification={onShowNotification}
            />
          )}

          {activeTab === 'requirements' && (
            <RequirementsManager
              settings={settings}
              requirements={requirements}
              tutors={tutors}
              onShowNotification={onShowNotification}
            />
          )}

          {activeTab === 'demos' && (
            <DemoAssignmentsManager
              settings={settings}
              demos={demos}
              requirements={requirements}
              tutors={tutors}
              onShowNotification={onShowNotification}
            />
          )}

          {activeTab === 'tutors' && (
            <TutorsManager
              tutors={tutors}
              requirements={requirements}
              onShowNotification={onShowNotification}
            />
          )}

          {activeTab === 'reviews' && (
            <ReviewsManager
              reviews={reviews}
              onShowNotification={onShowNotification}
            />
          )}

          {activeTab === 'services' && (
            <ServicesManager
              services={services}
              onShowNotification={onShowNotification}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettings
              settings={settings}
              onShowNotification={onShowNotification}
            />
          )}
        </main>

      </div>

    </div>
  );
};
