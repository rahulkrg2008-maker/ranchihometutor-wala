import React from 'react';
import { ShieldCheck, ArrowLeft, AlertTriangle, UserCheck, HeartHandshake, Phone, MessageCircle } from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { getWhatsAppLink } from '../../services/storageService';

interface SafetyPolicyViewProps {
  settings: WebsiteSettings;
  onBackToHome: () => void;
}

export const SafetyPolicyView: React.FC<SafetyPolicyViewProps> = ({
  settings,
  onBackToHome,
}) => {
  const whatsappSafetyUrl = getWhatsAppLink(
    settings.whatsappNumber,
    'Hello Ranchi HomeTutor Wala Coordinator, I have an urgent safety inquiry or concern regarding a tuition session.'
  );

  return (
    <section className="py-12 sm:py-16 bg-slate-50 text-slate-800 min-h-[75vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button
          onClick={onBackToHome}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-100/70 hover:bg-sky-100 px-3.5 py-1.5 rounded-lg border border-sky-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white border border-sky-100 rounded-3xl p-6 sm:p-10 shadow-sm space-y-10">
          
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Safety & Professional Conduct Guidelines</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Safety Policy — Ranchi HomeTutor Wala
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We are dedicated to fostering safe, respectful, and transparent learning environments for all educators, parents, and students across Ranchi.
            </p>
          </div>

          {/* Section 1: Tutor Safety Policy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Tutor Safety Policy
                </h2>
                <p className="text-xs text-emerald-700 font-semibold">
                  For all registered home tutors & academic educators
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
              We want every tutor to be able to teach in a safe, respectful, and professional environment.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Tutors should confirm the tuition location, timing, and basic details before visiting.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Tutors may refuse or leave a session if they feel unsafe or uncomfortable.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Tutors should maintain professional boundaries with students and family members.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Harassment, threats, abusive behavior, inappropriate communication, or unwanted physical contact are not permitted.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Tutors should not share a student's or family's private information, photographs, address, or personal details without appropriate permission.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Tutors should report serious safety concerns or inappropriate behavior to the platform.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Female tutors may choose reasonable safety preferences, such as suitable timings or having a family member/guardian present at the tuition location.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>Tutors are responsible for using reasonable judgment regarding their own safety during private tuition sessions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>The platform only facilitates connections between tutors and parents/students and does not control private interactions between them.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>For an immediate emergency, tutors should move to a safe location and contact local emergency services or a trusted person.</span>
              </li>
            </ul>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold">
              By using the platform, tutors agree to follow these safety guidelines.
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Parent & Student Safety Policy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Parent & Student Safety Policy
                </h2>
                <p className="text-xs text-sky-700 font-semibold">
                  For all families, parents, guardians & students
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-700 font-medium leading-relaxed bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
              We want every tuition session to be safe, respectful, and professional.
            </p>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 pl-1">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>Parents/guardians should be aware of the tutor's visit and tuition timings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>For students who are minors, parents/guardians are encouraged to remain present or nearby during home tuition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>Students and family members must treat tutors respectfully.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>Harassment, threats, abusive behavior, inappropriate communication, or unwanted physical contact are not permitted.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>Parents/students should not share the tutor's personal information, photographs, or contact details without appropriate permission.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>If a parent or student feels unsafe or uncomfortable, they may end the session and report the matter to the platform.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>Users are responsible for their own actions and safety during private tuition sessions.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>The platform only facilitates connections between parents/students and tutors and does not control private interactions between them.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-600 mt-2 shrink-0" />
                <span>For an immediate emergency, contact local emergency services or a trusted person.</span>
              </li>
            </ul>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 font-semibold">
              By using the platform, parents, students, and family members agree to follow these safety guidelines.
            </div>
          </div>

          {/* Emergency & Support Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Coordinator Safety Helpline</span>
              </div>
              <p className="text-amber-800">
                To report inappropriate conduct or request coordinator support in Ranchi, contact us immediately.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:+91${settings.whatsappNumber}`}
                className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Phone className="w-3.5 h-3.5 text-amber-700" />
                <span>Call Helpline</span>
              </a>
              <a
                href={whatsappSafetyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Report</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
