import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  GraduationCap, 
  FileText, 
  Lock, 
  AlertCircle, 
  Camera, 
  BookOpen, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Eye, 
  Trash2, 
  UploadCloud 
} from 'lucide-react';
import { WebsiteSettings, TeachingMode } from '../../types';
import { AVAILABLE_CLASSES } from '../../data/initialData';
import { StorageService } from '../../services/storageService';
import { uploadDocumentToStorage } from '../../services/supabaseStorage';
import { prepareDocumentForUpload } from '../../services/imageUtils';

/** 07294907126, +91 72949 07126, 917294907126 -> 7294907126 */
const normalizePhone = (raw: string): string => {
  let d = raw.replace(/\D/g, '');
  if (d.length === 13 && d.startsWith('091')) d = d.slice(3);
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
  return d;
};

interface BecomeTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  onSuccessNotification: (msg: string) => void;
}

export const BecomeTutorModal: React.FC<BecomeTutorModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSuccessNotification,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [college, setCollege] = useState('');
  // Type form for subjects taught per user request
  const [typedSubjects, setTypedSubjects] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Class 9', 'Class 10']);
  const [teachingExperience, setTeachingExperience] = useState<string>('3');
  const [teachingArea, setTeachingArea] = useState('');
  const [teachingMode, setTeachingMode] = useState<TeachingMode>('Student Home');
  const [availability, setAvailability] = useState('Evening (3:00 PM – 8:00 PM)');

  // Document photo uploads (MANDATORY per user request: Aadhaar Photo and Qualification Photo)
  const [aadhaarPhoto, setAadhaarPhoto] = useState<string | null>(null);
  const [aadhaarFileName, setAadhaarFileName] = useState<string>('');
  const [qualificationPhoto, setQualificationPhoto] = useState<string | null>(null);
  const [qualificationFileName, setQualificationFileName] = useState<string>('');

  const [panNumber, setPanNumber] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleClass = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      if (selectedClasses.length > 1) {
        setSelectedClasses(selectedClasses.filter((c) => c !== cls));
      }
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
  };

  // Compress/convert the chosen file to a data URL (images are downscaled; PDFs pass through)
  const handleFileUpload = async (
    file: File,
    setPhotoState: (val: string | null) => void,
    setFileNameState: (name: string) => void
  ) => {
    if (!file) return;
    try {
      const dataUrl = await prepareDocumentForUpload(file);
      setPhotoState(dataUrl);
      setFileNameState(file.name);
      if (errorMessage) setErrorMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read file. Please try selecting a valid image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(normalizePhone(phone))) {
      setErrorMessage('Please enter a valid 10-digit Contact Phone Number.');
      return;
    }

    if (!highestQualification.trim()) {
      setErrorMessage('Please specify your Highest Qualification degree or title.');
      return;
    }

    if (!typedSubjects.trim()) {
      setErrorMessage('Please type the subjects you teach.');
      return;
    }

    // MANDATORY PHOTO SUBMISSION CHECK: Both Aadhaar photo and Qualification photo are strictly required
    if (!qualificationPhoto) {
      setErrorMessage('Highest Qualification Document Photo is mandatory. Form cannot be submitted without it.');
      return;
    }

    if (!aadhaarPhoto) {
      setErrorMessage('Aadhaar Card Photo is mandatory. Form cannot be submitted without it.');
      return;
    }

    if (!consentAccepted) {
      setErrorMessage('Please accept the verification & safety consent before submitting.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const subjectList = typedSubjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      // If Supabase Storage is configured, upload to 'tutor-documents' bucket; otherwise fallback
      const uploadedQualification = await uploadDocumentToStorage(
        qualificationPhoto,
        `${normalizePhone(phone)}_qualification`,
        'qualification'
      );
      const uploadedAadhaar = await uploadDocumentToStorage(
        aadhaarPhoto,
        `${normalizePhone(phone)}_aadhaar`,
        'aadhaar'
      );

      // Save tutor info strictly privately (Admin only)
      await StorageService.addTutor({
        fullName: fullName.trim(),
        dob: dob || undefined,
        gender: gender,
        phone: normalizePhone(phone),
        email: email.trim() || `${normalizePhone(phone)}@tutor.ranchihometutor.com`,
        highestQualification: highestQualification.trim(),
        college: college.trim(),
        subjects: subjectList.length > 0 ? subjectList : [typedSubjects.trim()],
        classes: selectedClasses,
        teachingExperience: teachingExperience || '0',
        teachingArea: teachingArea.trim() || 'Ranchi All Localities',
        teachingMode: teachingMode,
        availability: availability.trim(),
        panNumber: panNumber.trim() || undefined,
        profilePhoto: profilePhotoUrl.trim() || undefined,
        qualificationPhoto: uploadedQualification,
        aadhaarPhoto: uploadedAadhaar,
        aadhaarVerified: false,
      });

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      onSuccessNotification('Tutor registration & KYC documents submitted! Coordinator will review your application.');
    } catch (err: any) {
      console.error('Registration error:', err);
      setIsSubmitting(false);
      setErrorMessage(err?.message || 'Could not complete submission. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#071A33] border-2 border-[#CDE5F8] dark:border-[#133866] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 my-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Deep Blue Header */}
        <div className="px-6 py-4.5 border-b border-[#032042] dark:border-[#133866] flex items-center justify-between bg-gradient-to-r from-[#032042] via-[#063B73] to-[#087ED1] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Become a Home Tutor in Ranchi</h2>
              <p className="text-xs text-sky-100/90">Submit verified credentials & join our private educator network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/15 rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmittedSuccess ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-300 dark:border-emerald-700 shadow-sm animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-[#063B73] dark:text-white">
                Registration & Documents Submitted!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you for applying to teach with <strong>Ranchi HomeTutor Wala</strong>.
                Your Aadhaar card and highest qualification photos have been encrypted and saved securely for admin verification.
              </p>
            </div>

            {/* Privacy notice banner */}
            <div className="p-4.5 rounded-2xl bg-[#EAF6FF] dark:bg-[#0B2244] border border-[#CDE5F8] dark:border-[#1B447A] text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center gap-2 text-[#063B73] dark:text-sky-300 font-bold">
                <Lock className="w-4 h-4 text-[#087ED1]" />
                <span>Strictly Confidential Tutor Profile</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                Your personal details, contact number, Aadhaar photo, and degrees are kept strictly private on the coordinator dashboard and will never be made public.
              </p>
            </div>

            <div>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#087ED1] to-[#063B73] text-white text-sm font-bold rounded-xl shadow-md cursor-pointer hover:opacity-95"
              >
                Close Registration
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">
            
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* 1. Basic Personal Information */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <span>Personal Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Full Name <span className="text-[#087ED1]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Kumar Singh"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1] focus:ring-2 focus:ring-[#087ED1]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white text-xs focus:outline-none focus:border-[#087ED1]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Contact Phone (WhatsApp) <span className="text-[#087ED1]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9835123456"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1] focus:ring-2 focus:ring-[#087ED1]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. rahul.tutor@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1] focus:ring-2 focus:ring-[#087ED1]/20"
                  />
                </div>
              </div>
            </div>

            {/* 2. Highest Qualification with Photo Upload (MANDATORY) */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <span>Highest Qualification & Document Photo</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Highest Qualification Title <span className="text-[#087ED1]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc (Maths) / B.Tech / B.Ed / M.Com"
                    value={highestQualification}
                    onChange={(e) => {
                      setHighestQualification(e.target.value);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1] focus:ring-2 focus:ring-[#087ED1]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BIT Mesra / Ranchi University / St. Xavier's College"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1] focus:ring-2 focus:ring-[#087ED1]/20"
                  />
                </div>
              </div>

              {/* Qualification Photo Upload Dropzone (Mandatory) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Upload Highest Qualification Document / Degree Photo <span className="text-[#087ED1]">* (Mandatory)</span>
                </label>

                {qualificationPhoto ? (
                  <div className="p-3 bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={qualificationPhoto} 
                        alt="Highest Qualification Preview" 
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Qualification Photo Attached</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{qualificationFileName || 'qualification_doc.jpg'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQualificationPhoto(null);
                        setQualificationFileName('');
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Remove and re-upload"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#CDE5F8] dark:border-slate-700 hover:border-[#087ED1] dark:hover:border-[#087ED1] bg-white dark:bg-slate-900/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#F4FAFF] dark:hover:bg-slate-800/60">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setQualificationPhoto, setQualificationFileName);
                      }}
                    />
                    <div className="w-10 h-10 rounded-full bg-[#EAF6FF] dark:bg-sky-950 text-[#087ED1] dark:text-sky-300 flex items-center justify-center">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#063B73] dark:text-sky-300">
                        Click to upload Qualification Degree / Marksheet photo
                      </span>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                        JPG, PNG, or mobile camera photo (Required for verification)
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* 3. Subjects (TYPE FORM per user request) & Classes */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <span>Subjects & Classes</span>
              </h3>

              {/* Subjects You Teach (TYPE FORM) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Subjects You Teach (Type them in) <span className="text-[#087ED1]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Physics, Chemistry, Biology, English, Accountancy"
                  value={typedSubjects}
                  onChange={(e) => {
                    setTypedSubjects(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1] focus:ring-2 focus:ring-[#087ED1]/20 font-medium"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Type each subject you are confident teaching, separated by commas.
                </p>
              </div>

              {/* Classes You Can Teach */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Classes You Can Teach
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_CLASSES.map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => toggleClass(cls)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedClasses.includes(cls)
                          ? 'bg-[#087ED1] text-white font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-[#EAF6FF] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Teaching Experience (Years)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="40"
                    placeholder="e.g. 3"
                    value={teachingExperience}
                    onChange={(e) => setTeachingExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white text-xs focus:outline-none focus:border-[#087ED1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Teaching Mode
                  </label>
                  <select
                    value={teachingMode}
                    onChange={(e) => setTeachingMode(e.target.value as TeachingMode)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white text-xs focus:outline-none focus:border-[#087ED1]"
                  >
                    <option value="Student Home">Student Home (Offline)</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid (Both Offline & Online)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 4. Preferred Area & Availability */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">4</span>
                <span>Preferred Localities & Daily Schedule</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Teaching Areas in Ranchi
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bariatu, Morabadi, Lalpur, Doranda, Kanke"
                    value={teachingArea}
                    onChange={(e) => setTeachingArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Availability
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Evening (3:00 PM – 8:00 PM)"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#063B73] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1]"
                  />
                </div>
              </div>
            </div>

            {/* 5. Aadhaar Photo Upload (NO NUMBER per user request, strictly photo upload and mandatory!) */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">5</span>
                <span>Aadhaar Identity Verification Photo (Strictly Private)</span>
              </h3>

              {/* Aadhaar Photo Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Upload Aadhaar Card Photo <span className="text-[#087ED1]">* (Mandatory — No number needed, photo only)</span>
                </label>

                {aadhaarPhoto ? (
                  <div className="p-3 bg-white dark:bg-slate-900 border-2 border-emerald-400 dark:border-emerald-600 rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={aadhaarPhoto} 
                        alt="Aadhaar Card Preview" 
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Aadhaar Card Photo Attached</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate max-w-xs">{aadhaarFileName || 'aadhaar_card.jpg'}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAadhaarPhoto(null);
                        setAadhaarFileName('');
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                      title="Remove and re-upload"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[#CDE5F8] dark:border-slate-700 hover:border-[#087ED1] dark:hover:border-[#087ED1] bg-white dark:bg-slate-900/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-[#F4FAFF] dark:hover:bg-slate-800/60">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, setAadhaarPhoto, setAadhaarFileName);
                      }}
                    />
                    <div className="w-10 h-10 rounded-full bg-[#EAF6FF] dark:bg-sky-950 text-[#087ED1] dark:text-sky-300 flex items-center justify-center">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-[#063B73] dark:text-sky-300">
                        Click to upload clear Aadhaar Card photo (Front / Both sides)
                      </span>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Required for verification. Form will NOT submit without Aadhaar photo.
                      </p>
                    </div>
                  </label>
                )}
              </div>

              {/* Exact required consent message */}
              <div className="p-3.5 bg-[#EAF6FF] dark:bg-[#0B2244] border border-[#CDE5F8] dark:border-[#1B447A] rounded-2xl">
                <label className="flex items-start gap-2.5 text-xs text-[#063B73] dark:text-sky-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(e) => {
                      setConsentAccepted(e.target.checked);
                      if (errorMessage) setErrorMessage('');
                    }}
                    className="mt-0.5 rounded text-[#087ED1] focus:ring-0"
                  />
                  <span>
                    <strong>Consent & Safety Policy:</strong> I confirm that the uploaded Aadhaar photo and highest qualification documents are genuine and belong to me. I agree to adhere to Ranchi HomeTutor Wala's Tutor Safety Policy.
                  </span>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#087ED1] to-[#063B73] hover:from-[#066bb3] hover:to-[#042d59] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#087ED1]/30 transition-all cursor-pointer hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-5 h-5 text-white" />
                <span>Submit Tutor Registration & Verified Documents</span>
              </button>
              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                Verification takes 12–24 hours. Once verified, you will receive matching home tuition assignments in Ranchi.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
