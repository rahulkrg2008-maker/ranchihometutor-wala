import React, { useState } from 'react';
import { Star, MessageSquare, Quote, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Review } from '../../types';
import { StorageService } from '../../services/storageService';

interface PublicReviewsProps {
  reviews: Review[];
  onShowNotification: (msg: string) => void;
}

export const PublicReviews: React.FC<PublicReviewsProps> = ({
  reviews,
  onShowNotification,
}) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [parentName, setParentName] = useState('');
  const [studentInfo, setStudentInfo] = useState('');
  const [locality, setLocality] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [validationError, setValidationError] = useState('');

  const approvedReviews = reviews.filter((r) => r.status === 'Approved');

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !comment.trim()) {
      setValidationError('Please fill in both your name and review comments.');
      return;
    }

    try {
      await StorageService.addReview({
        parentName: parentName.trim(),
        studentInfo: studentInfo.trim() || 'Parent in Ranchi',
        locality: locality.trim() || 'Ranchi',
        rating: rating,
        comment: comment.trim(),
      });
    } catch (err: any) {
      setValidationError(err.message || 'Could not submit your review. Please try again.');
      return;
    }

    onShowNotification('Thank you! Your feedback has been submitted for coordinator review.');
    setShowReviewModal(false);
    setParentName('');
    setStudentInfo('');
    setLocality('');
    setComment('');
    setValidationError('');
  };

  return (
    <section className="py-16 sm:py-24 bg-transparent text-[#063B73] dark:text-slate-100 border-b border-sky-200/40 dark:border-slate-800 relative overflow-hidden">
      
      {/* Background notebook grid */}
      <div className="absolute inset-0 bg-notebook-grid opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-14">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F4FAFF] dark:bg-slate-800 border border-[#E2EEF8] dark:border-slate-700 text-[#087ED1] dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#087ED1]" />
              <span>Parent Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063B73] dark:text-white tracking-tight">
              Words from Families in Ranchi
            </h2>
            <p className="text-sm text-[#54708F] dark:text-slate-300 mt-1 font-normal">
              Feedback from parents across Ranchi who arranged home tutors through Ranchi HomeTutor Wala.
            </p>
            <div className="font-handwriting text-lg text-[#087ED1] font-bold mt-1">
              "Dedicated teachers, happy students & peaceful parents"
            </div>
          </div>

          <button
            onClick={() => {
              setValidationError('');
              setShowReviewModal(true);
            }}
            className="px-5 py-3 bg-[#EAF6FF] hover:bg-[#d8edfc] dark:bg-slate-800 text-[#087ED1] dark:text-sky-300 border border-[#CDE5F8] dark:border-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition-colors shadow-2xs"
          >
            <MessageSquare className="w-4 h-4 text-[#087ED1]" />
            <span>Share Feedback</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-white border border-sky-100 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-4 h-4 text-sky-300" />
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-4">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-4 border-t border-sky-50">
                <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <span>{rev.parentName}</span>
                  <span title="Verified Parent">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {rev.studentInfo}
                </div>
                <div className="text-[10px] text-sky-600 font-medium mt-0.5">
                  📍 {rev.locality}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white border border-sky-100 rounded-3xl p-6 text-slate-900 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Share Your Experience</h3>
                <p className="text-xs text-slate-500">Your review will be verified by our coordinator before publication.</p>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {validationError}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pooja Verma"
                  value={parentName}
                  onChange={(e) => {
                    setParentName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Class / School</label>
                <input
                  type="text"
                  placeholder="e.g. Parent of Class 10 student, DPS Ranchi"
                  value={studentInfo}
                  onChange={(e) => setStudentInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Locality in Ranchi</label>
                <input
                  type="text"
                  placeholder="e.g. Bariatu / Morabadi / Lalpur"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setRating(num)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        rating >= num 
                          ? 'bg-amber-50 text-amber-500 border-amber-300' 
                          : 'bg-slate-50 text-slate-300 border-slate-200'
                      }`}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Experience / Review *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="How was your home tuition coordination experience?"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-sky-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
