import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { Mail, Phone, MapPin, Activity, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      // In Sanctum API structures, public routes are configured at base level
      const res = await api.post('/contact', { name, email, message });
      setSuccess(res.data.message);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to dispatch connection request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 md:px-12 bg-[#FAF9F5] dark:bg-slate-900/50 overflow-hidden relative border-b border-slate-100 dark:border-slate-800 text-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#4E7D5B]/5 border border-[#4E7D5B]/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7D5B]">NODE CONNECTION</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-12 max-w-4xl mx-auto font-bold font-serif">
            Initiate a <span className="italic text-[#4E7D5B] font-serif font-normal">direct</span> sync.
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-serif italic leading-relaxed">
            "Whether you're an architect or a resident, we're here to ensure the connection remains grounded."
          </p>
        </div>
      </section>

      {/* Contact hubs & Form */}
      <section className="py-32 px-6 md:px-12 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
            
            {/* Info Panel */}
            <div className="premium-card p-12 bg-slate-900 dark:bg-slate-900 border border-white/5 text-white rounded-[3rem] relative overflow-hidden flex flex-col shadow-3xl shadow-primary/10 text-left">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 flex-1">
                <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-12 block">COORDINATION POINTS</span>
                <h3 className="text-4xl font-serif mb-12 leading-tight font-bold">Ecosystem <span className="italic text-[#4E7D5B] font-serif font-normal">Hubs</span>.</h3>
                
                <div className="space-y-12">
                  <div className="flex items-start gap-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 group-hover:bg-[#4E7D5B] group-hover:text-white transition-all duration-500">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Digital Identity Sync</span>
                      <span className="text-xl font-serif italic">support@smartevent.com</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 group-hover:bg-[#4E7D5B] group-hover:text-white transition-all duration-500">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Operational Pulse</span>
                      <span className="text-xl font-serif italic">+91 (800) 123-4567</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-8 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary border border-white/5 group-hover:bg-[#4E7D5B] group-hover:text-white transition-all duration-500">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Physical Sanctuary</span>
                      <span className="text-xl font-serif italic leading-relaxed">123 Event St, Mumbai,<br />MH 400001</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-12 border-t border-white/5 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
                Monitoring Connection Quality
              </div>
            </div>

            {/* Form Panel */}
            <div className="premium-card p-12 md:p-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] shadow-sm text-left">
              {success && (
                <div className="mb-12 bg-primary/10 border border-primary/20 text-primary px-8 py-5 rounded-2xl flex items-center gap-4 animate-fade-in">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{success}</p>
                </div>
              )}

              {error && (
                <div className="mb-12 bg-rose-50 text-rose-700 border border-rose-100 px-8 py-5 rounded-2xl text-xs font-bold uppercase tracking-wider text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 font-bold">Resident Identity (Name)</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Julian Architect"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 font-bold">Identity Endpoint (Email)</label>
                  <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="julian@ecosystem.com"
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-205 outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 font-bold">The Reflection (Message)</label>
                  <textarea 
                    rows="5" 
                    required 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe the nature of your connection request..."
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-205 outline-none"
                  ></textarea>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full py-5 text-xs font-black uppercase tracking-[0.25em] shadow-lg shadow-[#4E7D5B]/20 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'DISPATCHING...' : 'DISPATCH REQUEST'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
