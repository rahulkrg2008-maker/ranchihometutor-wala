import React, { useState } from 'react';
import { 
  MessageCircle, 
  Instagram, 
  Mail, 
  MapPin, 
  Send, 
  Phone, 
  Sparkles,
  Check
} from 'lucide-react';
import { WebsiteSettings } from '../../types';
import { getWhatsAppLink } from '../../services/storageService';
import { 
  PencilSketch, 
  DoodleStar, 
  HandwrittenNote,
  DeskNotebookEnvelopeComposition,
  CurvedWaveDivider
} from './HandDrawnSketches';

interface ContactSectionProps {
  settings: WebsiteSettings;
  onShowNotification: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onShowNotification,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const whatsappUrl = getWhatsAppLink(
    settings.whatsappNumber,
    `Hello Ranchi HomeTutor Wala, I have an inquiry about home tuition services in Ranchi.`
  );

  const instagramUrl = settings.instagramProfile.startsWith('http')
    ? settings.instagramProfile
    : `https://www.instagram.com/${settings.instagramProfile}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      setValidationError('Please fill in all contact fields.');
      return;
    }

    const encodedText = `*Inquiry via Ranchi HomeTutor Wala Website*%0A%0A*Name:* ${encodeURIComponent(name.trim())}%0A*Phone:* ${encodeURIComponent(phone.trim())}%0A*Message:* ${encodeURIComponent(message.trim())}`;
    const fullWaUrl = `https://wa.me/91${settings.whatsappNumber}?text=${encodedText}`;

    setSubmitted(true);
    setValidationError('');
    onShowNotification('Inquiry ready! Redirecting to WhatsApp...');

