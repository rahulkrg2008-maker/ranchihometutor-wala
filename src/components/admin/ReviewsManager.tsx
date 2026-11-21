import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Plus, MessageSquare, X } from 'lucide-react';
import { Review, ReviewStatus } from '../../types';
import { StorageService } from '../../services/storageService';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface ReviewsManagerProps {
  reviews: Review[];
  onShowNotification: (msg: string) => void;
}

export const ReviewsManager: React.FC<ReviewsManagerProps> = ({
  reviews,
  onShowNotification,
}) => {
  const [filter, setFilter] = useState<'All' | ReviewStatus>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filteredReviews = reviews.filter((r) => {
    if (filter !== 'All' && r.status !== filter) return false;
    return true;
  });

  const handleUpdateStatus = (id: string, status: ReviewStatus) => {
    StorageService.updateReview(id, { status });
    onShowNotification(`Review status updated to ${status}.`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    StorageService.deleteReview(deleteTarget.id);
    onShowNotification(`Review from ${deleteTarget.name} deleted.`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Feedback Moderation
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Parent Reviews ({reviews.length} Total)
          </h2>
          <p className="text-xs text-slate-400">
            Control which verified parent reviews appear on the public website.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review (Manual)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-semibold cursor-pointer transition-all ${
              filter === st
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st} ({st === 'All' ? reviews.length : reviews.filter((r) => r.status === st).length})
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReviews.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-3xl">
            No reviews found in this category.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rev.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : rev.status === 'Pending'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic mb-3">
                  “{rev.comment}”
                </p>

                <div className="text-xs">
                  <strong className="text-white block">{rev.parentName}</strong>
                  <span className="text-slate-400 text-[11px] block">{rev.studentInfo}</span>
                  <span className="text-slate-500 text-[10px]">📍 {rev.locality}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center gap-1.5">
                  {rev.status !== 'Approved' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'Approved')}
                      className="px-2.5 py-1 bg-emerald-950 text-emerald-400 hover:bg-emerald-900 rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {rev.status !== 'Rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, 'Rejected')}
                      className="px-2.5 py-1 bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[11px] cursor-pointer"
                    >
                      Reject
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setDeleteTarget({ id: rev.id, name: `${rev.parentName} (${rev.locality})` })}
                  className="p-1 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  title="Delete Review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Add Review Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Parent Review</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                try {
                await StorageService.addReview({
                  parentName: formData.get('parentName') as string,
                  studentInfo: formData.get('studentInfo') as string || 'Parent in Ranchi',
                  locality: formData.get('locality') as string || 'Ranchi',
                  rating: Number(formData.get('rating') || 5),
                  comment: formData.get('comment') as string,
                });

                onShowNotification('Review created and approved!');
                setIsAddModalOpen(false);
                } catch (err: any) {
                  onShowNotification(err.message || 'Could not create review.');
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Parent Name</label>
                <input name="parentName" required className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Student Class / School</label>
                <input name="studentInfo" defaultValue="Parent of Class 10 student" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Locality in Ranchi</label>
                <input name="locality" defaultValue="Morabadi, Ranchi" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Rating (1 to 5)</label>
                <select name="rating" defaultValue="5" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Review Comment</label>
                <textarea name="comment" required rows={3} className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white resize-none" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">Save Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Interactive Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Parent Review"
        itemName={deleteTarget ? deleteTarget.name : ''}
        itemDetails="This review will be permanently deleted and will no longer appear on the website or in this moderation table."
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

    </div>
  );
};
