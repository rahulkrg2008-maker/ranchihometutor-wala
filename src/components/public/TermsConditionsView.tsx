import React from 'react';
import { CheckCircle2, ArrowLeft, FileText } from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface TermsConditionsViewProps {
  settings: WebsiteSettings;
  onBackToHome: () => void;
}

export const TermsConditionsView: React.FC<TermsConditionsViewProps> = ({
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20 mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Simple, Practical Coordination Terms</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Terms & Conditions — RanchiHomeTutor Wala
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              Please read these concise guidelines before booking tuition or registering as a tutor.
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
            
            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                1. Coordination Service Role
              </h2>
              <p>
                RanchiHomeTutor operates as a personalized home tuition coordination service in Ranchi. We connect parents seeking academic assistance with independent educators registered on our platform.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                2. Accuracy of Information
              </h2>
              <p>
                All parents and educators must submit true, current, and verifiable information during form filling and registration. Providing misleading details may result in service cancellation.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                3. Verification & Assignment Protocol
              </h2>
              <p>
                All tutor background information (Aadhaar, educational certificates) is verified directly by the coordinator. Tutor matching is conducted personally by the Admin; parents cannot directly browse or choose from private tutor databases.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                4. Free Trial Demo Class
              </h2>
              <p>
                Parents are entitled to a trial demo session before confirming regular monthly classes. This allows evaluation of the teacher's communication, subject command, and punctuality.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                5. Responsible Conduct & Mutual Respect
              </h2>
              <p>
                Parents and tutors are expected to maintain professional, polite conduct, respect agreed teaching timings, and communicate any cancellations or rescheduling at least 24 hours in advance.
              </p>
            </div>

            <div>
              <h2 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                6. Questions & Dispute Resolution
              </h2>
              <p>
                In the rare event of dissatisfaction with an assigned tutor, parents can contact our coordinator directly for a free replacement within our network. Contact us on WhatsApp at <strong>{settings.whatsappNumber}</strong> or email <strong>{settings.email}</strong>.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h2 className="text-lg font-extrabold text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                7. Safety Policy (Tutors, Parents & Students)
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <h3 className="text-sm font-bold text-emerald-400 mb-1">Tutor Safety Policy</h3>
                  <p className="text-xs text-slate-300 mb-2 font-medium">
                    We want every tutor to be able to teach in a safe, respectful, and professional environment.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                    <li>Tutors should confirm the tuition location, timing, and basic details before visiting.</li>
                    <li>Tutors may refuse or leave a session if they feel unsafe or uncomfortable.</li>
                    <li>Tutors should maintain professional boundaries with students and family members.</li>
                    <li>Harassment, threats, abusive behavior, inappropriate communication, or unwanted physical contact are not permitted.</li>
                    <li>Tutors should not share a student's or family's private information, photographs, address, or personal details without appropriate permission.</li>
                    <li>Tutors should report serious safety concerns or inappropriate behavior to the platform.</li>
                    <li>Female tutors may choose reasonable safety preferences, such as suitable timings or having a family member/guardian present at the tuition location.</li>
                    <li>Tutors are responsible for using reasonable judgment regarding their own safety during private tuition sessions.</li>
                    <li>The platform only facilitates connections between tutors and parents/students and does not control private interactions between them.</li>
                    <li>For an immediate emergency, tutors should move to a safe location and contact local emergency services or a trusted person.</li>
                  </ul>
                  <p className="text-[11px] text-slate-400 mt-2 font-semibold">
                    By using the platform, tutors agree to follow these safety guidelines.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
                  <h3 className="text-sm font-bold text-sky-400 mb-1">Parent & Student Safety Policy</h3>
                  <p className="text-xs text-slate-300 mb-2 font-medium">
                    We want every tuition session to be safe, respectful, and professional.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
                    <li>Parents/guardians should be aware of the tutor's visit and tuition timings.</li>
                    <li>For students who are minors, parents/guardians are encouraged to remain present or nearby during home tuition.</li>
                    <li>Students and family members must treat tutors respectfully.</li>
                    <li>Harassment, threats, abusive behavior, inappropriate communication, or unwanted physical contact are not permitted.</li>
                    <li>Parents/students should not share the tutor's personal information, photographs, or contact details without appropriate permission.</li>
                    <li>If a parent or student feels unsafe or uncomfortable, they may end the session and report the matter to the platform.</li>
                    <li>Users are responsible for their own actions and safety during private tuition sessions.</li>
                    <li>The platform only facilitates connections between parents/students and tutors and does not control private interactions between them.</li>
                    <li>For an immediate emergency, contact local emergency services or a trusted person.</li>
                  </ul>
                  <p className="text-[11px] text-slate-400 mt-2 font-semibold">
                    By using the platform, parents, students, and family members agree to follow these safety guidelines.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
