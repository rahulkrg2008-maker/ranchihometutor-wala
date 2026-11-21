import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageCircle, 
  CheckCircle2, 
  MapPin, 
  AlertCircle, 
  Sun, 
  SunMedium, 
  Sunset, 
  Clock, 
  BookOpen, 
  Calendar, 
  DollarSign, 
  User, 
  Phone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { WebsiteSettings, TuitionRequirement } from '../../types';
import { AVAILABLE_CLASSES } from '../../data/initialData';
import { StorageService, getWhatsAppLink, formatParentRequirementWhatsAppText, formatPreferredTimingText } from '../../services/storageService';

const PREFERRED_TIME_SLOTS = [
  {
    id: 'Morning',
    title: 'Morning',
    timeRange: '7 AM to 10 AM',
    fullText: 'Morning (7 AM to 10 AM)',
    from: '07:00 AM',
    to: '10:00 AM',
    icon: Sun,
  },
  {
    id: 'Midday',
    title: 'Midday / Noon',
    timeRange: '11 AM To 3 PM',
    fullText: 'Midday/Noon (11 AM To 3 PM)',
    from: '11:00 AM',
    to: '03:00 PM',
    icon: SunMedium,
  },
  {
    id: 'Evening',
    title: 'Evening',
    timeRange: '3:00 PM – 8:00 PM',
    fullText: 'Evening (3:00 PM – 8:00 PM)',
    from: '03:00 PM',
    to: '08:00 PM',
    icon: Sunset,
  },
] as const;

interface FindTuitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebsiteSettings;
  onSuccessNotification: (msg: string) => void;
}

