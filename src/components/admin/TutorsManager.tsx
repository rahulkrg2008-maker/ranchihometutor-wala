import { SecureDocument } from './SecureDocument';
import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit, 
  ShieldCheck, 
  MessageCircle, 
  Plus, 
  FileText, 
  Lock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Download,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import { Tutor, TutorStatus, TeachingMode, TuitionRequirement } from '../../types';
import { AVAILABLE_CLASSES, AVAILABLE_SUBJECTS } from '../../data/initialData';
import { StorageService, getWhatsAppLink } from '../../services/storageService';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface TutorsManagerProps {
  tutors: Tutor[];
  requirements?: TuitionRequirement[];
  onShowNotification: (msg: string) => void;
}

export const TutorsManager: React.FC<TutorsManagerProps> = ({
  tutors,
  requirements = [],
  onShowNotification,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [areaFilter, setAreaFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [subjectFilter, setSubjectFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');
  const [experienceFilter, setExperienceFilter] = useState<string>('All');
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Verified' | 'Pending'>('All');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const [assigningStudentTutor, setAssigningStudentTutor] = useState<Tutor | null>(null);
  const [studentAssignId, setStudentAssignId] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Extract unique areas for filtering
  const allAreas = Array.from(new Set(tutors.map((t) => t.teachingArea).filter(Boolean)));

  // Filtered tutors according to Section 13 criteria:
  // Name, Area, Class, Subject, Gender, Availability, Experience, Verification status, Active/inactive status
  const filteredTutors = tutors.filter((tutor) => {
    // Status filter
    if (statusFilter === 'Hidden') {
      if (!tutor.isHidden) return false;
    } else if (statusFilter !== 'All') {
      if (tutor.status !== statusFilter) return false;
    }

    // Area filter
    if (areaFilter !== 'All' && !tutor.teachingArea.toLowerCase().includes(areaFilter.toLowerCase())) {
      return false;
    }

    // Class filter
    if (classFilter !== 'All' && !tutor.classes.includes(classFilter)) {
      return false;
    }

    // Subject filter
    if (subjectFilter !== 'All' && !tutor.subjects.includes(subjectFilter)) {
      return false;
    }

    // Gender filter
    if (genderFilter !== 'All' && tutor.gender && tutor.gender.toLowerCase() !== genderFilter.toLowerCase()) {
      return false;
    }

    // Availability filter
    if (availabilityFilter !== 'All' && tutor.availability && !tutor.availability.toLowerCase().includes(availabilityFilter.toLowerCase())) {
      return false;
    }

    // Experience filter
    const expNum = Number(tutor.teachingExperience || 0);
    if (experienceFilter === '0-2' && expNum > 2) return false;
    if (experienceFilter === '3-5' && (expNum < 3 || expNum > 5)) return false;
    if (experienceFilter === '5+' && expNum < 5) return false;

    // Verification status filter
    if (verificationFilter === 'Verified' && !(tutor.aadhaarVerified || tutor.status === 'VERIFIED' || tutor.status === 'Approved')) {
      return false;
    }
    if (verificationFilter === 'Pending' && (tutor.aadhaarVerified || tutor.status === 'VERIFIED' || tutor.status === 'Approved')) {
      return false;
    }

    // Active / Inactive filter
    if (activeFilter === 'Active' && (tutor.status === 'INACTIVE' || tutor.isHidden)) return false;
    if (activeFilter === 'Inactive' && tutor.status !== 'INACTIVE' && !tutor.isHidden) return false;

    // Search filter
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      tutor.id.toLowerCase().includes(term) ||
      tutor.fullName.toLowerCase().includes(term) ||
      tutor.phone.includes(term) ||
      tutor.highestQualification.toLowerCase().includes(term) ||
      tutor.teachingArea.toLowerCase().includes(term) ||
      (tutor.assignedStudentId && tutor.assignedStudentId.toLowerCase().includes(term)) ||
      (tutor.assignedStudentName && tutor.assignedStudentName.toLowerCase().includes(term)) ||
      tutor.subjects.some((s) => s.toLowerCase().includes(term))
    );
  });

  const handleStatusChange = (id: string, newStatus: TutorStatus) => {
    const isNowVerified = newStatus === 'Approved' || newStatus === 'VERIFIED';
    StorageService.updateTutor(id, { 
      status: newStatus,
      aadhaarVerified: isNowVerified
    });
    onShowNotification(`Tutor ${id} status updated to ${newStatus}.`);
    if (selectedTutor && selectedTutor.id === id) {
      setSelectedTutor({ ...selectedTutor, status: newStatus, aadhaarVerified: isNowVerified });
    }
  };

  const handleVerifyKyc = (id: string) => {
    StorageService.updateTutor(id, {
      status: 'VERIFIED',
      aadhaarVerified: true,
    });
    onShowNotification(`Tutor ${id} marked as VERIFIED! Identity and KYC approved.`);
    if (selectedTutor && selectedTutor.id === id) {
      setSelectedTutor({ ...selectedTutor, status: 'VERIFIED', aadhaarVerified: true });
    }
  };

  const handleAssignStudent = (tutorId: string, studentIdInput: string) => {
    const trimmedId = studentIdInput.trim();
    if (!trimmedId) {
      onShowNotification('Please enter or select a Student Requirement ID.');
      return;
    }

    const matchedReq = requirements.find(
      (r) => r.reqCode.toLowerCase() === trimmedId.toLowerCase() || r.id.toLowerCase() === trimmedId.toLowerCase()
    );
    const resolvedStudentId = matchedReq ? matchedReq.reqCode : trimmedId;
    const resolvedStudentName = matchedReq ? (matchedReq.parentName || matchedReq.studentName || matchedReq.reqCode) : `Student (${resolvedStudentId})`;

    StorageService.updateTutor(tutorId, {
      assignedStudentId: resolvedStudentId,
      assignedStudentName: resolvedStudentName,
    });

    onShowNotification(`Assigned Student ID ${resolvedStudentId} (${resolvedStudentName}) to Tutor ${tutorId}!`);
    setAssigningStudentTutor(null);
    setStudentAssignId('');
    if (selectedTutor && selectedTutor.id === tutorId) {
      setSelectedTutor({
        ...selectedTutor,
        assignedStudentId: resolvedStudentId,
        assignedStudentName: resolvedStudentName,
      });
    }
  };

  const handleUnassignStudent = (tutorId: string) => {
    StorageService.updateTutor(tutorId, {
      assignedStudentId: undefined,
      assignedStudentName: undefined,
    });
    onShowNotification(`Student unassigned from Tutor ${tutorId}.`);
    setAssigningStudentTutor(null);
    setStudentAssignId('');
    if (selectedTutor && selectedTutor.id === tutorId) {
      setSelectedTutor({
        ...selectedTutor,
        assignedStudentId: undefined,
        assignedStudentName: undefined,
      });
    }
  };

  const handleToggleHide = (id: string, currentHidden: boolean) => {
    StorageService.updateTutor(id, { isHidden: !currentHidden });
    onShowNotification(`Tutor ${id} is now ${!currentHidden ? 'Hidden' : 'Visible'}.`);
    if (selectedTutor && selectedTutor.id === id) {
      setSelectedTutor({ ...selectedTutor, isHidden: !currentHidden });
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    StorageService.deleteTutor(id);
    onShowNotification(`Tutor ${name} (${id}) deleted successfully.`);
    if (selectedTutor && selectedTutor.id === id) {
      setSelectedTutor(null);
    }
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    if (tutors.length === 0) {
      onShowNotification('No tutor records available to export.');
      return;
    }
    const headers = [
      'Tutor ID',
      'Full Name',
      'Phone',
      'Email',
      'Gender',
      'Date of Birth',
      'Highest Qualification',
      'College / Univ',
      'Subjects',
      'Classes',
      'Teaching Experience',
      'Teaching Area',
      'Teaching Mode',
      'Availability',
      'Status',
      'Aadhaar Verified',
      'Assigned Requirements Count',
      'Assigned Student ID',
      'Assigned Student Name',
      'Registered Date'
    ];

    const rows = tutors.map(t => [
      `"${t.id || ''}"`,
      `"${(t.fullName || '').replace(/"/g, '""')}"`,
      `"${t.phone || ''}"`,
      `"${t.email || ''}"`,
      `"${t.gender || ''}"`,
      `"${t.dob || ''}"`,
      `"${(t.highestQualification || '').replace(/"/g, '""')}"`,
      `"${(t.college || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(t.subjects) ? t.subjects.join(', ') : t.subjects || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(t.classes) ? t.classes.join(', ') : t.classes || '').replace(/"/g, '""')}"`,
      `"${t.teachingExperience || ''}"`,
      `"${(t.teachingArea || '').replace(/"/g, '""')}"`,
      `"${t.teachingMode || ''}"`,
      `"${t.availability || ''}"`,
      `"${t.status || ''}"`,
      `"${t.aadhaarVerified ? 'Verified' : 'Unverified'}"`,
      `"${t.assignedRequirementsCount || 0}"`,
      `"${t.assignedStudentId || ''}"`,
      `"${(t.assignedStudentName || '').replace(/"/g, '""')}"`,
      `"${t.registeredAt || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ranchi_tutors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowNotification(`Exported ${tutors.length} tutors to CSV (Excel format) successfully!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 text-amber-400 text-xs font-semibold mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Strictly Private Tutor Database</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Tutor Management ({tutors.length} Total)
          </h2>
          <p className="text-xs text-slate-400">
            Internal Tutor IDs, background KYC, verification approvals, and contact details.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:text-white"
            title="Export all tutors to Excel / CSV"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Export CSV (Excel)</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Tutor</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID (RHT-0001), name, subject, area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'All', label: 'All' },
            { id: 'VERIFIED', label: 'Verified' },
            { id: 'REGISTRATION_RECEIVED', label: 'New Apps' },
            { id: 'UNDER_REVIEW', label: 'Under Review' },
            { id: 'DOCUMENTS_PENDING', label: 'Docs Pending' },
            { id: 'Approved', label: 'Approved' },
            { id: 'Pending', label: 'Pending' },
            { id: 'INACTIVE', label: 'Inactive' },
            { id: 'Hidden', label: 'Hidden' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

      </div>

      {/* Advanced Multi-Attribute Filters (Section 13: Area, Class, Subject, Gender, Availability, Experience, Verification) */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
        
        {/* Area Filter */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Area / Locality</label>
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Localities</option>
            {allAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Target Class</label>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Classes</option>
            {AVAILABLE_CLASSES.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Subject</label>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Subjects</option>
            {AVAILABLE_SUBJECTS.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Gender</label>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Availability</label>
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">Any Timing</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="Both">Both Morning & Evening</option>
          </select>
        </div>

        {/* Experience Filter */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">Experience</label>
          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">Any Experience</option>
            <option value="0-2">0 - 2 Years</option>
            <option value="3-5">3 - 5 Years</option>
            <option value="5+">5+ Years</option>
          </select>
        </div>

        {/* Verification Status */}
        <div>
          <label className="block text-slate-400 text-[10px] uppercase font-bold mb-1">KYC Verification</label>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value as any)}
            className="w-full px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="All">All Statuses</option>
            <option value="Verified">Verified Only</option>
            <option value="Pending">Unverified / Pending</option>
          </select>
        </div>

      </div>

      {/* Tutors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Tutor ID</th>
                <th className="py-3.5 px-4">Name & Contact</th>
                <th className="py-3.5 px-4">Qualification & Experience</th>
                <th className="py-3.5 px-4">Subjects & Area</th>
                <th className="py-3.5 px-4">KYC / Mode</th>
                <th className="py-3.5 px-4">Assigned Student ID</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredTutors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No tutors found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTutors.map((tutor) => (
                  <tr 
                    key={tutor.id}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Tutor ID */}
                    <td className="py-3 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {tutor.id}
                      {tutor.isHidden && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-slate-800 text-[10px] text-slate-400 rounded">
                          Hidden
                        </span>
                      )}
                    </td>

                    {/* Name & Contact */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{tutor.fullName}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          {tutor.phone}
                        </span>
                        <a
                          href={getWhatsAppLink(tutor.phone, `Hello ${tutor.fullName}, message from RanchiHomeTutor Wala coordination desk.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:underline font-medium flex items-center gap-0.5"
                          title="WhatsApp Tutor"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Chat
                        </a>
                      </div>
                    </td>

                    {/* Qualification & Experience */}
                    <td className="py-3 px-4">
                      <div className="text-white font-medium">{tutor.highestQualification}</div>
                      <div className="text-[11px] text-slate-400">
                        {tutor.teachingExperience} yrs exp • {tutor.college || 'Ranchi'}
                      </div>
                    </td>

                    {/* Subjects & Area */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="text-slate-200 truncate">{tutor.subjects.join(', ')}</div>
                      <div className="text-[11px] text-amber-400/80 truncate">
                        📍 {tutor.teachingArea}
                      </div>
                    </td>

                    {/* KYC / Mode */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {tutor.aadhaarVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
                            <ShieldCheck className="w-3 h-3" />
                            Aadhaar Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-semibold border border-amber-500/30">
                            Aadhaar Pending
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {tutor.teachingMode}
                      </div>
                    </td>

                    {/* Assigned Student ID */}
                    <td className="py-3 px-4">
                      {tutor.assignedStudentId ? (
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-500/40">
                            <span className="font-mono font-bold text-xs text-sky-400">{tutor.assignedStudentId}</span>
                          </div>
                          {tutor.assignedStudentName && (
                            <div className="font-semibold text-slate-300 text-[11px] truncate max-w-[130px]" title={tutor.assignedStudentName}>
                              {tutor.assignedStudentName}
                            </div>
                          )}
                          <button
                            onClick={() => {
                              setAssigningStudentTutor(tutor);
                              setStudentAssignId(tutor.assignedStudentId || '');
                            }}
                            className="text-[10px] text-slate-400 hover:text-sky-300 flex items-center gap-0.5 cursor-pointer underline"
                          >
                            <Edit className="w-2.5 h-2.5" /> Edit ID
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setAssigningStudentTutor(tutor);
                            setStudentAssignId('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-sky-300 text-[11px] font-medium transition-colors border border-dashed border-slate-700 flex items-center gap-1 cursor-pointer"
                          title="Fill Assigned Student ID"
                        >
                          <Plus className="w-3 h-3 text-sky-400" />
                          <span>Fill Student ID</span>
                        </button>
                      )}
                    </td>

                    {/* Status badge */}
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tutor.status === 'VERIFIED' || tutor.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : tutor.status === 'UNDER_REVIEW'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : tutor.status === 'DOCUMENTS_PENDING'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : tutor.status === 'ACTIVE'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          : tutor.status === 'INACTIVE'
                          ? 'bg-slate-700 text-slate-300 border border-slate-600'
                          : tutor.status === 'Rejected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {tutor.status === 'Approved' ? 'VERIFIED' : tutor.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Dossier */}
                        <button
                          onClick={() => setSelectedTutor(tutor)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg cursor-pointer"
                          title="View Full Profile & KYC Dossier"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Quick Verify KYC */}
                        {!(tutor.aadhaarVerified || tutor.status === 'VERIFIED' || tutor.status === 'Approved') && (
                          <button
                            onClick={() => handleVerifyKyc(tutor.id)}
                            className="px-2 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-600/40 cursor-pointer flex items-center gap-1"
                            title="Verify Aadhaar / KYC Documents"
                          >
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verify</span>
                          </button>
                        )}

                        {/* Reject */}
                        {tutor.status !== 'Rejected' && (
                          <button
                            onClick={() => handleStatusChange(tutor.id, 'Rejected')}
                            className="p-1.5 bg-red-950 hover:bg-red-900 text-red-400 rounded-lg border border-red-600/40 cursor-pointer"
                            title="Reject Tutor"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Hide / Show */}
                        <button
                          onClick={() => handleToggleHide(tutor.id, tutor.isHidden)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                          title={tutor.isHidden ? 'Show in Directory' : 'Hide Tutor'}
                        >
                          {tutor.isHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget({ id: tutor.id, name: tutor.fullName })}
                          className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                          title="Delete Tutor"
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

      {/* Full Tutor KYC & Dossier Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-5 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-400 border border-amber-400/30">
                  {selectedTutor.id}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedTutor.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTutor(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dossier Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">Phone / WhatsApp:</span>
                <strong className="text-white">{selectedTutor.phone}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">Email:</span>
                <strong className="text-white">{selectedTutor.email}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">Highest Qualification:</span>
                <strong className="text-white">{selectedTutor.highestQualification} ({selectedTutor.college || 'N/A'})</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">Teaching Experience:</span>
                <strong className="text-white">{selectedTutor.teachingExperience} Years</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">Teaching Mode:</span>
                <strong className="text-white">{selectedTutor.teachingMode}</strong>
              </div>
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block">Availability:</span>
                <strong className="text-white">{selectedTutor.availability}</strong>
              </div>
            </div>

            {/* Aadhaar & PAN verification */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="text-amber-400 font-bold flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Identity & KYC Verification</span>
                  {selectedTutor.aadhaarLast4 && (
                    <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      •••• •••• {selectedTutor.aadhaarLast4}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  Status: {selectedTutor.aadhaarVerified ? 'Verified ✅' : 'Pending Review ⚠️'}
                </span>
              </div>

              {/* Uploaded Photos Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {selectedTutor.aadhaarPhoto ? (
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-slate-400 font-bold block text-[11px]">Aadhaar Card Photo:</span>
                    <SecureDocument src={selectedTutor.aadhaarPhoto} alt="Aadhaar Card" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 text-[11px]">
                    No Aadhaar Photo attached
                  </div>
                )}

                {selectedTutor.qualificationPhoto ? (
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                    <span className="text-slate-400 font-bold block text-[11px]">Highest Qualification Photo:</span>
                    <SecureDocument src={selectedTutor.qualificationPhoto} alt="Qualification Degree" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 text-[11px]">
                    No Qualification Document attached
                  </div>
                )}
              </div>
            </div>

            {/* Subjects & Classes */}
            <div className="space-y-2 text-xs">
              <span className="text-slate-400 block">Subjects:</span>
              <div className="flex flex-wrap gap-1">
                {selectedTutor.subjects.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-400 block">Classes Handled:</span>
              <div className="flex flex-wrap gap-1">
                {selectedTutor.classes.map((c) => (
                  <span key={c} className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/60">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-slate-400 block">Preferred Teaching Localities:</span>
              <p className="text-slate-200 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                {selectedTutor.teachingArea}
              </p>
            </div>

            {/* Assigned Student ID / Lead Assignment Section */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="text-sky-400 font-bold flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Assigned Student ID / Requirement</span>
                </div>
                {selectedTutor.assignedStudentId ? (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-bold">
                    Linked: {selectedTutor.assignedStudentId}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">No Student Currently Assigned</span>
                )}
              </div>

              {selectedTutor.assignedStudentId && (
                <div className="p-3 rounded-2xl bg-sky-950/40 border border-sky-800/40 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Current Assigned Student:</span>
                    <strong className="text-white text-sm">{selectedTutor.assignedStudentName || selectedTutor.assignedStudentId}</strong>
                    <div className="font-mono text-sky-400 text-xs mt-0.5">ID: {selectedTutor.assignedStudentId}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnassignStudent(selectedTutor.id)}
                    className="px-3 py-1.5 text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl cursor-pointer transition-colors"
                  >
                    Unassign
                  </button>
                </div>
              )}

              {/* Input & dropdown to assign or change student */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <label className="block text-slate-300 text-[11px] font-semibold">
                  Fill / Update Assigned Student ID:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. HW01"
                    value={studentAssignId}
                    onChange={(e) => setStudentAssignId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAssignStudent(selectedTutor.id, studentAssignId)}
                    disabled={!studentAssignId.trim()}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-2xl cursor-pointer transition-colors"
                  >
                    Save
                  </button>
                </div>

                {requirements.length > 0 && (
                  <div>
                    <label className="block text-slate-400 text-[10px] mb-1">
                      Or pick from active Tuition Requirements:
                    </label>
                    <select
                      value={requirements.some(r => r.reqCode.toLowerCase() === studentAssignId.toLowerCase()) ? studentAssignId : ''}
                      onChange={(e) => {
                        if (e.target.value) {
                          setStudentAssignId(e.target.value);
                          handleAssignStudent(selectedTutor.id, e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                    >
                      <option value="">-- Select from Active Requirements --</option>
                      {requirements.map((req) => (
                        <option key={req.id} value={req.reqCode}>
                          {req.reqCode} — {req.parentName || 'Student'} ({req.classes.join(', ')} • {req.area})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Actions footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <a
                href={getWhatsAppLink(selectedTutor.phone, `Hello ${selectedTutor.fullName}, message from RanchiHomeTutor Wala coordinator.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Message on WhatsApp</span>
              </a>

              <div className="flex flex-wrap items-center gap-2">
                {/* One-click KYC Verify */}
                {!(selectedTutor.aadhaarVerified || selectedTutor.status === 'VERIFIED') && (
                  <button
                    onClick={() => handleVerifyKyc(selectedTutor.id)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify Documents & KYC</span>
                  </button>
                )}

                {/* Status Selector Dropdown */}
                <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-2xl border border-slate-700">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Status:</span>
                  <select
                    value={selectedTutor.status}
                    onChange={(e) => handleStatusChange(selectedTutor.id, e.target.value as TutorStatus)}
                    className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer py-1"
                  >
                    <option value="REGISTRATION_RECEIVED" className="bg-slate-900">Registration Received</option>
                    <option value="DOCUMENTS_PENDING" className="bg-slate-900">Documents Pending</option>
                    <option value="UNDER_REVIEW" className="bg-slate-900">Under Review</option>
                    <option value="VERIFIED" className="bg-slate-900">Verified</option>
                    <option value="Approved" className="bg-slate-900">Approved</option>
                    <option value="ACTIVE" className="bg-slate-900">Active</option>
                    <option value="INACTIVE" className="bg-slate-900">Inactive</option>
                    <option value="Rejected" className="bg-slate-900">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Manual Add Tutor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Tutor Manually</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                
                const rawStudentId = (formData.get('assignedStudentId') as string || '').trim();
                let matchedStudentName: string | undefined;
                if (rawStudentId) {
                  const req = requirements.find(
                    (r) => r.reqCode.toLowerCase() === rawStudentId.toLowerCase() || r.id.toLowerCase() === rawStudentId.toLowerCase()
                  );
                  if (req) {
                    matchedStudentName = req.parentName || req.studentName || req.reqCode;
                  }
                }

                try {
                await StorageService.addTutor({
                  fullName: formData.get('fullName') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string || `${formData.get('phone')}@tutor.ranchihometutor.com`,
                  highestQualification: formData.get('qualification') as string,
                  college: formData.get('college') as string || 'Ranchi',
                  subjects: (formData.get('subjects') as string).split(',').map((s) => s.trim()),
                  classes: ['Class 8', 'Class 9', 'Class 10'],
                  teachingExperience: Number(formData.get('exp') || 2),
                  teachingArea: formData.get('area') as string || 'Ranchi',
                  teachingMode: 'Student Home',
                  availability: 'Evenings (4:30 PM - 8:00 PM)',
                  gender: 'Male',
                  aadhaarVerified: true,
                  assignedStudentId: rawStudentId || undefined,
                  assignedStudentName: matchedStudentName || (rawStudentId ? `Student (${rawStudentId})` : undefined),
                });

                onShowNotification('New tutor added to private database!');
                setIsAddModalOpen(false);
                } catch (err: any) {
                  onShowNotification(err.message || 'Could not add tutor.');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input name="fullName" required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Phone</label>
                  <input name="phone" required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Email</label>
                  <input name="email" type="email" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Qualification</label>
                  <input name="qualification" required placeholder="e.g. M.Sc / B.Tech" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Exp (Years)</label>
                  <input name="exp" type="number" defaultValue="3" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Subjects (comma separated)</label>
                <input name="subjects" required defaultValue="Mathematics, Science" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Teaching Areas in Ranchi</label>
                <input name="area" required defaultValue="Bariatu, Morabadi, Lalpur" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Assigned Student ID (Optional)</label>
                <input name="assignedStudentId" placeholder="e.g. HW01" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">Save Tutor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Assigned Student ID Modal */}
      {assigningStudentTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {assigningStudentTutor.id}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Assign Student ID to {assigningStudentTutor.fullName}
                </h3>
              </div>
              <button 
                onClick={() => {
                  setAssigningStudentTutor(null);
                  setStudentAssignId('');
                }} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Enter Student Requirement ID (e.g. HW01, HW02):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. HW01"
                    value={studentAssignId}
                    onChange={(e) => setStudentAssignId(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-sky-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAssignStudent(assigningStudentTutor.id, studentAssignId)}
                    disabled={!studentAssignId.trim()}
                    className="px-4 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-2xl cursor-pointer transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>

              {requirements.length > 0 && (
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">
                    Or select from registered Tuition Requirements:
                  </label>
                  <select
                    value={requirements.some(r => r.reqCode.toLowerCase() === studentAssignId.toLowerCase()) ? studentAssignId : ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        setStudentAssignId(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-sky-400 cursor-pointer"
                  >
                    <option value="">-- Choose from Active Leads --</option>
                    {requirements.map((req) => (
                      <option key={req.id} value={req.reqCode}>
                        {req.reqCode} — {req.parentName || 'Student'} ({req.classes.join(', ')} • {req.area})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tutor summary box */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1 text-slate-400 text-[11px]">
                <div><strong>Subjects:</strong> {assigningStudentTutor.subjects.join(', ')}</div>
                <div><strong>Preferred Areas:</strong> {assigningStudentTutor.teachingArea}</div>
                <div><strong>Teaching Mode:</strong> {assigningStudentTutor.teachingMode}</div>
                {assigningStudentTutor.assignedStudentId && (
                  <div className="text-sky-400 pt-1 border-t border-slate-800">
                    Currently linked to: <strong>{assigningStudentTutor.assignedStudentId}</strong> ({assigningStudentTutor.assignedStudentName})
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center justify-between">
                {assigningStudentTutor.assignedStudentId ? (
                  <button
                    type="button"
                    onClick={() => handleUnassignStudent(assigningStudentTutor.id)}
                    className="px-3 py-2 bg-red-950/60 hover:bg-red-900 text-red-300 font-medium text-xs rounded-2xl border border-red-800/40 cursor-pointer"
                  >
                    Unassign Student
                  </button>
                ) : <span />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAssigningStudentTutor(null);
                      setStudentAssignId('');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-2xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAssignStudent(assigningStudentTutor.id, studentAssignId)}
                    disabled={!studentAssignId.trim()}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-2xl cursor-pointer transition-colors"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Interactive Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Permanently Delete Tutor"
        itemName={deleteTarget ? `${deleteTarget.name} (${deleteTarget.id})` : ''}
        itemDetails="All KYC records, contact phone, qualifications, and assignment history for this tutor will be removed."
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

    </div>
  );
};
