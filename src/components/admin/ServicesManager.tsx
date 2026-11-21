import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen, X } from 'lucide-react';
import { ServiceItem } from '../../types';
import { StorageService } from '../../services/storageService';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface ServicesManagerProps {
  services: ServiceItem[];
  onShowNotification: (msg: string) => void;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({
  services,
  onShowNotification,
}) => {
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const handleToggleVisibility = (srv: ServiceItem) => {
    StorageService.updateService(srv.id, { isVisible: !srv.isVisible });
    onShowNotification(`Service "${srv.title}" is now ${!srv.isVisible ? 'Visible' : 'Hidden'}.`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    StorageService.deleteService(deleteTarget.id);
    onShowNotification(`Service "${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Service Offerings
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Services Management ({services.length})
          </h2>
          <p className="text-xs text-slate-400">
            Edit the services shown on the public RanchiHomeTutor website.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-2xl shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((srv) => (
          <div
            key={srv.id}
            className={`p-5 rounded-2xl border transition-all ${
              srv.isVisible
                ? 'bg-slate-900 border-slate-800'
                : 'bg-slate-950/60 border-slate-800/50 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="font-bold text-white text-sm">
                {srv.title}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                srv.isVisible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
              }`}>
                {srv.isVisible ? 'Active' : 'Hidden'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4 min-h-[48px]">
              {srv.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => setEditingService(srv)}
                className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-400 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleVisibility(srv)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                  title={srv.isVisible ? 'Hide from public site' : 'Show on public site'}
                >
                  {srv.isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setDeleteTarget({ id: srv.id, title: srv.title })}
                  className="p-1 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                StorageService.updateService(editingService.id, {
                  title: editingService.title,
                  description: editingService.description,
                });
                onShowNotification(`Updated "${editingService.title}"!`);
                setEditingService(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Service Description</label>
                <textarea
                  required
                  rows={4}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setEditingService(null)} className="px-4 py-2 bg-slate-800 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Service</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);

                StorageService.addService({
                  title: formData.get('title') as string,
                  description: formData.get('desc') as string,
                  icon: 'BookOpen',
                  isVisible: true,
                });

                onShowNotification('New service added!');
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Service Title</label>
                <input name="title" required placeholder="e.g. Crash Course / Board Prep" className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white" />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Service Description</label>
                <textarea name="desc" required rows={3} placeholder="Explain how this service benefits students in Ranchi..." className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white resize-none" />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-lg">Add Service</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Interactive Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete Service Offering"
        itemName={deleteTarget ? deleteTarget.title : ''}
        itemDetails="This service will be removed from the public website and your services portfolio."
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

    </div>
  );
};
