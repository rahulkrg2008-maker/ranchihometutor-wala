import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  UserCheck, 
  Plus, 
  Search, 
  Filter, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  X,
  FileCheck2,
  Users2,
  Sparkles,
  Phone,
  ArrowRight
} from 'lucide-react';
import { DemoAssignment, DemoStatus, TuitionRequirement, Tutor, WebsiteSettings } from '../../types';
import { StorageService, getWhatsAppLink, formatDemoConfirmationWhatsAppText } from '../../services/storageService';

interface DemoAssignmentsManagerProps {
  settings: WebsiteSettings;
  demos: DemoAssignment[];
  requirements: TuitionRequirement[];
  tutors: Tutor[];
  onShowNotification: (msg: string) => void;
}

export const DemoAssignmentsManager: React.FC<DemoAssignmentsManagerProps> = ({
  settings,
  demos,
  requirements,
  tutors,
  onShowNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | DemoStatus>('All');
  const [selectedDemo, setSelectedDemo] = useState<DemoAssignment | null>(null);

  // Schedule Demo Modal state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newRequirementId, setNewRequirementId] = useState('');
  const [newTutorId, setNewTutorId] = useState('');
  const [newDemoDate, setNewDemoDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDemoTime, setNewDemoTime] = useState('05:00 PM');
  const [newDemoLocation, setNewDemoLocation] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Record Feedback Modal state
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [activeFeedbackDemo, setActiveFeedbackDemo] = useState<DemoAssignment | null>(null);
  const [parentFeedback, setParentFeedback] = useState('');
  const [tutorFeedback, setTutorFeedback] = useState('');
  const [coordinatorNotes, setCoordinatorNotes] = useState('');
  const [finalDecision, setFinalDecision] = useState('');
  const [demoStatus, setDemoStatus] = useState<DemoStatus>('DEMO_COMPLETED');

  // Filtered list
  const filteredDemos = demos.filter((d) => {
    if (statusFilter !== 'All' && d.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.id.toLowerCase().includes(term) ||
      d.requirementId.toLowerCase().includes(term) ||
      d.tutorName.toLowerCase().includes(term) ||
      d.tutorId.toLowerCase().includes(term) ||
      d.studentName.toLowerCase().includes(term) ||
      d.parentName.toLowerCase().includes(term) ||
      d.phone.includes(term) ||
      d.demoLocation.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status: DemoStatus) => {
    switch (status) {
      case 'DEMO_SCHEDULED':
        return { label: 'Demo Scheduled', color: 'bg-amber-100 text-amber-900 border-amber-400' };
      case 'DEMO_COMPLETED':
        return { label: 'Demo Completed', color: 'bg-blue-100 text-blue-900 border-blue-400' };
      case 'PARENT_APPROVED':
        return { label: 'Parent Approved ✅', color: 'bg-emerald-100 text-emerald-900 border-emerald-400' };
      case 'PARENT_NOT_APPROVED':
        return { label: 'Parent Declined ❌', color: 'bg-rose-100 text-rose-900 border-rose-400' };
      case 'CHANGE_TUTOR':
        return { label: 'Change Tutor Requested', color: 'bg-orange-100 text-orange-900 border-orange-400' };
      case 'CANCELLED':
        return { label: 'Cancelled', color: 'bg-slate-100 text-slate-800 border-slate-300' };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  const handleOpenScheduleModal = () => {
    // Pre-select first unassigned or contacted requirement if available
    const candidateReq = requirements.find((r) => r.status === 'New' || r.status === 'Contacted' || r.status === 'Searching');
    if (candidateReq) {
      setNewRequirementId(candidateReq.id);
      setNewDemoLocation(candidateReq.area);
    }
    const candidateTutor = tutors.find((t) => t.status === 'Approved');
    if (candidateTutor) {
      setNewTutorId(candidateTutor.id);
    }
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const req = requirements.find((r) => r.id === newRequirementId || r.reqCode === newRequirementId);
    if (!req) {
      onShowNotification('Please select a valid Tuition Requirement.');
      return;
    }

    const tutor = tutors.find((t) => t.id === newTutorId);
    if (!tutor) {
      onShowNotification('Please select an approved tutor.');
      return;
    }

    const created = StorageService.addDemoAssignment({
      requirementId: req.id,
      tutorId: tutor.id,
      tutorName: tutor.fullName,
      studentName: req.studentName || req.parentName,
      parentName: req.parentName,
      phone: req.phone || tutor.phone,
      subjects: req.subjects,
      classes: req.classes,
      demoDate: newDemoDate,
      demoTime: newDemoTime,
      demoLocation: newDemoLocation.trim() || req.area,
      status: 'DEMO_SCHEDULED',
      coordinatorNotes: newNotes.trim() || undefined,
    });

    onShowNotification(`Demo session ${created.id} scheduled for ${req.studentName} with ${tutor.fullName}!`);
    setIsScheduleModalOpen(false);
  };

  const handleOpenFeedbackModal = (demo: DemoAssignment) => {
    setActiveFeedbackDemo(demo);
    setParentFeedback(demo.parentFeedback || '');
    setTutorFeedback(demo.tutorFeedback || '');
    setCoordinatorNotes(demo.coordinatorNotes || '');
    setFinalDecision(demo.finalDecision || '');
    setDemoStatus(demo.status === 'DEMO_SCHEDULED' ? 'DEMO_COMPLETED' : demo.status);
    setIsFeedbackModalOpen(true);
  };

  const handleSaveFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFeedbackDemo) return;

    StorageService.updateDemoAssignment(activeFeedbackDemo.id, {
      status: demoStatus,
      parentFeedback: parentFeedback.trim() || undefined,
      tutorFeedback: tutorFeedback.trim() || undefined,
      coordinatorNotes: coordinatorNotes.trim() || undefined,
      finalDecision: finalDecision.trim() || undefined,
    });

    onShowNotification(`Demo ${activeFeedbackDemo.id} updated to status "${demoStatus}".`);
    setIsFeedbackModalOpen(false);
    setActiveFeedbackDemo(null);
  };

  const handleConfirmTuition = (demo: DemoAssignment) => {
    StorageService.updateDemoAssignment(demo.id, {
      status: 'PARENT_APPROVED',
      finalDecision: 'Tuition Confirmed & Started',
    });
    // Update requirement
    StorageService.updateRequirement(demo.requirementId, {
      status: 'Tuition Started',
      assignedTutorId: demo.tutorId,
      assignedTutorName: demo.tutorName,
    });
    onShowNotification(`Tutor ${demo.tutorName} confirmed for ${demo.studentName}! Tuition is now active.`);
  };

  const handleDeleteDemo = (id: string) => {
    if (confirm(`Permanently remove demo record ${id}?`)) {
      StorageService.deleteDemoAssignment(id);
      onShowNotification(`Demo record ${id} removed.`);
      if (selectedDemo?.id === id) setSelectedDemo(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className="bg-white dark:bg-[#071A33] border border-sky-200 dark:border-sky-400 rounded-2xl p-5 shadow-md shadow-sky-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold">
              🎓
            </span>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Demo Classes & Tutor Assignment Pipeline
            </h1>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Coordinate 1-to-1 demo classes between parents and verified tutors. Track status from scheduling to parent approval and tuition start.
          </p>
        </div>

        <button
          onClick={handleOpenScheduleModal}
          className="px-4 py-2.5 bg-[#087ED1] hover:bg-[#066db5] text-white font-bold text-xs rounded-2xl shadow-md shadow-sky-900/10 border border-sky-200 flex items-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Demo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#071A33] border border-sky-200 dark:border-sky-400 rounded-2xl p-4 shadow-md shadow-sky-900/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Demo ID, Student, Tutor, Phone, or Locality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          {(['All', 'DEMO_SCHEDULED', 'DEMO_COMPLETED', 'PARENT_APPROVED', 'PARENT_NOT_APPROVED', 'CHANGE_TUTOR', 'CANCELLED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-2xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                statusFilter === st
                  ? 'bg-slate-900 text-white border-sky-200 dark:bg-sky-400 dark:text-slate-950'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-slate-500'
              }`}
            >
              {st === 'All' ? 'All Demos' : st.replace('DEMO_', '').replace('_', ' ')}
            </button>
          ))}
        </div>

      </div>

      {/* Demos Table */}
      <div className="bg-white dark:bg-[#071A33] border border-sky-200 dark:border-sky-400 rounded-2xl shadow-md shadow-sky-900/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-black border-b-2 border-sky-200 dark:border-sky-400">
              <tr>
                <th className="py-3 px-4">Demo ID & Req</th>
                <th className="py-3 px-4">Student & Parent</th>
                <th className="py-3 px-4">Assigned Tutor</th>
                <th className="py-3 px-4">Class & Subjects</th>
                <th className="py-3 px-4">Schedule & Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredDemos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No demo assignments found matching criteria. Click &quot;Schedule New Demo&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredDemos.map((demo) => {
                  const badge = getStatusBadge(demo.status);
                  return (
                    <tr 
                      key={demo.id}
                      className="hover:bg-sky-50/50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* ID & Req */}
                      <td className="py-3.5 px-4 font-mono">
                        <strong className="text-slate-900 dark:text-sky-300 text-xs block">{demo.id}</strong>
                        <span className="text-[11px] text-slate-500">Req: {demo.requirementId}</span>
                      </td>

                      {/* Student & Parent */}
                      <td className="py-3.5 px-4">
                        <strong className="text-slate-900 dark:text-white block">{demo.studentName}</strong>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{demo.parentName}</span>
                          <span>•</span>
                          <span className="font-mono">{demo.phone}</span>
                        </div>
                      </td>

                      {/* Tutor */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{demo.tutorName}</div>
                        <span className="text-[10.5px] font-mono text-amber-600 dark:text-amber-400">ID: {demo.tutorId}</span>
                      </td>

                      {/* Class & Subjects */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {demo.subjects.join(', ')}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {demo.classes.join(', ')}
                        </div>
                      </td>

                      {/* Schedule & Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#087ED1]" />
                          <span>{demo.demoDate} • {demo.demoTime}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{demo.demoLocation}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10.5px] font-black border ${badge.color}`}>
                          {badge.label}
                        </span>
                        {demo.finalDecision && (
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                            {demo.finalDecision}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Record Feedback & Decision */}
                          <button
                            onClick={() => handleOpenFeedbackModal(demo)}
                            className="p-1.5 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 cursor-pointer"
                            title="Record Demo Feedback & Decision"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Confirm Button */}
                          {demo.status !== 'PARENT_APPROVED' && (
                            <button
                              onClick={() => handleConfirmTuition(demo)}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] cursor-pointer shadow-xs"
                              title="Confirm Tutor & Start Tuition"
                            >
                              Confirm
                            </button>
                          )}

                          {/* WhatsApp Slip */}
                          <a
                            href={getWhatsAppLink(demo.phone, formatDemoConfirmationWhatsAppText(demo, settings.whatsappNumber))}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 cursor-pointer"
                            title="Send WhatsApp Demo Slip"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteDemo(demo.id)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Demo Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#071A33] border border-sky-200 dark:border-sky-400 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 relative">
            
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-[#087ED1] text-white flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Schedule Demo Class Session
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Assign verified teacher for 1-to-1 demo class at student home
                </p>
              </div>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              
              {/* Requirement Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tuition Requirement <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newRequirementId}
                  onChange={(e) => {
                    setNewRequirementId(e.target.value);
                    const matched = requirements.find((r) => r.id === e.target.value);
                    if (matched) setNewDemoLocation(matched.area);
                  }}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                >
                  <option value="">Select Requirement...</option>
                  {requirements.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.reqCode} — {r.studentName || r.parentName} ({r.classes.join(', ')} • {r.area})
                    </option>
                  ))}
                </select>
              </div>

              {/* Tutor Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Approved Tutor <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newTutorId}
                  onChange={(e) => setNewTutorId(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                >
                  <option value="">Select Tutor...</option>
                  {tutors
                    .filter((t) => t.status === 'Approved')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.id} • {t.highestQualification} • {t.teachingArea})
                      </option>
                    ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Demo Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDemoDate}
                    onChange={(e) => setNewDemoDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Demo Time
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 05:00 PM"
                    value={newDemoTime}
                    onChange={(e) => setNewDemoTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Demo Location / Address
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bariatu Road, near RIMS gate"
                  value={newDemoLocation}
                  onChange={(e) => setNewDemoLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Coordinator Instructions / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Student needs assistance in Quadratic equations, bring standard textbooks."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#087ED1] hover:bg-[#066db5] text-white font-bold text-xs rounded-2xl shadow-md shadow-sky-900/10 border border-sky-200 cursor-pointer"
                >
                  Schedule Demo Session
                </button>
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Record Feedback & Decision Modal */}
      {isFeedbackModalOpen && activeFeedbackDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#071A33] border border-sky-200 dark:border-sky-400 rounded-3xl p-6 shadow-2xl text-slate-900 dark:text-slate-100 relative">
            
            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  Demo Feedback & Coordinator Decision
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {activeFeedbackDemo.id} • {activeFeedbackDemo.studentName} with {activeFeedbackDemo.tutorName}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveFeedback} className="space-y-4">
              
              {/* Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Demo Status
                </label>
                <select
                  value={demoStatus}
                  onChange={(e) => setDemoStatus(e.target.value as DemoStatus)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                >
                  <option value="DEMO_SCHEDULED">DEMO_SCHEDULED (Awaiting Class)</option>
                  <option value="DEMO_COMPLETED">DEMO_COMPLETED (Class Done, Seeking Feedback)</option>
                  <option value="PARENT_APPROVED">PARENT_APPROVED (Tuition Confirmed ✅)</option>
                  <option value="PARENT_NOT_APPROVED">PARENT_NOT_APPROVED (Parent Not Satisfied)</option>
                  <option value="CHANGE_TUTOR">CHANGE_TUTOR (Parent Requested Different Teacher)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Parent Feedback */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Parent / Student Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Parent appreciated the teacher's patience and teaching method. Wants to start immediately."
                  value={parentFeedback}
                  onChange={(e) => setParentFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                />
              </div>

              {/* Tutor Feedback */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tutor Feedback
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Student is receptive. Identified weak fundamentals in algebra. 5 classes/week recommended."
                  value={tutorFeedback}
                  onChange={(e) => setTutorFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                />
              </div>

              {/* Coordinator Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Coordinator Follow-Up Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Parent fee discussed and confirmed. Start date agreed for next Monday."
                  value={coordinatorNotes}
                  onChange={(e) => setCoordinatorNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                />
              </div>

              {/* Final Decision */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Final Decision
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tuition Confirmed & Started (₹4,500/month)"
                  value={finalDecision}
                  onChange={(e) => setFinalDecision(e.target.value)}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-sky-900/10 border border-sky-200 cursor-pointer"
                >
                  Save Feedback & Decision
                </button>
                <button
                  type="button"
                  onClick={() => setIsFeedbackModalOpen(false)}
                  className="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl border border-slate-300 dark:border-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
