import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import api from '../../services/api';
import { 
  ShieldAlert, 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function CopyrightReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCopyrightReports();
  }, [page]);

  const fetchCopyrightReports = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/copyright-reports?page=${page}`);
      setReports(res.data.reports.data || []);
      if (res.data.reports.last_page) {
        setTotalPages(res.data.reports.last_page);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId, actionType) => {
    const confirmMsg = actionType === 'resolved' 
      ? 'Mark this copyright / legal violation report as Resolved?'
      : 'Dismiss this legal violation report?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await api.post(`/admin/copyright-reports/${reportId}/resolve`, {
        action_type: actionType
      });
      alert(res.data.message);
      fetchCopyrightReports();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update report status.');
    }
  };

  return (
    <SidebarLayout type="admin">
      <div className="space-y-8 text-left animate-slide-up">
        
        {/* Title bar */}
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] block mb-1">Ecosystem Audit</span>
          <h1 className="text-3xl font-serif text-slate-900 dark:text-white font-bold leading-tight">Copyright Disputes</h1>
          <p className="text-xs text-slate-400 mt-1">Audit intellectual property complaints, fraudulent content reports, and resolve violations.</p>
        </div>

        {/* Listings */}
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-455">Syncing audit registry...</span>
          </div>
        ) : reports.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((rep) => {
                const isPending = rep.status === 'pending';
                const isResolved = rep.status === 'resolved';
                
                return (
                  <div 
                    key={rep.id}
                    className={`bg-white dark:bg-slate-900 border rounded-[2rem] p-6 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                      isPending ? 'border-rose-400 bg-rose-50/5' : 'border-slate-100 dark:border-slate-850'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="text-left">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Classification</span>
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rep.subject}</h4>
                        </div>
                        
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${
                          isPending 
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/20' 
                            : isResolved 
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' 
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        }`}>{rep.status}</span>
                      </div>

                      <div className="space-y-2 text-xs border-t border-b border-slate-50 dark:border-slate-850 py-3">
                        <div className="flex justify-between">
                          <span className="text-slate-405 font-medium">Reporter</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{rep.user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-405 font-medium">Target Event</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[200px]">{rep.event?.title}</span>
                        </div>
                        {rep.evidence_url && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-405 font-medium">Evidence Node</span>
                            <a 
                              href={rep.evidence_url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="font-bold text-rose-550 hover:underline flex items-center gap-1"
                            >
                              <span>View Evidence</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-655 dark:text-slate-400 text-xs leading-relaxed text-left whitespace-pre-line italic">
                        "{rep.description}"
                      </p>
                    </div>

                    {isPending && (
                      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                        <button 
                          onClick={() => handleResolve(rep.id, 'resolved')}
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-750 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-100"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Resolve Issue</span>
                        </button>
                        <button 
                          onClick={() => handleResolve(rep.id, 'dismissed')}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-750 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-105"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Dismiss report</span>
                        </button>
                      </div>
                    )}
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
            <ShieldAlert className="w-10 h-10 text-slate-350 mx-auto mb-4" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">No disputes logged</span>
            <p className="text-[11px] text-slate-450 mt-1.5 max-w-[240px] mx-auto leading-relaxed">
              No copyright infringements or legal violations are currently logged in the ecosystem.
            </p>
          </div>
        )}

      </div>
    </SidebarLayout>
  );
}
