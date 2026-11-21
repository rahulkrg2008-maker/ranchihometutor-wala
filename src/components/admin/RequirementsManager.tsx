import { SecureDocument } from './SecureDocument';
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  UserCheck, 
  MessageCircle, 
  Copy, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  AlertCircle,
  X,
  Plus,
  Download
} from 'lucide-react';
import { TuitionRequirement, RequirementStatus, Tutor, WebsiteSettings } from '../../types';
import { StorageService, formatChannelTutorBroadcastText, getWhatsAppLink, formatPreferredTimingText } from '../../services/storageService';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface RequirementsManagerProps {
  settings: WebsiteSettings;
  requirements: TuitionRequirement[];
  tutors: Tutor[];
  onShowNotification: (msg: string) => void;
}

export const RequirementsManager: React.FC<RequirementsManagerProps> = ({
  settings,
  requirements,
  tutors,
  onShowNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RequirementStatus>('All');
  const [selectedReq, setSelectedReq] = useState<TuitionRequirement | null>(null);
  const [assignTutorId, setAssignTutorId] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string; parentName: string } | null>(null);

  // Status List for filtering & updates
  const allStatuses: RequirementStatus[] = [
    'New',
    'Contacted',
    'Searching',
    'Tutor Assigned',
    'Demo Scheduled',
    'Filled',
    'Tuition Started',
    'Completed',
    'Cancelled',
    'On Hold',
    'No Tutor Available',
  ];

  // Approved tutors available for assignment
  const approvedTutors = tutors.filter((t) => t.status === 'Approved' && !t.isHidden);

  // Filtered list
  const filteredReqs = requirements.filter((req) => {
    if (statusFilter !== 'All' && req.status !== statusFilter) {
      return false;
    }
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      req.reqCode.toLowerCase().includes(term) ||
      (req.parentName && req.parentName.toLowerCase().includes(term)) ||
      (req.phone && req.phone.includes(term)) ||
      req.area.toLowerCase().includes(term) ||
      (req.assignedTutorId && req.assignedTutorId.toLowerCase().includes(term)) ||
      (req.assignedTutorName && req.assignedTutorName.toLowerCase().includes(term)) ||
      req.classes.some((c) => c.toLowerCase().includes(term)) ||
      req.subjects.some((s) => s.toLowerCase().includes(term))
    );
  });

  const handleUpdateStatus = (id: string, newStatus: RequirementStatus) => {
    StorageService.updateRequirement(id, { status: newStatus });
    onShowNotification(`Requirement status updated to "${newStatus}".`);
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq({ ...selectedReq, status: newStatus });
    }
  };

  const handleAssignTutor = (reqId: string) => {
    const trimmedId = assignTutorId.trim();
    if (!trimmedId) {
      onShowNotification('Please enter or select an Assigned Teacher ID.');
      return;
    }

    const matchedTutor = tutors.find((t) => t.id.toLowerCase() === trimmedId.toLowerCase());
    const teacherName = matchedTutor ? matchedTutor.fullName : `Teacher (${trimmedId})`;
    const resolvedTutorId = matchedTutor ? matchedTutor.id : trimmedId;

    StorageService.updateRequirement(reqId, {
      assignedTutorId: resolvedTutorId,
      assignedTutorName: teacherName,
      status: 'Tutor Assigned',
      adminNotes: adminNotes.trim() ? adminNotes.trim() : `Assigned Teacher ID ${resolvedTutorId} (${teacherName}) by Coordinator`,
    });

    onShowNotification(`Assigned Teacher ID ${resolvedTutorId} (${teacherName}) to requirement! Status set to "Tutor Assigned".`);
    setSelectedReq(null);
    setAssignTutorId('');
  };

  const handleUnassignTutor = (reqId: string) => {
    StorageService.updateRequirement(reqId, {
      assignedTutorId: undefined,
      assignedTutorName: undefined,
    });
    onShowNotification(`Teacher unassigned from requirement.`);
    setSelectedReq(null);
    setAssignTutorId('');
  };

  const handleScheduleDemoDirect = (req: TuitionRequirement) => {
    const trimmedId = assignTutorId.trim() || req.assignedTutorId;
    if (!trimmedId) {
      onShowNotification('Please select or enter a tutor ID first to schedule a demo.');
      return;
    }
    const matchedTutor = tutors.find((t) => t.id.toLowerCase() === trimmedId.toLowerCase());
    const teacherName = matchedTutor ? matchedTutor.fullName : (req.assignedTutorName || `Teacher (${trimmedId})`);
    const resolvedTutorId = matchedTutor ? matchedTutor.id : trimmedId;

    StorageService.addDemoAssignment({
      requirementId: req.id,
      tutorId: resolvedTutorId,
      tutorName: teacherName,
      studentName: req.studentName || req.parentName,
      parentName: req.parentName,
      phone: req.phone || '',
      subjects: req.subjects,
      classes: req.classes,
      demoDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      demoTime: req.timeFrom || '05:00 PM',
      demoLocation: req.area,
      status: 'DEMO_SCHEDULED',
      coordinatorNotes: adminNotes.trim() || `Demo scheduled by coordinator with ${teacherName}`,
    });

    StorageService.updateRequirement(req.id, {
      assignedTutorId: resolvedTutorId,
      assignedTutorName: teacherName,
      status: 'Demo Scheduled',
      adminNotes: adminNotes.trim() ? adminNotes.trim() : `Assigned ${teacherName} & Demo Scheduled`,
    });

    onShowNotification(`Scheduled demo for ${req.studentName} with ${teacherName}! Check the "Demo Classes" tab.`);
    setSelectedReq(null);
    setAssignTutorId('');
  };

  const handleSaveNotes = (reqId: string) => {
    StorageService.updateRequirement(reqId, { adminNotes: adminNotes.trim() });
    onShowNotification('Coordinator notes updated.');
    if (selectedReq && selectedReq.id === reqId) {
      setSelectedReq({ ...selectedReq, adminNotes: adminNotes.trim() });
    }
  };

  const handleCopyChannelBroadcast = (req: TuitionRequirement) => {
    const broadcastText = formatChannelTutorBroadcastText(req, settings.whatsappNumber);
    navigator.clipboard.writeText(broadcastText);
    onShowNotification(`Copied broadcast text for ${req.reqCode}! Ready to paste into Tutor WhatsApp Channel.`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { id, code } = deleteTarget;
    StorageService.deleteRequirement(id);
    onShowNotification(`Requirement ${code} permanently deleted.`);
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq(null);
    }
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    if (requirements.length === 0) {
      onShowNotification('No tuition requirements to export.');
      return;
    }
    const headers = [
      'Req Code',
      'Student Name',
      'Classes / Grades',
      'Subjects',
      'Area / Locality',
      'Monthly Budget',
      'Tutor Gender Pref',
      'Days per Week',
      'Preferred Timing',
      'Status',
      'Assigned Tutor Name',
      'Assigned Tutor ID',
      'Created Date'
    ];

    const rows = requirements.map(r => [
      `"${r.reqCode || ''}"`,
      `"${(r.studentName || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(r.classes) ? r.classes.join(', ') : r.classes || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(r.subjects) ? r.subjects.join(', ') : r.subjects || '').replace(/"/g, '""')}"`,
      `"${(r.area || '').replace(/"/g, '""')}"`,
      `"${(r.budget || '').replace(/"/g, '""')}"`,
      `"${r.preferredTutor || ''}"`,
      `"${r.classesPerWeek || ''}"`,
      `"${r.timeFrom || ''} - ${r.timeTo || ''}"`,
      `"${r.status || ''}"`,
      `"${(r.assignedTutorName || '').replace(/"/g, '""')}"`,
      `"${r.assignedTutorId || ''}"`,
      `"${r.createdAt || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ranchi_tuition_requirements_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowNotification(`Exported ${requirements.length} tuition requirements to CSV (Excel) successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Requirement Coordination Desk
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Tuition Requirements ({requirements.length} Total)
          </h2>
          <p className="text-xs text-slate-400">
            Incoming parent requests, tutor channel broadcasting, and manual educator assignment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:text-white shrink-0"
            title="Export all requirements to Excel / CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export CSV (Excel)</span>
          </button>

          {/* Quick Broadcast Notice */}
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-300 max-w-xs hidden sm:block">
            <span className="text-amber-400 font-bold">1-Click Broadcast:</span> Use <strong className="text-white">"Copy Broadcast"</strong> to post safely to WhatsApp channel.
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Code (HW01), parent name, phone, area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="text-xs text-slate-400">
            Showing <strong className="text-white">{filteredReqs.length}</strong> of {requirements.length} inquiries
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setStatusFilter('All')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
              statusFilter === 'All'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Statuses
          </button>
          {allStatuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requirements Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Parent & Contact</th>
                <th className="py-3.5 px-4">Class & Subjects</th>
                <th className="py-3.5 px-4">Area & Timing</th>
                <th className="py-3.5 px-4">Budget / Tutor Pref</th>
                <th className="py-3.5 px-4">Assigned Teacher ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredReqs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No requirements found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredReqs.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Code */}
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {req.reqCode}
                    </td>

                    {/* Parent & Contact */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{req.parentName || 'Parent / Student'}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        {req.phone ? (
                          <>
                            <span>{req.phone}</span>
                            <a
                              href={getWhatsAppLink(req.phone, `Hello ${req.parentName || 'Parent'}, message from RanchiHomeTutor Wala regarding your tuition requirement ${req.reqCode}.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-400 hover:underline font-medium flex items-center gap-0.5"
                              title="WhatsApp Parent"
                            >
                              <MessageCircle className="w-3 h-3" />
                              Chat
                            </a>
                          </>
                        ) : (
                          <span className="text-slate-500 italic">Direct Form Submission</span>
                        )}
                      </div>
                    </td>

                    {/* Class & Subjects */}
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{req.classes.join(', ')}</div>
                      <div className="text-[11px] text-slate-400">
                        {req.subjects.join(', ')}
                      </div>
                    </td>

                    {/* Area & Timing */}
                    <td className="py-3 px-4">
                      <div className="text-slate-200">📍 {req.area}</div>
                      <div className="text-[11px] text-slate-400">
                        {req.classesPerWeek} days/wk • {formatPreferredTimingText(req.timeFrom, req.timeTo)}
                      </div>
                    </td>

                    {/* Budget / Pref */}
                    <td className="py-3 px-4">
                      <div className="text-emerald-400 font-medium">{req.budget}</div>
                      <div className="text-[10px] text-slate-400">
                        Pref: {req.preferredTutor}
                      </div>
                    </td>

                    {/* Assigned Teacher ID */}
                    <td className="py-3 px-4">
                      {req.assignedTutorId ? (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40">
                            <span className="font-mono font-bold text-xs text-amber-400">{req.assignedTutorId}</span>
                          </div>
                          {req.assignedTutorName && (
                            <div className="font-semibold text-white text-[11px] truncate max-w-[140px]" title={req.assignedTutorName}>
                              {req.assignedTutorName}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setSelectedReq(req);
                              setAssignTutorId(req.assignedTutorId || '');
                              setAdminNotes(req.adminNotes || '');
                            }}
                            className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-0.5 cursor-pointer underline"
                          >
                            <Edit3 className="w-2.5 h-2.5" /> Edit ID
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedReq(req);
                            setAssignTutorId('');
                            setAdminNotes(req.adminNotes || '');
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 text-[11px] font-medium transition-colors border border-dashed border-slate-700 flex items-center gap-1 cursor-pointer"
                          title="Fill Assigned Teacher ID"
                        >
                          <Plus className="w-3 h-3 text-amber-400" />
                          <span>Fill Teacher ID</span>
                        </button>
                      )}
                    </td>

                    {/* Status dropdown */}
                    <td className="py-3 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => handleUpdateStatus(req.id, e.target.value as RequirementStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border bg-slate-950 focus:outline-none cursor-pointer ${
                          req.status === 'New'
                            ? 'text-sky-400 border-sky-500/50'
                            : req.status === 'Tutor Assigned'
                            ? 'text-indigo-400 border-indigo-500/50'
                            : req.status === 'Tuition Started' || req.status === 'Filled'
                            ? 'text-emerald-400 border-emerald-500/50'
                            : req.status === 'Cancelled'
                            ? 'text-red-400 border-red-500/50'
                            : 'text-amber-400 border-amber-500/50'
                        }`}
                      >
                        {allStatuses.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* 1-Click Copy for Tutor WhatsApp Channel */}
                        <button
                          onClick={() => handleCopyChannelBroadcast(req)}
                          className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-slate-950 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all border border-amber-400/30"
                          title="Copy message formatted for Tutor WhatsApp Broadcast Channel"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Channel Post</span>
                        </button>

                        {/* Assign Tutor / View Details */}
                        <button
                          onClick={() => {
                            setSelectedReq(req);
                            setAssignTutorId(req.assignedTutorId || '');
                            setAdminNotes(req.adminNotes || '');
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                          title="Assign Tutor & Manage Notes"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget({ id: req.id, code: req.reqCode, parentName: req.parentName || 'Requirement' })}
                          className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                          title="Delete Requirement"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Tutor & Details Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-5 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  Form: {selectedReq.reqCode}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Tuition Assignment Desk
                </h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Requirement Summary */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Parent:</span>
                <strong className="text-white">{selectedReq.parentName} ({selectedReq.phone})</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Class & Subjects:</span>
                <span className="text-white">{selectedReq.classes.join(', ')} • {selectedReq.subjects.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Locality:</span>
                <span className="text-white font-medium">{selectedReq.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Preferred Time:</span>
                <span className="text-amber-300 font-semibold">{formatPreferredTimingText(selectedReq.timeFrom, selectedReq.timeTo)} ({selectedReq.classesPerWeek} days/wk)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Budget:</span>
                <span className="text-emerald-400 font-bold">{selectedReq.budget}</span>
              </div>
              {selectedReq.additionalRequirements && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                  <strong>Notes:</strong> {selectedReq.additionalRequirements}
                </div>
              )}
              {selectedReq.documentPhoto && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="block text-xs font-semibold text-slate-400 mb-1">Attached Requirement Document / Photo:</span>
                  <SecureDocument src={selectedReq.documentPhoto} alt="Requirement document" variant="link" label="View Student Requirement Document" />
                </div>
              )}
            </div>

            {/* Assigned Teacher ID Input & Selector */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <span>Assigned Teacher ID</span>
                </label>
                {selectedReq.assignedTutorId && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Currently: {selectedReq.assignedTutorId}
                  </span>
                )}
              </div>

              {/* Direct Fill Input for Teacher ID */}
              <div>
                <label className="block text-[11px] text-slate-300 mb-1 font-medium">
                  Enter / Fill Teacher ID:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. RHT-0001"
                    value={assignTutorId}
                    onChange={(e) => setAssignTutorId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                  {assignTutorId && (
                    <button
                      type="button"
                      onClick={() => setAssignTutorId('')}
                      className="px-2.5 py-1 text-slate-400 hover:text-white bg-slate-800 rounded-lg text-xs"
                      title="Clear field"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Dropdown Selector for Approved Tutors */}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Or select from Approved Registered Tutors:
                </label>
                <select
                  value={approvedTutors.some(t => t.id.toLowerCase() === assignTutorId.toLowerCase()) ? approvedTutors.find(t => t.id.toLowerCase() === assignTutorId.toLowerCase())?.id : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      setAssignTutorId(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="">-- Choose from Approved Tutors --</option>
                  {approvedTutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.fullName} ({tutor.id}) — {tutor.highestQualification}, {tutor.teachingArea}
                    </option>
                  ))}
                </select>
              </div>

              {/* Auto-detected Tutor Profile Badge */}
              {(() => {
                const matched = tutors.find(t => t.id.toLowerCase() === assignTutorId.trim().toLowerCase());
                if (!matched) return null;
                return (
                  <div className="p-2.5 rounded-2xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{matched.fullName} <span className="font-mono text-amber-400">({matched.id})</span></div>
                      <div className="text-[10px] text-slate-400">{matched.highestQualification} • 📍 {matched.teachingArea}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {matched.status}
                    </span>
                  </div>
                );
              })()}

              <p className="text-[11px] text-slate-500">
                Only Admin can assign or change teacher IDs. This automatically links with the tutor database.
              </p>
            </div>

            {/* Coordinator Internal Notes */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Coordinator Internal Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Called parent on 18th; agreed for demo on Friday 5 PM with Tutor Rajesh."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveNotes(selectedReq.id)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-2xl cursor-pointer"
                >
                  Save Notes
                </button>
                {selectedReq.assignedTutorId && (
                  <button
                    type="button"
                    onClick={() => handleUnassignTutor(selectedReq.id)}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium rounded-2xl cursor-pointer"
                  >
                    Unassign Teacher
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScheduleDemoDirect(selectedReq)}
                  disabled={!assignTutorId.trim() && !selectedReq.assignedTutorId}
                  className="px-3.5 py-2 bg-[#087ED1] hover:bg-[#066db5] disabled:opacity-50 text-white font-bold text-xs rounded-2xl shadow-md cursor-pointer flex items-center gap-1.5"
                  title="Assign teacher & schedule 1-to-1 demo class"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAssignTutor(selectedReq.id)}
                  disabled={!assignTutorId.trim()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-2xl shadow-md cursor-pointer"
                >
                  Assign Teacher
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* In-App Interactive Delete Confirmation Modal (Bypasses browser iframe dialog restrictions) */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Tuition Requirement"
        itemName={deleteTarget ? `${deleteTarget.code} (${deleteTarget.parentName})` : ''}
        itemDetails="This requirement lead will be permanently removed from the system. If a tutor was already assigned, they will no longer be linked."
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

    </div>
  );
};
