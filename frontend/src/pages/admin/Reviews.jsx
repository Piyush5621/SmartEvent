import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import api from '../../services/api';
import { 
  MessageSquare, 
  Star, 
  Check, 
  Trash2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGlobalReviews();
  }, [page]);

  const fetchGlobalReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/reviews?page=${page}`);
      setReviews(res.data.reviews.data || []);
      if (res.data.reviews.last_page) {
        setTotalPages(res.data.reviews.last_page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const res = await api.post(`/admin/reviews/${reviewId}/approve`);
      alert(res.data.message);
      fetchGlobalReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve review.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete/Reject this review permanently from the system?')) return;
    try {
      const res = await api.delete(`/admin/reviews/${reviewId}`);
      alert(res.data.message);
      fetchGlobalReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  return (
    <SidebarLayout type="admin">
      <div className="space-y-8 text-left animate-slide-up">
        
        {/* Title bar */}
        <div className="pb-6 border-b border-slate-105 dark:border-slate-805">
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] block mb-1">GLOBAL CONTENT RESONANCE</span>
          <h1 className="text-3xl font-serif text-slate-900 dark:text-white font-bold leading-tight">Reviews Moderation</h1>
          <p className="text-xs text-slate-450 mt-1">Audit, moderate, approve, or delete participant reviews globally across all events.</p>
        </div>

        {/* Reviews */}
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-455">Syncing global reviews...</span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => {
                const isApproved = !!rev.is_approved;
                return (
                  <div 
                    key={rev.id}
                    className={`bg-white dark:bg-slate-900 border rounded-[2rem] p-6 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                      isApproved ? 'border-slate-100 dark:border-slate-850' : 'border-amber-400 bg-amber-50/5'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Author</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.user?.name}</h4>
                        </div>
                        
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          isApproved 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/20'
                        }`}>{isApproved ? 'Approved' : 'Pending Moderation'}</span>
                      </div>

                      <div className="flex text-amber-450 gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-4 h-4 ${star <= rev.rating ? 'fill-current text-amber-450' : 'opacity-20 text-slate-350'}`} 
                          />
                        ))}
                      </div>

                      <div className="text-left space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Bound Node Event</span>
                        <p className="text-xs font-bold text-slate-805 dark:text-slate-200 line-clamp-1">{rev.event?.title}</p>
                      </div>

                      <p className="text-slate-655 dark:text-slate-400 text-xs md:text-sm leading-relaxed italic font-serif text-left">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                      {!isApproved && (
                        <button 
                          onClick={() => handleApprove(rev.id)}
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-750 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-100"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Approve Review</span>
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(rev.id)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-105"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Review</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black uppercase tracking-widest text-slate-500 select-none">
                  Page {page} of {totalPages}
                </span>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 border border-slate-100 dark:border-slate-800 rounded-xl hover:text-primary transition-colors disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-dashed rounded-3xl max-w-md mx-auto">
            <MessageSquare className="w-10 h-10 text-slate-350 mx-auto mb-4" />
            <span className="text-xs font-bold text-slate-405 uppercase tracking-widest block">No reviews logged</span>
            <p className="text-[11px] text-slate-450 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
              No attendee feedback reviews have been logged in the system yet.
            </p>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
