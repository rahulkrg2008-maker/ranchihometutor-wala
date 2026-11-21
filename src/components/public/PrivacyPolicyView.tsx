import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface PrivacyPolicyViewProps {
  settings: WebsiteSettings;
  onBackToHome: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  settings,
  onBackToHome,
}) => {
  return (
    <section className="py-16 bg-slate-950 text-white min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button
          onClick={onBackToHome}
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          
          <div className="border-b border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Simple, Transparent Privacy Commitment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Privacy Policy — RanchiHomeTutor Wala
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Last updated: September 2026 | Effective for all parents and tutors in Ranchi, Jharkhand.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
            
            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                1. Information We Collect
              </h2>
              <p>
                We collect only the essential details necessary for coordinating home tuition in Ranchi:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                <li><strong>From Parents:</strong> Student class, subjects required, locality in Ranchi, contact number, timing preference, and budget.</li>
                <li><strong>From Tutors:</strong> Full name, phone, email, educational qualifications, subjects, teaching experience, preferred localities, and verification documents (Aadhaar/PAN).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                2. Why We Collect Information
              </h2>
              <p>
                Your information is collected solely to match parents with verified, reliable tutors in their neighborhood and facilitate safe home tuition arrangements.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h2 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                3. Aadhaar & PAN Privacy (Strict Non-Disclosure)
              </h2>
              <p className="text-slate-300">
                Aadhaar and PAN details provided by tutors are collected <strong>exclusively for background identity verification</strong>. They are stored strictly in private coordinator storage and are <strong>NEVER displayed publicly, shared with parents, or sold to third parties</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                4. No Public Tutor Profiles
              </h2>
              <p>
                RanchiHomeTutor does not host a public directory or searchable list of educators. All tutor information stays securely inside the private Admin Panel managed directly by our coordinator.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                5. Data Protection & Deletion Requests
              </h2>
              <p>
                We implement industry-standard security practices to protect all user data. If any parent or tutor wishes to update or permanently delete their records from our database, you may simply message our coordinator on WhatsApp at <strong>{settings.whatsappNumber}</strong> or email <strong>{settings.email}</strong>.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                6. Contact for Privacy Questions
              </h2>
              <p>
                For any privacy concerns, reach out directly to:
                <br />
                <strong>RanchiHomeTutor Wala Coordination Desk</strong>
                <br />
                WhatsApp: +91 {settings.whatsappNumber} | Email: {settings.email}
                <br />
                {settings.officeAddress}, Ranchi, Jharkhand.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
