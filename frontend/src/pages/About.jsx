import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Heart, Layers, Zap, Shield, BarChart3 } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6 md:px-12 bg-[#FAF9F5] dark:bg-slate-900/50 overflow-hidden relative border-b border-slate-100 dark:border-slate-800">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#4E7D5B]/5 border border-[#4E7D5B]/10 mb-10">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7D5B]">THE PHILOSOPHY</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-serif tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-12 max-w-5xl mx-auto font-bold">
            Architecting the <span className="italic text-[#4E7D5B] font-serif font-normal">resonance</span> of human connection.
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-serif italic leading-relaxed">
            "We don't just build software for events. We cultivate the digital soil where intentional gatherings take root and flourish."
          </p>
        </div>
      </section>

      {/* The Mission */}
      <section className="py-32 px-6 md:px-12 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="relative">
            <div className="premium-card aspect-square rounded-[4rem] overflow-hidden shadow-3xl shadow-primary/5 group">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Gathering" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>
            <div className="absolute -bottom-12 -right-12 bg-[#FDFBF7] dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 hidden md:block">
              <div className="text-4xl font-serif text-slate-900 dark:text-white mb-2 font-bold">2024</div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ESTABLISHED AS THE<br />GROUNDED ECOSYSTEM</div>
            </div>
          </div>
          <div className="text-left">
            <span className="text-[#4E7D5B] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">ROOTED IN PURPOSE</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-10 text-slate-900 dark:text-white leading-tight font-bold">Beyond the <span className="italic text-[#4E7D5B] font-serif font-normal">transaction</span>.</h2>
            <p className="text-lg text-slate-655 dark:text-slate-400 mb-10 leading-relaxed font-serif italic">
              SmartEvent emerged from a singular observation: that digital convenience often comes at the cost of genuine resonance. Our mission is to bridge this gap by providing high-premium architectural tools for experiences that matter.
            </p>
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-[#4E7D5B]/5 dark:bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-[#4E7D5B] transition-all duration-500">
                  <Heart className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-slate-900 dark:text-white mb-2 font-bold">Intentionality over Scale</h4>
                  <p className="text-sm text-slate-500 italic font-serif">We prioritize the depth of the gathering over the breadth of the audience.</p>
                </div>
              </div>
              <div className="flex gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-[#4E7D5B]/5 dark:bg-slate-900 flex items-center justify-center shrink-0 group-hover:bg-[#4E7D5B] transition-all duration-500">
                  <Layers className="w-5 h-5 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h4 className="font-serif text-xl text-slate-900 dark:text-white mb-2 font-bold">Visual Transparency</h4>
                  <p className="text-sm text-slate-500 italic font-serif">A clean, high-contrast UI system that breathes and allows connection to flow.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ecosystem Pillars */}
      <section className="py-32 px-6 md:px-12 bg-[#FAF9F5] dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#4E7D5B] text-[10px] font-black uppercase tracking-[0.4em] mb-6 block">THE PILLARS</span>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white leading-tight font-bold">Built on solid <span className="italic text-[#4E7D5B] font-serif font-normal">soil</span>.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="premium-card p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] hover:shadow-2xl hover:shadow-[#4E7D5B]/5 transition-all duration-700">
              <div className="w-16 h-16 bg-[#4E7D5B] rounded-[1.5rem] flex items-center justify-center text-white mb-10 shadow-xl shadow-[#4E7D5B]/20">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-6 font-bold">Frictionless Pulse</h3>
              <p className="text-slate-500 dark:text-slate-400 font-serif italic text-base leading-relaxed">
                From discovery to identity verification, every operational node is optimized for speed and cinematic clarity.
              </p>
            </div>
            
            <div className="premium-card p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] hover:shadow-2xl hover:shadow-[#4E7D5B]/5 transition-all duration-700">
              <div className="w-16 h-16 bg-[#4E7D5B] rounded-[1.5rem] flex items-center justify-center text-white mb-10 shadow-xl shadow-[#4E7D5B]/20">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-6 font-bold">Absolute Integrity</h3>
              <p className="text-slate-500 dark:text-slate-400 font-serif italic text-base leading-relaxed">
                Our governance protocols ensure every financial yield and resident identity is protected within the ecosystem.
              </p>
            </div>

            <div className="premium-card p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] hover:shadow-2xl hover:shadow-[#4E7D5B]/5 transition-all duration-700">
              <div className="w-16 h-16 bg-[#4E7D5B] rounded-[1.5rem] flex items-center justify-center text-white mb-10 shadow-xl shadow-[#4E7D5B]/20">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-slate-900 dark:text-white mb-6 font-bold">Resonance Insights</h3>
              <p className="text-slate-500 dark:text-slate-400 font-serif italic text-base leading-relaxed">
                Understand your impact with deep-resonance data that tracks engagement, feedback, and architectural health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 md:px-12 text-center bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto bg-slate-900 dark:bg-slate-900 border border-white/5 p-20 rounded-[4rem] text-white shadow-3xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-serif mb-10 leading-tight font-bold">Join the <span className="text-[#4E7D5B] italic font-serif font-normal">gathering</span> architects.</h2>
            <p className="text-xl text-slate-400 mb-14 font-serif italic">Ready to cultivate your first intentional experience?</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link to="/register" className="btn-primary px-16 py-6 text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl shadow-primary/20">
                START THE JOURNEY
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
