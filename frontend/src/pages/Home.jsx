import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { 
  Ticket, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Compass, 
  Search, 
  Star,
  Hourglass,
  Layout,
  Plus,
  Verified
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Carousel State
  const [activeSlide, setActiveSlide] = useState(0);

  // Ticket Widget State
  const [ticketStep, setTicketStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState('regular');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Waitlist Simulator State
  const [queue, setQueue] = useState([
    { name: 'Piyush Kumar', status: 'Waitlisted', email: 'piyush@example.com' },
    { name: 'Sarah Connor', status: 'Waitlisted', email: 'sarah@skynet.com' }
  ]);
  const [released, setReleased] = useState(false);

  // Spatial Tab State
  const [activeTab, setActiveTab] = useState('waitlists');

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await api.get('/events');
        setEvents(response.data.data || []);
      } catch (err) {
        console.error('Failed to load home events', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  // Auto slide interval
  useEffect(() => {
    if (events.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % Math.min(events.length, 4));
    }, 6000);
    return () => clearInterval(interval);
  }, [events]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSimulatedBooking = () => {
    if (ticketStep === 1) {
      setTicketStep(2);
    } else if (ticketStep === 2) {
      if (guestName && guestEmail) {
        setTicketStep(3);
        setBookingSuccess(true);
      }
    } else if (ticketStep === 3) {
      setTicketStep(1);
      setBookingSuccess(false);
      setGuestName('');
      setGuestEmail('');
    }
  };

  const toggleWaitlistRelease = () => {
    if (!released) {
      const updated = [...queue];
      updated[0].status = 'Booked';
      setQueue(updated);
      setReleased(true);
    } else {
      setQueue([
        { name: 'Piyush Kumar', status: 'Waitlisted', email: 'piyush@example.com' },
        { name: 'Sarah Connor', status: 'Waitlisted', email: 'sarah@skynet.com' }
      ]);
      setReleased(false);
    }
  };

  const featuredEvents = events.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#4E7D5B] selection:text-white">
      <Navbar />

      {/* Cinematic Ambient Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#4E7D5B]/5 dark:bg-[#4E7D5B]/2 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] left-[2%] w-[500px] h-[500px] bg-amber-500/3 dark:bg-[#4E7D5B]/3 rounded-full blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-36 md:pt-48 pb-20 flex items-center overflow-hidden z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left Panel: Simulated Interactive Pass Booking */}
            <div className="relative w-full order-2 lg:order-1 animate-slide-up">
              <div className="relative w-full max-w-lg mx-auto bg-[#4E7D5B] rounded-[3rem] p-6 shadow-2xl overflow-hidden flex flex-col min-h-[580px]">
                
                {/* Monochromatic background image */}
                <div className="relative h-[280px] w-full rounded-[2.2rem] overflow-hidden group shadow-lg">
                  <img 
                    src="/tech_summit_lobby.png" 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540575861501-7ad05823c23d?auto=format&fit=crop&q=80&w=1000' }}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-105 grayscale opacity-90" 
                    alt="Global Tech Summit Lobby" 
                  />
                  <div className="absolute inset-0 bg-[#4E7D5B]/30 mix-blend-multiply"></div>
                  
                  {/* Status overlay */}
                  <div className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md shadow-md border border-white/20 dark:border-slate-800/20">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4E7D5B] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4E7D5B]"></span>
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#4E7D5B] dark:text-[#88c599]">LIVE SUMMIT SUMMONS</span>
                  </div>
                </div>

                {/* Multi-step progress details */}
                <div className="flex-1 flex flex-col justify-between pt-6 px-4">
                  
                  <div className="w-full flex items-center justify-between pb-6 border-b border-white/10">
                    <button onClick={() => !bookingSuccess && setTicketStep(1)} className="flex items-center gap-2 outline-none text-left cursor-pointer">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-colors ${
                        ticketStep >= 1 ? 'bg-white text-[#4E7D5B]' : 'border border-white/40 text-white'
                      }`}>1</div>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Tickets</span>
                    </button>
                    <div className="flex-1 h-px bg-white/10 mx-3"></div>
                    <button onClick={() => !bookingSuccess && guestName !== '' && setTicketStep(2)} className={`flex items-center gap-2 outline-none text-left ${guestName === '' ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-colors ${
                        ticketStep >= 2 ? 'bg-white text-[#4E7D5B]' : 'border border-white/40 text-white'
                      }`}>2</div>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Details</span>
                    </button>
                    <div className="flex-1 h-px bg-white/10 mx-3"></div>
                    <div className={`flex items-center gap-2 ${ticketStep < 3 ? 'opacity-40' : ''}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-colors ${
                        ticketStep >= 3 ? 'bg-white text-[#4E7D5B]' : 'border border-white/40 text-white'
                      }`}>3</div>
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">Pass</span>
                    </div>
                  </div>

                  {/* Wizard content */}
                  <div className="pt-6 flex-1 flex flex-col justify-center text-left">
                    {ticketStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-white mb-2 leading-tight tracking-tight">Select Experience Tier</h3>
                        <p className="text-[11px] text-white/60 mb-4">Book your seat at the Global Tech Summit 2026.</p>
                        
                        <div className="space-y-3">
                          <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer hover:bg-white/10 transition-colors ${
                            selectedTier === 'regular' ? 'border-white bg-white/15' : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input type="radio" value="regular" checked={selectedTier === 'regular'} onChange={() => setSelectedTier('regular')} className="hidden" />
                              <span className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center">
                                {selectedTier === 'regular' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                              </span>
                              <div>
                                <span className="block text-xs font-bold text-white uppercase tracking-wider">Regular Pass</span>
                                <span className="text-[9px] text-white/50">Full access to tracks & lobbies</span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-white">₹1,499</span>
                          </label>

                          <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer hover:bg-white/10 transition-colors ${
                            selectedTier === 'vip' ? 'border-white bg-white/15' : 'border-white/10 bg-white/5'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input type="radio" value="vip" checked={selectedTier === 'vip'} onChange={() => setSelectedTier('vip')} className="hidden" />
                              <span className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center">
                                {selectedTier === 'vip' && <span className="w-2 h-2 rounded-full bg-white"></span>}
                              </span>
                              <div>
                                <span className="block text-xs font-bold text-white uppercase tracking-wider">VIP Key Access</span>
                                <span className="text-[9px] text-[#A7F3D0] font-black uppercase tracking-widest">24 Tickets Left</span>
                              </div>
                            </div>
                            <span className="text-xs font-black text-white">₹4,999</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {ticketStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-2xl font-serif text-white mb-2 leading-tight tracking-tight">Attendee Information</h3>
                        <p className="text-[11px] text-white/60 mb-4">Provide details for your secure QR access key.</p>
                        
                        <div className="space-y-3">
                          <input 
                            type="text" 
                            placeholder="Attendee Name" 
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-white/30 focus:border-white focus:bg-white/10 outline-none transition-colors" 
                          />
                          <input 
                            type="email" 
                            placeholder="Your Email Address" 
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-full text-xs text-white placeholder:text-white/30 focus:border-white focus:bg-white/10 outline-none transition-colors" 
                          />
                        </div>
                      </div>
                    )}

                    {ticketStep === 3 && (
                      <div className="space-y-4 text-center">
                        <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center p-3 border-2 border-emerald-400 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="3" height="3" rx="0.5" />
                            <rect x="17" y="17" width="4" height="4" rx="0.5" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-serif text-white leading-tight tracking-tight">Booking Secured!</h3>
                        <div className="text-[10px] uppercase font-black tracking-widest text-[#A7F3D0]">REF: SE-2026-T402</div>
                        <p className="text-[11px] text-white/70 max-w-xs mx-auto leading-relaxed">
                          Welcome, <span className="font-bold text-white">{guestName}</span>! Your QR code has been generated and sent to <span class="font-bold text-white">{guestEmail}</span>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-full pb-2 pt-6">
                    <button 
                      onClick={handleSimulatedBooking}
                      disabled={ticketStep === 2 && (!guestName || !guestEmail)}
                      className={`w-full bg-white text-[#4E7D5B] py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all outline-none cursor-pointer ${
                        ticketStep === 2 && (!guestName || !guestEmail) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <span>{ticketStep === 1 ? 'Continue to Details' : (ticketStep === 2 ? 'Generate Secure Pass' : 'Book Another Seat')}</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Panel: Content */}
            <div className="flex flex-col justify-center order-1 lg:order-2 text-left">
              <div className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-[#4E7D5B]/5 border border-[#4E7D5B]/10 w-fit mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4E7D5B]"></span>
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#4E7D5B] dark:text-[#8ac99d]">AI-Powered Ticketing & Registrations</span>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-slate-900 dark:text-white leading-[1.08] tracking-tighter mb-8">
                Host <br />
                <span className="text-[#4E7D5B] italic relative inline-block">Beautiful, Seamless</span> <br />
                Experiences.
              </h1>

              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mb-12">
                SmartEvent coordinates tickets, waitlists, secure QR access check-ins, and payments globally. Empowering premium organizers with automated registration workflows.
              </p>

              {/* Direct Search Bar */}
              <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#4E7D5B]/10 via-[#4E7D5B]/30 to-[#4E7D5B]/10 rounded-full blur opacity-25 group-focus-within:opacity-45 transition-all"></div>
                <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-800 shadow-xl p-2 overflow-hidden">
                  <div className="pl-5 text-slate-350">
                    <Search className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search experiences, cities..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                    className="flex-1 bg-transparent border-none text-sm py-4 px-4 placeholder:text-slate-300 text-slate-800 dark:text-slate-100 font-medium outline-none focus:ring-0" 
                  />
                  <button type="submit" className="bg-[#4E7D5B] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-md hover:scale-[1.02] transition-all cursor-pointer">
                    Scan Ecosystem
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Promoted / Features Slideshow */}
      {featuredEvents.length > 0 && (
        <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[21/10] md:aspect-[21/8] lg:aspect-[21/7] shadow-2xl border border-slate-100 dark:border-slate-800 bg-slate-900 group">
            
            {/* Carousel Container */}
            <div className="w-full h-full relative">
              {featuredEvents.map((evt, idx) => (
                <div 
                  key={evt.id}
                  className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ${
                    idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  style={{ backgroundImage: `url('${evt.banner}')` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col justify-end h-full text-left space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3.5 py-1 rounded-full bg-[#4E7D5B] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#4E7D5B]/30">
                        Featured Gathering
                      </span>
                      <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                        {evt.category}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white font-bold leading-tight tracking-tight line-clamp-2">
                      {evt.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-xs md:text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#4E7D5B]" />
                        {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#4E7D5B]" />
                        {evt.venue ? evt.venue.city : 'Online'}
                      </span>
                    </div>

                    <div className="pt-3">
                      <Link to={`/events/${evt.slug}`} className="inline-flex items-center gap-2 bg-[#4E7D5B] hover:bg-[#3D6449] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-[#4E7D5B]/20">
                        Book Pass &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Selectors */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm z-20 border border-white/5">
              {featuredEvents.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-500 rounded-full cursor-pointer ${
                    activeSlide === idx ? 'w-5 h-1.5 bg-[#4E7D5B]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/85'
                  }`}
                ></button>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Features & Simulator Section */}
      <section id="features" className="py-32 md:py-48 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-24">
            <span className="text-[#4E7D5B] text-[9px] font-black uppercase tracking-[0.4em] mb-4 block">PLATFORM ECOSYSTEM</span>
            <h2 className="text-5xl md:text-6xl font-serif text-slate-900 dark:text-white leading-tight">Automate workflows, <br />curate event experiences.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            
            {/* Left: Tab Selectors */}
            <div className="lg:col-span-4 space-y-6">
              <button 
                onClick={() => setActiveTab('waitlists')}
                className={`w-full text-left p-8 rounded-[2rem] border transition-all duration-500 flex flex-col gap-3 group cursor-pointer ${
                  activeTab === 'waitlists' 
                    ? 'bg-[#FDFBF7] dark:bg-slate-800 border-[#4E7D5B]/20 shadow-lg' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeTab === 'waitlists' ? 'bg-[#4E7D5B] text-white' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'
                  }`}>
                    <Hourglass className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    activeTab === 'waitlists' ? 'text-slate-800 dark:text-white' : 'text-slate-400'
                  }`}>Queue Automation</span>
                </div>
                <h4 className="text-xl font-serif text-slate-800 dark:text-slate-100">Dynamic Waitlist Engine</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">Let queues auto-process! Once a reservation expires or capacity is cleared, the system auto-notifies the next attendee instantly.</p>
              </button>

              <button 
                onClick={() => setActiveTab('floorplans')}
                className={`w-full text-left p-8 rounded-[2rem] border transition-all duration-500 flex flex-col gap-3 group cursor-pointer ${
                  activeTab === 'floorplans' 
                    ? 'bg-[#FDFBF7] dark:bg-slate-800 border-[#4E7D5B]/20 shadow-lg' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    activeTab === 'floorplans' ? 'bg-[#4E7D5B] text-white' : 'bg-slate-50 dark:bg-slate-950 text-slate-400'
                  }`}>
                    <Layout className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    activeTab === 'floorplans' ? 'text-slate-800 dark:text-white' : 'text-slate-400'
                  }`}>Spatial Design</span>
                </div>
                <h4 className="text-xl font-serif text-slate-800 dark:text-slate-100">Smart Floorplans & Sessions</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">Map specific session rooms, speaker slots, and sponsor tiers to layout coordinates, giving guests visual density profiles.</p>
              </button>
            </div>

            {/* Right: Dynamic Tab Content */}
            <div className="lg:col-span-8 bg-[#FDFBF7] dark:bg-slate-950 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-2xl p-8 min-h-[500px] flex flex-col justify-between overflow-hidden">
              
              {activeTab === 'waitlists' && (
                <div className="flex-1 flex flex-col justify-between space-y-8 animate-slide-up text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <span className="text-[8px] font-black text-slate-350 uppercase tracking-widest block">WAITLIST SIMULATOR</span>
                      <h3 className="text-2xl font-serif text-slate-800 dark:text-white">Dynamic Capacity Release</h3>
                    </div>
                    <div>
                      {!released ? (
                        <span className="px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-[9px] font-black uppercase tracking-widest text-amber-600">CAPACITY FULL</span>
                      ) : (
                        <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-600">SLOT RELEASED</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch flex-1">
                    {/* Simulator Queue Display */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
                      <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Queue Index</h4>
                      <div className="space-y-3">
                        {queue.map((user, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#4E7D5B] text-white flex items-center justify-center text-[10px] font-black">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-850 dark:text-slate-150">{user.name}</h5>
                                <span className="text-[8px] font-bold text-slate-400">{user.email}</span>
                              </div>
                            </div>
                            <span className={`px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-full ${
                              user.status === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>{user.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Controller Action */}
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Ecosystem Automation</h4>
                        <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-6">
                          Simulate ticket cancellations. Click below to trigger waitlist notifications and automatically re-book the first attendee in queue.
                        </p>
                      </div>
                      <button 
                        onClick={toggleWaitlistRelease}
                        className="w-full bg-slate-900 dark:bg-slate-950 text-white py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors shadow-lg cursor-pointer"
                      >
                        {!released ? 'Release Slot (Auto-Book)' : 'Reset Simulation'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'floorplans' && (
                <div className="flex-1 flex flex-col justify-between space-y-8 animate-slide-up text-left">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-6">
                    <div>
                      <span className="text-[8px] font-black text-slate-350 uppercase tracking-widest block">SPATIAL TRACKER</span>
                      <h3 className="text-2xl font-serif text-slate-800 dark:text-white">Dynamic Venue Layout & Sessions</h3>
                    </div>
                    <span className="px-4 py-1.5 bg-[#4E7D5B]/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#4E7D5B] dark:text-[#89c59c]">PHYSICAL NODE</span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm flex-1 flex flex-col justify-between relative overflow-hidden min-h-[250px]">
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-stretch">
                      <div className="border border-dashed border-[#4E7D5B]/30 rounded-2xl p-4 bg-white/70 dark:bg-slate-950/70 flex flex-col justify-between">
                        <span className="text-[8px] font-black text-[#4E7D5B] dark:text-[#88c599] uppercase tracking-widest">Main Track</span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-105 leading-tight">Keynotes & Tech Panel</h4>
                        <span className="text-[9px] font-bold text-slate-400">Capacity: 1,200 seats</span>
                      </div>
                      <div className="border border-dashed border-[#4E7D5B]/30 rounded-2xl p-4 bg-white/70 dark:bg-slate-950/70 flex flex-col justify-between">
                        <span className="text-[8px] font-black text-[#4E7D5B] dark:text-[#88c599] uppercase tracking-widest">Workshop A</span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-105 leading-tight">Hands-on Smart Contracts</h4>
                        <span className="text-[9px] font-bold text-slate-400">Capacity: 120 seats</span>
                      </div>
                      <div className="border border-dashed border-[#4E7D5B]/30 rounded-2xl p-4 bg-white/70 dark:bg-slate-950/70 flex flex-col justify-between">
                        <span className="text-[8px] font-black text-[#4E7D5B] dark:text-[#88c599] uppercase tracking-widest">VIP Lounge</span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-105 leading-tight">Steward Governance Board</h4>
                        <span className="text-[9px] font-bold text-slate-400">Capacity: Private access</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Host CTA Panel */}
      <section className="px-6 md:px-12 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center shadow-xl border border-slate-850">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }}></div>
          </div>
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-[#4E7D5B] text-[10px] font-black uppercase tracking-[0.4em] block">FOR ARCHITECTS</span>
            <h2 className="text-4xl md:text-6xl font-serif text-white leading-tight font-bold">Have a vision for a <span className="text-[#4E7D5B] italic relative font-normal">gathering?</span></h2>
            <p className="text-base text-slate-400 font-serif italic max-w-lg mx-auto leading-relaxed">
              Join our ecosystem of intentional hosts and bring your community together in a premium environment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link to="/organizer/events" className="bg-[#4E7D5B] hover:bg-[#3D6449] text-white px-10 py-4.5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-[#4E7D5B]/20 transition cursor-pointer">
                START HOSTING
              </Link>
              <Link to="/about" className="text-[9px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-2 group">
                VIEW SUCCESS RITUALS
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