    setTimeout(() => {
      window.open(fullWaUrl, '_blank');
      setName('');
      setPhone('');
      setMessage('');
      setSubmitted(false);
    }, 500);
  };

  return (
    <section id="contact-section" className="relative py-16 sm:py-24 bg-transparent text-[#063B73] dark:text-slate-100 border-b border-sky-200/40 dark:border-slate-800 scroll-mt-20 overflow-hidden">
      
      {/* Background notebook grid */}
      <div className="absolute inset-0 bg-notebook-grid opacity-20 pointer-events-none -z-0" />

      {/* Hand-drawn sketch */}
      <div className="hidden lg:block absolute bottom-12 right-12 opacity-30 pointer-events-none rotate-12">
        <PencilSketch className="w-12 h-12 text-[#087ED1]" />
      </div>

      <div id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-[#CDE5F8] dark:border-slate-700 text-[#087ED1] dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs">
            <DoodleStar className="w-3.5 h-3.5 text-[#087ED1]" />
            <span>Direct Friendly Contact</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063B73] dark:text-white tracking-tight">
            Get in Touch With Us
          </h2>

          <p className="text-base sm:text-lg text-[#54708F] dark:text-slate-300 mt-3 font-normal">
            Reach out via phone, WhatsApp, Instagram, or email. We are here to help parents and tutors across Ranchi.
          </p>

          <div className="mt-1">
            <HandwrittenNote className="text-base font-semibold text-[#087ED1]">
              "Quick, human response from your local Ranchi coordinator"
            </HandwrittenNote>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details & Direct Action Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Phone Call Card */}
            <a
              href={`tel:+91${settings.whatsappNumber}`}
              className="p-5 rounded-[22px] bg-white dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 hover:border-[#087ED1]/50 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#087ED1] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Phone className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="text-xs text-[#087ED1] font-bold">Direct Phone Call Helpline</div>
                <div className="text-lg font-bold text-[#063B73] dark:text-white group-hover:text-[#087ED1] transition-colors">
                  +91 {settings.whatsappNumber}
                </div>
                <div className="text-[11px] text-[#54708F] font-semibold mt-0.5">
                  Tap to Call Coordinator Now →
                </div>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-[22px] bg-white dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 hover:border-[#18A957]/50 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#18A957] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <MessageCircle className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="text-xs text-[#18A957] font-bold">WhatsApp Helpline (24x7)</div>
                <div className="text-lg font-bold text-[#063B73] dark:text-white group-hover:text-[#18A957] transition-colors">
                  +91 {settings.whatsappNumber}
                </div>
                <div className="text-[11px] text-[#54708F] font-semibold mt-0.5">
                  Click to Chat on WhatsApp →
                </div>
              </div>
            </a>

            {/* Instagram Card */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-[22px] bg-white dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 hover:border-pink-300 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-xs">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs text-pink-600 font-bold">Official Instagram</div>
                <div className="text-base font-bold text-[#063B73] dark:text-white group-hover:text-pink-600 transition-colors">
                  @{settings.instagramProfile.replace('https://www.instagram.com/', '').replace('/', '')}
                </div>
                <div className="text-[11px] text-[#54708F] font-semibold mt-0.5">
                  Follow & DM on Instagram →
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${settings.email}`}
              className="p-5 rounded-[22px] bg-white dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 hover:border-[#087ED1]/50 hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EAF6FF] text-[#087ED1] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Mail className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="text-xs text-[#087ED1] font-bold">Email Inquiries</div>
                <div className="text-sm sm:text-base font-bold text-[#063B73] dark:text-white group-hover:text-[#087ED1] transition-colors break-all">
                  {settings.email}
                </div>
                <div className="text-[11px] text-[#54708F] font-semibold mt-0.5">
                  Send Email to Coordinator →
                </div>
              </div>
            </a>

            {/* Location Card */}
            <div className="p-5 rounded-[22px] bg-[#EAF6FF]/80 dark:bg-slate-800/80 border border-[#CDE5F8] dark:border-slate-700 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 text-[#087ED1] flex items-center justify-center shrink-0 shadow-2xs">
                <MapPin className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <div className="text-xs text-[#087ED1] font-bold">Office & City Hub</div>
                <div className="text-sm font-bold text-[#063B73] dark:text-white">
                  {settings.officeAddress || `${settings.city}, ${settings.state}, India`}
                </div>
                <div className="text-[11px] text-[#54708F] mt-0.5">
                  Serving Morabadi, Bariatu, Lalpur, Doranda, Harmu & all Ranchi
                </div>
              </div>
            </div>

          </div>

          {/* Contact / Query Form Styled as Open Inquiry Ledger Page */}
          <div className="lg:col-span-7 bg-white/95 dark:bg-slate-800/95 rounded-[28px] border-2 border-[#CDE5F8] dark:border-slate-700 p-6 sm:p-8 shadow-md relative overflow-hidden bg-notebook-lines">
            
            {/* Top Binder Clip Bar / Inquiry Ledger Header */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#087ED1] via-[#063B73] to-[#087ED1] opacity-90" />
            
            {/* Red Margin Line down left */}
            <div className="absolute top-3 bottom-0 left-5 w-[1.5px] bg-rose-400/50 pointer-events-none" />

            {/* Subtle Paper Dog-ear Fold at Bottom-Right */}
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#EAF6FF] dark:bg-slate-700 border-t border-l border-[#CDE5F8] dark:border-slate-600 rounded-tl-lg pointer-events-none" />

            <div className="pl-4 pt-1">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md bg-[#EAF6FF] dark:bg-slate-700 text-[#087ED1] dark:text-sky-300 text-[11px] font-mono font-bold uppercase tracking-wider border border-[#CDE5F8] dark:border-slate-600">
                  Assignment & Inquiry Slip • Ranchi
                </span>
                <span className="font-handwriting text-sm font-bold text-[#087ED1] dark:text-sky-300 hidden sm:inline">
                  "Quick 2-Hr Response"
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-[#063B73] dark:text-white">
                  Send a Message
                </h3>
                <p className="text-xs sm:text-sm text-[#54708F] dark:text-slate-300 mt-1">
                  Have a quick question about tuition fees, tutor availability, or syllabus? Write to us and we'll reply promptly.
                </p>
              </div>

              {validationError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {validationError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#063B73] dark:text-slate-200 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sanjay Verma"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#F4FAFF] dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#12345B] dark:text-white placeholder-[#54708F]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#087ED1]/20 focus:border-[#087ED1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#063B73] dark:text-slate-200 mb-1.5">
                    Mobile Number / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9835123456"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#F4FAFF] dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#12345B] dark:text-white placeholder-[#54708F]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#087ED1]/20 focus:border-[#087ED1]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#063B73] dark:text-slate-200 mb-1.5">
                    Your Message or Tuition Query *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what class, subject, or question you have in Ranchi..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[#F4FAFF] dark:bg-slate-900 border border-[#CDE5F8] dark:border-slate-700 text-[#12345B] dark:text-white placeholder-[#54708F]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#087ED1]/20 focus:border-[#087ED1] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#087ED1] hover:bg-[#066bb3] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-[#087ED1]/25 transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Send Query via WhatsApp</span>
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-[#F0F7FD] dark:border-slate-700 flex items-center justify-center gap-2 text-xs text-[#54708F]">
                <Check className="w-3.5 h-3.5 text-[#18A957]" />
                <span>We never share your contact details with unauthorized third parties.</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Wave Transition at the bottom */}
      <div className="mt-16">
        <CurvedWaveDivider fillColor="fill-transparent" />
      </div>

    </section>
  );
};