export const FindTuitionModal: React.FC<FindTuitionModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSuccessNotification,
}) => {
  // Required fields
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['Class 10']);
  const [typedSubjects, setTypedSubjects] = useState('');
  const [area, setArea] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('Evening');
  const [timeFrom, setTimeFrom] = useState('03:00 PM');
  const [timeTo, setTimeTo] = useState('08:00 PM');

  // Optional fields
  const [budget, setBudget] = useState('');
  const [preferredTutor, setPreferredTutor] = useState<'Male' | 'Female' | 'No Preference'>('No Preference');
  const [classesPerWeek, setClassesPerWeek] = useState<number>(5);
  const [additionalRequirements, setAdditionalRequirements] = useState('');

  // Validation state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState<TuitionRequirement | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmittedReq(null);
      setIsSubmitting(false);
      setErrorMessage('');
      setFieldErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleClass = (cls: string) => {
    if (selectedClasses.includes(cls)) {
      if (selectedClasses.length > 1) {
        setSelectedClasses(selectedClasses.filter((c) => c !== cls));
      }
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
    if (fieldErrors.classes) {
      setFieldErrors((prev) => ({ ...prev, classes: '' }));
    }
  };

  // Indian Mobile Number Validator: exactly 10 digits starting with 6, 7, 8, 9
  const validateIndianPhone = (num: string): boolean => {
    let stripped = num.replace(/\D/g, '');
    if (stripped.length === 12 && stripped.startsWith('91')) stripped = stripped.slice(2);
    if (stripped.length === 11 && stripped.startsWith('0')) stripped = stripped.slice(1);
    if (!/^[6-9]\d{9}$/.test(stripped)) return false;
    // Disallow repeating dummy numbers like 9999999999 or sequential 9876543210
    if (/^(\d)\1{9}$/.test(stripped)) return false;
    return true;
  };

  // Name validator: min 2 characters, not purely numeric
  const validateName = (name: string): boolean => {
    const clean = name.trim();
    if (clean.length < 2) return false;
    if (/^\d+$/.test(clean)) return false;
    return true;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!parentName.trim()) {
      errors.parentName = 'Parent or Guardian Name is required.';
    } else if (!validateName(parentName)) {
      errors.parentName = 'Please enter a valid Parent Name (at least 2 letters, not numbers).';
    }

    if (!studentName.trim()) {
      errors.studentName = 'Student Name is required.';
    } else if (!validateName(studentName)) {
      errors.studentName = 'Please enter a valid Student Name (at least 2 letters, not numbers).';
    }

    if (!phone.trim()) {
      errors.phone = 'Mobile / WhatsApp number is required.';
    } else if (!validateIndianPhone(phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9835123456).';
    }

    if (selectedClasses.length === 0) {
      errors.classes = 'Please select at least one Class / Grade.';
    }

    if (!typedSubjects.trim()) {
      errors.subjects = 'Please enter at least one Subject (e.g. Mathematics, Science).';
    }

    if (!area.trim()) {
      errors.area = 'Area or Locality in Ranchi is required (e.g. Bariatu, Morabadi, Lalpur).';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Please correct the highlighted fields before submitting.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const subjectList = typedSubjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let normalizedPhone = phone.replace(/\D/g, '');
    if (normalizedPhone.length === 12 && normalizedPhone.startsWith('91')) normalizedPhone = normalizedPhone.slice(2);
    if (normalizedPhone.length === 11 && normalizedPhone.startsWith('0')) normalizedPhone = normalizedPhone.slice(1);

    // Save to Supabase via storage service
    let newReq;
    try {
    newReq = await StorageService.addRequirement({
      parentName: parentName.trim(),
      studentName: studentName.trim(),
      phone: normalizedPhone,
      classes: selectedClasses,
      subjects: subjectList.length > 0 ? subjectList : [typedSubjects.trim()],
      area: area.trim(),
      classesPerWeek: classesPerWeek,
      timeFrom: timeFrom,
      timeTo: timeTo,
      preferredTutor: preferredTutor,
      budget: budget.trim() || '₹4,000 – ₹5,000',
      additionalRequirements: additionalRequirements.trim(),
    });
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not submit. Please try again.');
      setIsSubmitting(false);
      return;
    }

    setSubmittedReq(newReq);
    setIsSubmitting(false);
    // Auto-redirect to WhatsApp (same tab: popups after an await are blocked on phones)
    const waUrl = getWhatsAppLink(settings.whatsappNumber, formatParentRequirementWhatsAppText(newReq));
    setTimeout(() => { window.location.href = waUrl; }, 1200);

    onSuccessNotification(`Requirement ${newReq.reqCode} submitted successfully!`);
  };

  const handleOpenWhatsApp = () => {
    if (!submittedReq) return;
    const whatsappText = formatParentRequirementWhatsAppText(submittedReq);
    const whatsappUrl = getWhatsAppLink(settings.whatsappNumber, whatsappText);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#071A33] border-2 border-[#CDE5F8] dark:border-[#133866] rounded-3xl shadow-2xl text-slate-900 dark:text-slate-100 my-8 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#032042] dark:border-[#133866] flex items-center justify-between bg-gradient-to-r from-[#032042] via-[#063B73] to-[#087ED1] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">Need a Home Tutor in Ranchi?</h2>
              <p className="text-xs text-sky-100/90">Fill your tuition requirements below for coordinator review</p>
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
        {submittedReq ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-400 shadow-md animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 text-[#087ED1] dark:text-sky-300 text-xs font-mono font-bold border border-sky-300 dark:border-sky-800 mb-2">
                Requirement ID: {submittedReq.reqCode}
              </div>
              <h3 className="text-2xl font-black text-[#063B73] dark:text-white">
                Tuition Requirement Saved Successfully!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you, <strong>{submittedReq.parentName}</strong>! Your inquiry for <strong>{submittedReq.studentName}</strong> has been registered in our coordinator system.
              </p>
            </div>

            {/* Requirement Summary Card */}
            <div className="p-4.5 rounded-2xl bg-[#EAF6FF] dark:bg-[#0B2244] border border-[#CDE5F8] dark:border-[#1B447A] text-xs text-left max-w-md mx-auto space-y-2">
              <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-900 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Class & Subjects:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {submittedReq.classes.join(', ')} • {submittedReq.subjects.join(', ')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-900 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Locality:</span>
                <span className="font-bold text-slate-900 dark:text-white">{submittedReq.area}</span>
              </div>
              <div className="flex items-center justify-between border-b border-sky-200 dark:border-sky-900 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Preferred Time:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatPreferredTimingText(submittedReq.timeFrom, submittedReq.timeTo)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contact Number:</span>
                <span className="font-bold text-slate-900 dark:text-white">+91 {submittedReq.phone}</span>
              </div>
            </div>

            {/* Clear WhatsApp Notice */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs text-left max-w-md mx-auto flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <strong className="block font-bold">Opening WhatsApp:</strong>
                <span>
                  Your requirement has been saved. Opening WhatsApp with your details ready — just press <strong>Send</strong>. If it does not open, tap the WhatsApp button below.
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Open WhatsApp to Send</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[82vh] overflow-y-auto">
            
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span className="font-medium leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {/* 1. Parent & Student Contact Information */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">1</span>
                <span>Contact Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Parent / Guardian Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanjay Verma"
                      value={parentName}
                      onChange={(e) => {
                        setParentName(e.target.value);
                        if (fieldErrors.parentName) setFieldErrors({ ...fieldErrors, parentName: '' });
                      }}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                        fieldErrors.parentName ? 'border-red-500' : 'border-[#CDE5F8] dark:border-slate-700'
                      } text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1]`}
                    />
                  </div>
                  {fieldErrors.parentName && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.parentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                    Student Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Verma"
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        if (fieldErrors.studentName) setFieldErrors({ ...fieldErrors, studentName: '' });
                      }}
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                        fieldErrors.studentName ? 'border-red-500' : 'border-[#CDE5F8] dark:border-slate-700'
                      } text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1]`}
                    />
                  </div>
                  {fieldErrors.studentName && (
                    <p className="text-[11px] text-red-500 mt-1">{fieldErrors.studentName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Mobile / WhatsApp Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9835123456"
                    value={phone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, '');
                      setPhone(clean);
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: '' });
                    }}
                    className={`w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                      fieldErrors.phone ? 'border-red-500' : 'border-[#CDE5F8] dark:border-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-400 text-xs font-medium focus:outline-none focus:border-[#087ED1]`}
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.phone}</p>
                ) : (
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                    Coordinator will send verified tutor profiles on this number.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Academic Requirements: Class & Subjects */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">2</span>
                <span>Class & Subjects</span>
              </h3>

              {/* Class Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Select Class / Grade <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_CLASSES.map((cls) => (
                    <button
                      type="button"
                      key={cls}
                      onClick={() => toggleClass(cls)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        selectedClasses.includes(cls)
                          ? 'bg-[#087ED1] text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#087ED1]'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
                {fieldErrors.classes && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.classes}</p>
                )}
              </div>

              {/* Subjects Required */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Subject(s) Needed <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Science, English, Physics"
                  value={typedSubjects}
                  onChange={(e) => {
                    setTypedSubjects(e.target.value);
                    if (fieldErrors.subjects) setFieldErrors({ ...fieldErrors, subjects: '' });
                  }}
                  className={`w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                    fieldErrors.subjects ? 'border-red-500' : 'border-[#CDE5F8] dark:border-slate-700'
                  } text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1]`}
                />
                {fieldErrors.subjects ? (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.subjects}</p>
                ) : (
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1">
                    Separate multiple subjects with commas.
                  </p>
                )}
              </div>
            </div>

            {/* 3. Location & Timing */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-[#063B73] dark:text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#087ED1] text-white text-[11px] font-bold flex items-center justify-center">3</span>
                <span>Area & Preferred Timing</span>
              </h3>

              {/* Area / Locality */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Area / Locality in Ranchi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bariatu, Morabadi, Lalpur, Doranda, Harmu, Kanke Road"
                    value={area}
                    onChange={(e) => {
                      setArea(e.target.value);
                      if (fieldErrors.area) setFieldErrors({ ...fieldErrors, area: '' });
                    }}
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border ${
                      fieldErrors.area ? 'border-red-500' : 'border-[#CDE5F8] dark:border-slate-700'
                    } text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:border-[#087ED1]`}
                  />
                </div>
                {fieldErrors.area && (
                  <p className="text-[11px] text-red-500 mt-1">{fieldErrors.area}</p>
                )}
              </div>

              {/* Preferred Time Slot */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                  Preferred Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PREFERRED_TIME_SLOTS.map((slot) => {
                    const IconComp = slot.icon;
                    const isSelected = selectedTimeSlot === slot.id;
                    return (
                      <button
                        type="button"
                        key={slot.id}
                        onClick={() => {
                          setSelectedTimeSlot(slot.id);
                          setTimeFrom(slot.from);
                          setTimeTo(slot.to);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#087ED1]/10 border-[#087ED1] text-[#063B73] dark:text-sky-300 ring-2 ring-[#087ED1]/20'
                            : 'bg-white dark:bg-slate-900 border-[#CDE5F8] dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-[#087ED1]'
                        }`}
                      >
                        <IconComp className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-[#087ED1]' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-bold text-xs">{slot.title}</div>
                          <div className="text-[10.5px] text-slate-500 dark:text-slate-400">{slot.timeRange}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Optional Preferences (Budget, Gender, Days/Week) */}
            <div className="space-y-4 p-4.5 rounded-2xl bg-[#F8FAFD] dark:bg-[#0A203F] border border-[#E2EEF8] dark:border-[#153966]">
              <h3 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold flex items-center justify-center">4</span>
                <span>Optional Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Budget */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Monthly Budget (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹4,000 – ₹5,000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#087ED1]"
                  />
                </div>

                {/* Tutor Gender Preference */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Tutor Gender Preference
                  </label>
                  <select
                    value={preferredTutor}
                    onChange={(e) => setPreferredTutor(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="Female">Female Tutor</option>
                    <option value="Male">Male Tutor</option>
                  </select>
                </div>

                {/* Classes per Week */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                    Classes Per Week
                  </label>
                  <select
                    value={classesPerWeek}
                    onChange={(e) => setClassesPerWeek(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#087ED1]"
                  >
                    <option value={3}>3 Days / Week</option>
                    <option value={4}>4 Days / Week</option>
                    <option value={5}>5 Days / Week (Standard)</option>
                    <option value={6}>6 Days / Week</option>
                  </select>
                </div>
              </div>

              {/* Additional Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                  Additional Notes / Specific Needs
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. CBSE board student, preparing for 10th boards, weak in Trigonometry..."
                  value={additionalRequirements}
                  onChange={(e) => setAdditionalRequirements(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#087ED1]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#087ED1] to-[#063B73] hover:from-[#0993f3] hover:to-[#07468a] text-white font-extrabold text-sm shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.005] active:scale-[0.995]"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Tuition Requirement</span>
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 mt-2">
                🔒 Your requirement is strictly private. Our coordinator will verify it and contact you.
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
