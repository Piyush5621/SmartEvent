import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../components/SidebarLayout';
import api from '../../services/api';
import { ShieldAlert, Loader2, Link as LinkIcon, ExternalLink } from 'lucide-react';

export default function Copyrights() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/organizer/copyright-reports');
        setReports(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <SidebarLayout type="organizer">
      <div className="space-y-8 animate-slide-up text-left">
        <div className="pb-6 border-b border-slate-100 dark:border-slate-800">
          <span className="text-[9px] font-black text-[#4E7D5B] uppercase tracking-[0.2em] block mb-1">SECURITY & COMPLIANCE</span>
          <h1 className="text-3xl font-serif text-slate-900 dark:text-white font-bold leading-tight">Copyright & Dispute Log</h1>
          <p className="text-xs text-slate-400 mt-1">Review moderation strikes and copyright violations reported against your blueprints.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-[#4E7D5B]" /></div>
          ) : reports.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center">
              <ShieldAlert className="w-12 h-12 text-emerald-500/50 mx-auto mb-4" />
              <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">Clean Record</h3>
              <p className="text-xs text-slate-400 mt-2">No copyright or security disputes have been reported against your events.</p>
            </div>
          ) : (
            reports.map(report => (
              <div key={report.id} className="bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/30 rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                
                <div className="bg-rose-50 dark:bg-rose-950/30 p-4 rounded-2xl shrink-0">
                  <ShieldAlert className="w-8 h-8 text-rose-500" />
                </div>
                
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500">
                      ID: #{report.id}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${
                      report.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      report.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {report.status}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold ml-auto">{report.created_at}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-serif font-bold text-slate-900 dark:text-white">{report.subject}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4E7D5B] mt-1">Target: {report.event_name}</p>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                    "{report.description}"
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Reported by: {report.reporter_name}
                    </div>
                    {report.evidence_url && (
                      <a href={report.evidence_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-600">
                        <LinkIcon className="w-3.5 h-3.5" />
                        View Evidence <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
