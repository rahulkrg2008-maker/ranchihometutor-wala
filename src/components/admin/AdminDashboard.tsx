import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  TrendingUp, 
  UserCheck, 
  ArrowRight, 
  Copy, 
  MessageCircle,
  Database,
  Code2,
  Check,
  Award,
  BookOpen,
  Calendar,
  AlertCircle,
  PhoneCall,
  UserPlus
} from 'lucide-react';
import { TuitionRequirement, Tutor, WebsiteSettings, DemoAssignment } from '../../types';
import { formatChannelTutorBroadcastText, getWhatsAppLink } from '../../services/storageService';

interface AdminDashboardProps {
  settings: WebsiteSettings;
  requirements: TuitionRequirement[];
  tutors: Tutor[];
  demos?: DemoAssignment[];
  onNavigateTab: (tab: string) => void;
  onShowNotification: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  settings,
  requirements,
  tutors,
  demos = [],
  onNavigateTab,
  onShowNotification,
}) => {
  const [showSqlCommands, setShowSqlCommands] = useState(false);
  const [copiedSqlIdx, setCopiedSqlIdx] = useState<number | null>(null);

  // Today's Date String YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Specific dashboard card counters requested by Section 11:
  // 1. New Requirements
  const newRequirementsCount = requirements.filter((r) => r.status === 'New').length;
  // 2. Requirements Being Contacted
  const beingContactedCount = requirements.filter((r) => r.status === 'Contacted').length;
  // 3. Tutors Pending Verification
  const tutorsPendingVerificationCount = tutors.filter((t) => t.status === 'Pending' || t.status === 'REGISTRATION_RECEIVED' || !t.aadhaarVerified).length;
  // 4. Demos Scheduled
  const demosScheduledCount = demos.filter((d) => d.status === 'DEMO_SCHEDULED').length;
  // 5. Demos Today
  const demosToday = demos.filter((d) => d.demoDate === todayStr && d.status === 'DEMO_SCHEDULED');
  const demosTodayCount = demosToday.length;
  // 6. Active Tuitions
  const activeTuitionsCount = requirements.filter((r) => r.status === 'Tuition Started').length;
  // 7. Completed Tuitions
  const completedTuitionsCount = requirements.filter((r) => r.status === 'Completed' || r.status === 'Filled').length;

  // Additional stats
  const totalRegisteredTutors = tutors.length;
  const verifiedTutors = tutors.filter((t) => t.status === 'Approved' || t.status === 'VERIFIED' || t.aadhaarVerified).length;
  const totalRequirements = requirements.length;

  // "Today's Actions" items
  const parentFollowUps = requirements.filter((r) => r.status === 'Contacted' || (r.status === 'New' && r.createdAt.startsWith(todayStr)));
  const pendingVerificationTutorsList = tutors.filter((t) => !t.aadhaarVerified || t.status === 'Pending').slice(0, 4);
  const newRequirementsList = requirements.filter((r) => r.status === 'New').slice(0, 4);
  const tutorAssignmentsNeeded = requirements.filter((r) => r.status === 'Searching' || r.status === 'Contacted').slice(0, 4);

  // Recent lists for dashboard display
  const recentTutors = [...tutors].sort((a, b) => (b.registeredAt || '').localeCompare(a.registeredAt || '')).slice(0, 4);
  const recentReqs = [...requirements].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 4);

  const handleCopyChannelBroadcast = (req: TuitionRequirement) => {
    const text = formatChannelTutorBroadcastText(req, settings.whatsappNumber);
    navigator.clipboard.writeText(text);
    onShowNotification(`Copied broadcast for ${req.reqCode}! Ready to paste into Tutor WhatsApp Channel.`);
  };

  const copySqlText = (sql: string, idx: number) => {
    navigator.clipboard.writeText(sql);
    setCopiedSqlIdx(idx);
    onShowNotification('Copied SQL command to clipboard!');
    setTimeout(() => setCopiedSqlIdx(null), 2500);
  };

  // Structured operational cards list
  const operationalCards = [
    {
      title: 'New Requirements',
      count: newRequirementsCount,
      subtext: 'Fresh inquiries awaiting contact',
      bgClass: 'bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-500 text-amber-900 dark:text-amber-300',
      icon: AlertCircle,
      tab: 'requirements',
    },
    {
      title: 'Being Contacted',
      count: beingContactedCount,
      subtext: 'In discussion with parents',
      bgClass: 'bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-500 text-sky-900 dark:text-sky-300',
      icon: PhoneCall,
      tab: 'requirements',
    },
    {
      title: 'Pending Verification',
      count: tutorsPendingVerificationCount,
      subtext: 'Tutors awaiting Aadhaar/doc check',
      bgClass: 'bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-500 text-purple-900 dark:text-purple-300',
      icon: UserCheck,
      tab: 'tutors',
    },
    {
      title: 'Demos Scheduled',
      count: demosScheduledCount,
      subtext: 'Upcoming trials planned',
      bgClass: 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 dark:border-blue-500 text-blue-900 dark:text-blue-300',
      icon: Calendar,
      tab: 'demos',
    },
    {
      title: 'Demos Today',
      count: demosTodayCount,
      subtext: `Trials scheduled for ${todayStr}`,
      bgClass: 'bg-orange-50 dark:bg-orange-950/40 border-orange-400 dark:border-orange-500 text-orange-900 dark:text-orange-300',
      icon: Clock,
      tab: 'demos',
      highlight: demosTodayCount > 0,
    },
    {
      title: 'Active Tuitions',
      count: activeTuitionsCount,
      subtext: 'Regular ongoing classes',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500 text-emerald-900 dark:text-emerald-300',
      icon: CheckCircle2,
      tab: 'requirements',
    },
    {
      title: 'Completed Tuitions',
      count: completedTuitionsCount,
      subtext: 'Successfully delivered & closed',
      bgClass: 'bg-slate-100 dark:bg-slate-800 border-slate-400 dark:border-slate-600 text-slate-800 dark:text-slate-200',
      icon: Award,
      tab: 'requirements',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#071A33] border border-sky-200 dark:border-sky-400 text-slate-900 dark:text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md shadow-sky-900/10 dark:shadow-[6px_6px_0px_#38bdf8]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 border-1.5 border-sky-200 dark:border-sky-400 text-slate-900 dark:text-sky-300 text-xs font-bold mb-2 shadow-[1.5px_1.5px_0px_#0f172a] dark:shadow-[1.5px_1.5px_0px_#38bdf8]">
            <Sparkles className="w-3.5 h-3.5 text-[#087ED1]" />
            <span>Ranchi HomeTutor Wala • Operations & Coordination Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Dashboard & Action Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Manage tuition inquiries, schedule trial demos with verified educators, and monitor ongoing home tuitions in Ranchi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('demos')}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-2xl border border-sky-200 shadow-md shadow-sky-900/10 transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Demos ({demosScheduledCount})</span>
          </button>

          <button
            onClick={() => onNavigateTab('requirements')}
            className="px-4 py-2.5 bg-[#087ED1] hover:bg-[#066bb3] text-white font-extrabold text-xs rounded-2xl border border-sky-200 shadow-md shadow-sky-900/10 transition-all flex items-center gap-1.5 cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
          >
            <FileText className="w-4 h-4" />
            <span>Requirements ({newRequirementsCount} New)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7 OPERATION CARDS (SECTION 11) */}
      {/* New Requirements, Being Contacted, Tutors Pending Verification, */}
      {/* Demos Scheduled, Demos Today, Active Tuitions, Completed Tuitions */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#087ED1]" />
            <span>Operational Status Overview</span>
          </h2>
          <span className="text-xs text-slate-500 font-semibold">Real-time Supabase State</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {operationalCards.map((card, idx) => {
            const IconC = card.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateTab(card.tab)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-0.5 shadow-md shadow-sky-900/10 dark:shadow-[3px_3px_0px_#38bdf8] ${card.bgClass} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-tight opacity-90 line-clamp-1">{card.title}</span>
                  <IconC className="w-4 h-4 shrink-0 opacity-80" />
                </div>
                <div className="my-2">
                  <span className="text-2xl sm:text-3xl font-black">{card.count}</span>
                </div>
                <div className="text-[10px] opacity-75 line-clamp-1 font-medium">
                  {card.subtext}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* "TODAY'S ACTIONS" SECTION (SECTION 11) */}
      {/* Demos today, Parent follow-ups, Tutor verification pending, New requirements, Tutor assignments */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#071A33] rounded-3xl border border-sky-200 dark:border-sky-400 p-6 sm:p-7 shadow-md shadow-sky-900/10 dark:shadow-[6px_6px_0px_#38bdf8] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 border-sky-200/20 dark:border-sky-400/20">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Priority Daily Checklist</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              Today's Actions
            </h2>
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Action items requiring coordinator intervention
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Action 1: Demos Today */}
          <div className="p-4 rounded-2xl bg-[#e8f1fa]/70 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#087ED1]" />
                  <span>1. Demos Today</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-900 border border-orange-300">
                  {demosTodayCount} Scheduled
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {demosTodayCount === 0 
                  ? 'No trial demos scheduled for today. Check upcoming dates.' 
                  : `${demosTodayCount} trial demo(s) taking place today in Ranchi. Follow up with parents & tutors after class.`}
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('demos')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-sky-50 text-slate-900 dark:text-white text-xs font-bold rounded-2xl border border-sky-200 dark:border-sky-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-900/10"
            >
              <span>View Demos Schedule</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 2: Parent Follow-ups */}
          <div className="p-4 rounded-2xl bg-[#e8f1fa]/70 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                  <span>2. Parent Follow-ups</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-900 border border-sky-300">
                  {parentFollowUps.length} Pending
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Requirements currently in contact status or needing timing/budget confirmation with parents.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('requirements')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-sky-50 text-slate-900 dark:text-white text-xs font-bold rounded-2xl border border-sky-200 dark:border-sky-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-900/10"
            >
              <span>Follow up with Parents</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 3: Tutor Verification Pending */}
          <div className="p-4 rounded-2xl bg-[#e8f1fa]/70 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-600" />
                  <span>3. Tutor Verification Pending</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-300">
                  {tutorsPendingVerificationCount} Unverified
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Verify identity, qualification, and Aadhaar documents before assigning educators to student families.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('tutors')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-sky-50 text-slate-900 dark:text-white text-xs font-bold rounded-2xl border border-sky-200 dark:border-sky-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-900/10"
            >
              <span>Verify Tutors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 4: New Requirements */}
          <div className="p-4 rounded-2xl bg-[#e8f1fa]/70 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>4. New Requirements</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                  {newRequirementsCount} Unopened
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                New tuition inquiries submitted via website form. Call parent to confirm subjects, timing, and address.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('requirements')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-sky-50 text-slate-900 dark:text-white text-xs font-bold rounded-2xl border border-sky-200 dark:border-sky-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-900/10"
            >
              <span>Process Inquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action 5: Tutor Assignments */}
          <div className="p-4 rounded-2xl bg-[#e8f1fa]/70 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>5. Tutor Assignments</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  {tutorAssignmentsNeeded.length} In Search
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                Requirements ready for teacher assignment. Post to WhatsApp tutor group or pick a matching registered tutor.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('requirements')}
              className="w-full py-2 bg-white dark:bg-slate-800 hover:bg-sky-50 text-slate-900 dark:text-white text-xs font-bold rounded-2xl border border-sky-200 dark:border-sky-400 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-sky-900/10"
            >
              <span>Match & Assign Tutor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Two Column Layout: Recent Requirements & Registered Tutors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Tuition Requirements */}
        <div className="bg-white dark:bg-[#071A33] rounded-3xl border border-sky-200 dark:border-sky-400 p-6 shadow-md shadow-sky-900/10 dark:shadow-[6px_6px_0px_#38bdf8] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-sky-200/10 dark:border-sky-400/20">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#087ED1]" />
                <span>Recent Tuition Inquiries</span>
              </h3>
              <p className="text-xs text-slate-500">Latest parent & student requirements in Ranchi</p>
            </div>
            <button
              onClick={() => onNavigateTab('requirements')}
              className="text-xs font-black text-[#087ED1] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({requirements.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentReqs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No inquiries recorded yet. New requests from the form will appear here.
              </div>
            ) : (
              recentReqs.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#e8f1fa]/60 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 dark:shadow-[2px_2px_0px_#38bdf8] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-1.5 border-sky-200 dark:border-sky-400">
                        {req.reqCode || req.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{req.studentName} ({req.classes.join(', ')})</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      req.status === 'New' 
                        ? 'bg-amber-100 text-amber-800 border-amber-300' 
                        : req.status === 'Tuition Started'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-sky-100 text-sky-800 border-sky-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>📍 {req.area}</span>
                    <span className="font-semibold text-slate-900 dark:text-sky-300">₹{req.budget || 'Negotiable'}</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-sky-200/10 dark:border-sky-400/20">
                    <span>Subjects: {req.subjects.join(', ')}</span>
                    <button
                      onClick={() => handleCopyChannelBroadcast(req)}
                      className="inline-flex items-center gap-1 text-[#087ED1] hover:underline font-bold cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy for Group</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Registered Tutors */}
        <div className="bg-white dark:bg-[#071A33] rounded-3xl border border-sky-200 dark:border-sky-400 p-6 shadow-md shadow-sky-900/10 dark:shadow-[6px_6px_0px_#38bdf8] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-sky-200/10 dark:border-sky-400/20">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#087ED1]" />
                <span>Recently Registered Tutors</span>
              </h3>
              <p className="text-xs text-slate-500">Teachers awaiting coordinator review</p>
            </div>
            <button
              onClick={() => onNavigateTab('tutors')}
              className="text-xs font-black text-[#087ED1] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({tutors.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTutors.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No tutors registered yet. New teacher applications will appear here.
              </div>
            ) : (
              recentTutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="p-4 rounded-2xl bg-[#e8f1fa]/60 dark:bg-slate-900/80 border border-sky-200 dark:border-sky-400 shadow-md shadow-sky-900/10 dark:shadow-[2px_2px_0px_#38bdf8] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-1.5 border-sky-200 dark:border-sky-400">
                        {tutor.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{tutor.fullName}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      tutor.status === 'Approved' || tutor.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : tutor.status === 'Pending' || tutor.status === 'REGISTRATION_RECEIVED'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-red-100 text-red-800 border-red-300'
                    }`}>
                      {tutor.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300">
                    <span>{tutor.highestQualification}</span>
                    {tutor.college && <span className="text-slate-500"> ({tutor.college})</span>}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 pt-2 border-t border-sky-200/10 dark:border-sky-400/20">
                    <span>📚 {tutor.subjects.slice(0, 3).join(', ')}</span>
                    <a
                      href={getWhatsAppLink(tutor.phone, `Hello ${tutor.fullName}, message from Ranchi HomeTutor Wala coordinator regarding tuition opportunities.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 hover:underline font-bold"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Tutor</span>
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
