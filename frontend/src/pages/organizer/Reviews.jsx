import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import api from '../../services/api';
import { 
  MessageSquare, 
  Star, 
  Check, 
  Trash2, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/organizer/reviews?page=${page}`);
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
      const res = await api.patch(`/organizer/reviews/${reviewId}/approve`);
      alert(res.data.message);
      // Reload reviews
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve review.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete / Reject this review permanently?')) return;
    try {
      const res = await api.delete(`/organizer/reviews/${reviewId}`);
      alert(res.data.message);
      // Reload reviews
      fetchReviews();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete review.');
    }
  };

  return (
    <SidebarLayout type="organizer">
      <div className="space-y-8 text-left animate-slide-up">
        
        {/* Title bar */}
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] block mb-1">RESONANCE AUDIT</span>
          <h1 className="text-3xl font-serif text-slate-900 dark:text-white font-bold leading-tight">Review Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">Audit and moderate attendee ratings and feedback comments for your events.</p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-455">Syncing reviews index...</span>
          </div>
        ) : reviews.length > 0 ? (
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
                      <div className="text-left">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Attendee</span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.user?.name || 'Anonymous User'}</h4>
                      </div>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                        isApproved 
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' 
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/20'
                      }`}>
                        {isApproved ? 'Approved' : 'Pending Curation'}
                      </span>
                    </div>

                    <div className="flex text-amber-450 gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`w-4 h-4 ${star <= rev.rating ? 'fill-current text-amber-450' : 'opacity-20 text-slate-350'}`} 
                        />
                      ))}
                    </div>

                    <div className="text-left space-y-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Bound Node</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{rev.event?.title}</p>
                    </div>

                    <p className="text-slate-650 dark:text-slate-400 text-xs md:text-sm leading-relaxed italic font-serif text-left">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                    {!isApproved && (
                      <button 
                        onClick={() => handleApprove(rev.id)}
                        className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-100"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Approve Resonance</span>
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(rev.id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isApproved ? 'Delete' : 'Reject'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-dashed rounded-3xl max-w-md mx-auto">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-4" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">No reviews logged</span>
            <p className="text-[11px] text-slate-450 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
              No attendee feedback reviews have been logged in your host workspace.
            </p>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
