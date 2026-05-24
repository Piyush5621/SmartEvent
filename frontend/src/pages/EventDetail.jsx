import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Sprout, 
  Timer, 
  MapPin, 
  Calendar, 
  Verified, 
  Star, 
  MessageSquare, 
  Lock, 
  Mail, 
  ShieldAlert, 
  Info, 
  LogIn, 
  X, 
  ChevronDown, 
  ArrowRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // Form/Interactive State
  const [selectedType, setSelectedType] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  
  // Review Form State
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  // Violation Report Form State
  const [reportSubject, setReportSubject] = useState('Copyright / Intellectual Property Violation');
  const [reportEvidenceUrl, setReportEvidenceUrl] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const [reportMessage, setReportMessage] = useState(null);

  // Auth context helpers
  const token = localStorage.getItem('token') || localStorage.getItem('api_token');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          const res = await api.get('/user');
          setCurrentUser(res.data);
        } catch (e) {
          console.error(e);
        }
      }
    }
    fetchUser();
  }, [token]);

  useEffect(() => {
    async function fetchEventDetail() {
      try {
        setLoading(true);
        const res = await api.get(`/events/${slug}`);
        const data = res.data.data;
        setEvent(data);
        if (data.ticket_types && data.ticket_types.length > 0) {
          setSelectedType(data.ticket_types[0].id);
        }
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch the requested experience node. Please verify the link or network status.');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetail();
  }, [slug]);

  // Countdown timer logic
  useEffect(() => {
    if (!event) return;
    const target = new Date(event.start_date).getTime();
    
    const updateTime = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff < 0) {
        setTimeLeft('Started');
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [event]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] dark:bg-slate-950 transition-colors duration-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading experience blueprint...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] dark:bg-slate-950 px-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-10 rounded-[2.5rem] shadow-xl text-center">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-medium text-slate-900 dark:text-white mb-2">Blueprint Sync Failed</h2>
          <p className="text-sm text-slate-400 dark:text-slate-400 mb-6">{error || 'Event not found.'}</p>
          <Link to="/events" className="btn-primary px-8 py-3.5 text-xs font-black uppercase tracking-widest w-full text-center block">
            Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  // Calculate ticket pricing
  const currentTicketType = event.ticket_types.find(t => t.id === selectedType);
  const ticketPrice = currentTicketType ? currentTicketType.price : 0;
  const isSoldOut = currentTicketType ? (currentTicketType.quantity_sold >= currentTicketType.quantity_total) : false;
  const totalCost = ticketPrice * quantity;

  // Handle Checkout / Booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (isSoldOut) {
      // Handle join waitlist logic
      handleJoinWaitlist();
    } else {
      // Redirect to checkout wizard
      navigate(`/checkout?event=${event.slug}&ticket_type_id=${selectedType}&quantity=${quantity}`);
    }
  };

  const handleJoinWaitlist = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post(`/events/${event.id}/waitlist`, {
        ticket_type_id: selectedType
      });
      alert(res.data.message || 'Successfully joined waitlist!');
      // Refresh event details to reflect registration state if needed
      const detailRes = await api.get(`/events/${slug}`);
      setEvent(detailRes.data.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to join waitlist. Please check capacity.');
    }
  };

  // Submit Resonance Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSubmittingReview(true);
    setReviewMessage(null);
    try {
      const res = await api.post(`/events/${event.id}/reviews`, {
        rating: userRating,
        comment: reviewComment
      });
      setReviewMessage({ type: 'success', text: res.data.message });
      setReviewComment('');
    } catch (err) {
      console.error(err);
      setReviewMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit review.' });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Submit Violation Report
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setSubmittingReport(true);
    setReportMessage(null);
    try {
      const res = await api.post(`/events/${event.id}/report`, {
        subject: reportSubject,
        evidence_url: reportEvidenceUrl,
        description: reportDescription
      });
      setReportMessage({ type: 'success', text: res.data.message });
      setReportDescription('');
      setReportEvidenceUrl('');
      setTimeout(() => {
        setShowReportModal(false);
        setReportMessage(null);
      }, 3000);
    } catch (err) {
      console.error(err);
      setReportMessage({ type: 'error', text: err.response?.data?.message || 'Failed to submit violation report.' });
    } finally {
      setSubmittingReport(false);
    }
  };

  const averageRating = event.reviews && event.reviews.length > 0
    ? (event.reviews.reduce((acc, r) => acc + r.rating, 0) / event.reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden">
      <Navbar />

      {/* Cinematic Hero Header */}
      <div className="relative min-h-[50vh] md:min-h-[60vh] lg:min-h-[65vh] w-full flex items-center bg-slate-950 overflow-hidden pt-24">
        {/* Background Image Blurry Backing */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-30 select-none"
          style={{ backgroundImage: `url('${event.banner}')` }}
        ></div>
        
        {/* Dark Vignette Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-transparent to-transparent"></div>

        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 relative z-10 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Large Cinematic Cover Frame */}
            <div className="lg:col-span-4 hidden lg:block">
              <div className="aspect-[3/4] w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 group relative">
                <img 
                  src={event.banner} 
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" 
                  alt={event.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              </div>
            </div>

            {/* Right: Core Metadata & Title */}
            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4E7D5B] text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#4E7D5B]/20">
                  <Sprout className="w-3.5 h-3.5" />
                  {event.category}
                </span>
                
                {timeLeft && timeLeft !== 'Started' && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/15">
                    <Timer className="w-3.5 h-3.5 text-[#4E7D5B]" />
                    Countdown: <span className="ml-1 text-white font-mono">{timeLeft}</span>
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] tracking-tight max-w-4xl font-bold">
                {event.title}
              </h1>

              {/* Organizer and Basic Quick Specs */}
              <div className="flex flex-wrap items-center gap-8 pt-4">
                {/* Organizer Details */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer?.name || 'O')}&background=4E7D5B&color=fff`} 
                      className="w-11 h-11 rounded-xl border border-white/20 shadow-md"
                      alt="Organizer Avatar"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4E7D5B] rounded-full border border-slate-950 flex items-center justify-center">
                      <Verified className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase tracking-widest leading-none mb-1">Architect</span>
                    <span className="text-sm font-bold text-white leading-none">{event.organizer?.name}</span>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

                {/* Basic Specifications */}
                <div className="flex items-center gap-3 text-slate-350">
                  <MapPin className="w-5 h-5 text-[#4E7D5B]" />
                  <span className="text-sm font-medium">{event.venue ? event.venue.city : 'Global (Online)'}</span>
                </div>

                <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-3 text-slate-350">
                  <Calendar className="w-5 h-5 text-[#4E7D5B]" />
                  <span className="text-sm font-medium">{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Interactive Content Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Modern Navigation Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex gap-8 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setActiveTab('about')} 
                className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all shrink-0 cursor-pointer ${
                  activeTab === 'about' ? 'border-[#4E7D5B] text-[#4E7D5B] dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300'
                }`}
              >
                Overview
              </button>
              {event.sessions && event.sessions.length > 0 && (
                <button 
                  onClick={() => setActiveTab('sessions')} 
                  className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all shrink-0 cursor-pointer ${
                    activeTab === 'sessions' ? 'border-[#4E7D5B] text-[#4E7D5B] dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300'
                  }`}
                >
                  Timeline ({event.sessions.length})
                </button>
              )}
              {event.venue && (
                <button 
                  onClick={() => setActiveTab('venue')} 
                  className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all shrink-0 cursor-pointer ${
                    activeTab === 'venue' ? 'border-[#4E7D5B] text-[#4E7D5B] dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300'
                  }`}
                >
                  Coordinates
                </button>
              )}
              <button 
                onClick={() => setActiveTab('reviews')} 
                className={`pb-4 border-b-2 font-bold text-xs uppercase tracking-widest transition-all shrink-0 cursor-pointer ${
                  activeTab === 'reviews' ? 'border-[#4E7D5B] text-[#4E7D5B] dark:text-white' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300'
                }`}
              >
                Resonance ({event.reviews ? event.reviews.length : 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-8">
              
              {/* TAB: Overview */}
              {activeTab === 'about' && (
                <div className="space-y-8 text-left animate-slide-up">
                  <div className="prose prose-slate dark:prose-invert max-w-none text-slate-650 dark:text-slate-400 leading-[1.8] text-base md:text-lg font-sans whitespace-pre-line">
                    {event.description}
                  </div>

                  {/* Speakers Grid inside Overview */}
                  {event.speakers && event.speakers.length > 0 && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-6 font-bold">Featured Guides</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {event.speakers.map(speaker => (
                          <div key={speaker.id} className="flex gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                            <img src={speaker.photo} alt={speaker.name} className="w-16 h-16 rounded-xl object-cover" />
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{speaker.name}</h4>
                              <p className="text-[10px] text-primary uppercase font-bold tracking-wider mt-0.5">{speaker.designation}</p>
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{speaker.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sponsors inside Overview */}
                  {event.sponsors && event.sponsors.length > 0 && (
                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                      <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-6 font-bold">Ecosystem Stewards</h3>
                      <div className="flex flex-wrap items-center gap-8">
                        {event.sponsors.map(sponsor => (
                          <div key={sponsor.id} className="grayscale hover:grayscale-0 transition-all duration-300">
                            {sponsor.logo ? (
                              <img src={sponsor.logo} alt={sponsor.name} className="h-10 object-contain max-w-[140px]" />
                            ) : (
                              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">{sponsor.name}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: Timeline / Sessions */}
              {activeTab === 'sessions' && event.sessions && (
                <div className="space-y-6 text-left animate-slide-up">
                  <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-8 space-y-12">
                    {event.sessions.map((session) => (
                      <div key={session.id} className="relative group">
                        {/* Timeline Node Bullet */}
                        <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-[#FDFBF7] dark:bg-slate-950 border-4 border-[#4E7D5B] group-hover:scale-125 transition-transform duration-300 z-10"></div>
                        
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-3 pb-3 border-b border-slate-50 dark:border-slate-850">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#4E7D5B]/10 text-[#4E7D5B] uppercase tracking-wider">
                                {new Date(session.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-xs text-slate-400 font-medium">{session.room_or_track || 'Session Segment'}</span>
                            </div>
                          </div>
                          <h4 className="text-lg font-serif text-slate-900 dark:text-white group-hover:text-[#4E7D5B] transition-colors mb-2 font-bold">{session.title}</h4>
                          <p className="text-slate-500 dark:text-slate-450 text-xs md:text-sm leading-relaxed mb-4">{session.description}</p>
                          
                          {session.speaker && (
                            <div className="inline-flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                              <img 
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session.speaker.name)}&background=4E7D5B&color=fff`} 
                                className="w-8 h-8 rounded-lg"
                                alt={session.speaker.name}
                              />
                              <div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-0.5">Speaker</span>
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">{session.speaker.name}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Coordinates / Venue */}
              {activeTab === 'venue' && event.venue && (
                <div className="space-y-6 text-left animate-slide-up">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-6">
                    {/* Venue Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#4E7D5B]/10 flex items-center justify-center text-[#4E7D5B] shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-tight">{event.venue.name}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-sans mt-0.5">
                          {[event.venue.address, event.venue.city, event.venue.state, event.venue.country].filter(Boolean).join(', ')}
                        </p>
                        {event.venue.latitude && event.venue.longitude && (
                          <p className="text-[10px] text-[#4E7D5B] font-bold mt-1.5 font-mono">
                            {parseFloat(event.venue.latitude).toFixed(6)}, {parseFloat(event.venue.longitude).toFixed(6)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Live Map Embed - shows real OSM map if coordinates exist */}
                    <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
                      {event.venue.latitude && event.venue.longitude ? (
                        <iframe
                          title="Event Venue Map"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(event.venue.longitude)-0.008},${parseFloat(event.venue.latitude)-0.008},${parseFloat(event.venue.longitude)+0.008},${parseFloat(event.venue.latitude)+0.008}&layer=mapnik&marker=${event.venue.latitude},${event.venue.longitude}`}
                          width="100%"
                          height="300"
                          style={{ border: 0, display: 'block' }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="aspect-[16/6] relative group">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center grayscale opacity-40"></div>
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <MapPin className="w-8 h-8 text-[#4E7D5B]" />
                            <p className="text-xs text-slate-500 font-bold">{event.venue.address}, {event.venue.city}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Navigation Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Google Maps - coordinate-based if available, else address-based */}
                      <a 
                        href={
                          event.venue.latitude && event.venue.longitude
                            ? `https://www.google.com/maps?q=${event.venue.latitude},${event.venue.longitude}&z=16`
                            : `https://maps.google.com/?q=${encodeURIComponent([event.venue.name, event.venue.address, event.venue.city].filter(Boolean).join(', '))}`
                        }
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#4E7D5B] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#3D6449] shadow-lg shadow-[#4E7D5B]/20 transition-all duration-300 hover:scale-105"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Open in Google Maps
                      </a>

                      {/* Apple Maps */}
                      <a 
                        href={
                          event.venue.latitude && event.venue.longitude
                            ? `https://maps.apple.com/?ll=${event.venue.latitude},${event.venue.longitude}&q=${encodeURIComponent(event.venue.name)}`
                            : `https://maps.apple.com/?q=${encodeURIComponent([event.venue.name, event.venue.address, event.venue.city].filter(Boolean).join(', '))}`
                        }
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest hover:border-[#4E7D5B] hover:text-[#4E7D5B] transition-all duration-300"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Apple Maps
                      </a>

                      {/* OSM / Waze directions */}
                      {event.venue.latitude && event.venue.longitude && (
                        <a 
                          href={`https://www.waze.com/ul?ll=${event.venue.latitude},${event.venue.longitude}&navigate=yes`}
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-widest hover:border-[#4E7D5B] hover:text-[#4E7D5B] transition-all duration-300"
                        >
                          Navigate via Waze
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Resonance / Reviews */}
              {activeTab === 'reviews' && (
                <div className="space-y-8 text-left animate-slide-up">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm">
                    <div className="text-center md:border-r border-slate-100 dark:border-slate-800 md:pr-6 py-4">
                      <div className="text-5xl font-serif font-bold text-slate-900 dark:text-white mb-2">{averageRating}</div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Aggregate Energy</div>
                    </div>
                    <div className="col-span-2 flex flex-col items-center justify-center gap-3 py-4">
                      <div className="flex text-amber-550 gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-6 h-6 ${star <= parseFloat(averageRating) ? 'fill-current text-amber-450' : 'opacity-20 text-slate-350'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-slate-450 dark:text-slate-500 font-medium">Based on {event.reviews ? event.reviews.length : 0} verified ecosystem resonances</span>
                    </div>
                  </div>

                  {/* Review Submission or Guidelines */}
                  {token ? (
                    currentUser ? (
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-3xl shadow-sm mb-8">
                        <h4 className="text-lg font-serif font-bold text-slate-900 dark:text-white mb-2">Leave a Resonance Review</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-450 mb-6">Describe the atmosphere and your experience to the community.</p>
                        
                        {reviewMessage && (
                          <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider mb-6 ${
                            reviewMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                          }`}>
                            {reviewMessage.text}
                          </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                          {/* Star selection */}
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Your Rating</label>
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star}
                                  type="button" 
                                  onClick={() => setUserRating(star)} 
                                  onMouseEnter={() => setHoverRating(star)} 
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="text-amber-450 focus:outline-none transition-transform active:scale-90 duration-200 cursor-pointer"
                                >
                                  <Star 
                                    className={`w-8 h-8 transition-all ${
                                      (hoverRating ? star <= hoverRating : star <= userRating) 
                                        ? 'text-amber-450 fill-amber-450' 
                                        : 'text-slate-200 dark:text-slate-800'
                                    }`} 
                                  />
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Review comment */}
                          <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest">Your Comment</label>
                            <textarea 
                              rows="4" 
                              required 
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Share your experience with the ecosystem..." 
                              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-350 focus:border-primary outline-none transition-colors"
                            ></textarea>
                          </div>

                          <button 
                            type="submit" 
                            disabled={submittingReview}
                            className="btn-primary px-8 py-3 text-xs font-black uppercase tracking-widest cursor-pointer disabled:opacity-50"
                          >
                            {submittingReview ? 'Submitting...' : 'Submit Resonance Review'}
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
                        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl mb-8 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <LogIn className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Submit a Resonance Review</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-405 mt-1.5 leading-relaxed">
                          Please <Link to="/login" className="text-primary font-bold hover:underline">login</Link> to participate. Review submissions are restricted to verified ticket holders after the experience has concluded.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {event.reviews && event.reviews.length > 0 ? (
                      event.reviews.map((review) => (
                        <div key={review.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl relative shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-4">
                            <img 
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=4E7D5B&color=fff`} 
                              className="w-10 h-10 rounded-xl"
                              alt="Reviewer Avatar"
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">{review.user_name}</div>
                              <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{review.created_at}</div>
                            </div>
                          </div>
                          <div className="flex text-amber-455 mb-3 gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 ${i <= review.rating ? 'fill-current text-amber-450' : 'opacity-20 text-slate-350'}`} 
                              />
                            ))}
                          </div>
                          <p className="text-slate-650 dark:text-slate-400 text-xs md:text-sm leading-relaxed italic font-serif">"{review.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-350">
                          <MessageSquare className="w-6 h-6" />
                        </div>
                        <p className="text-slate-450 font-serif italic text-sm max-w-xs mx-auto">Be the first node to describe the atmosphere of this experience.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right: High-Fidelity Interactive Ticket Stub */}
          <div className="lg:col-span-4 shrink-0 w-full lg:max-w-sm">
            <div className="sticky top-32 space-y-8">
              
              {/* Reservation Ticket Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-xl relative overflow-hidden">
                {/* Top Decorative Color bar */}
                <div className="h-3.5 w-full bg-[#4E7D5B] shadow-inner"></div>

                <div className="p-8 space-y-6 text-left">
                  <div>
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Secure Entry</span>
                    <h3 className="text-2xl font-serif text-slate-900 dark:text-white leading-tight font-bold">Resonator Ticket</h3>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    
                    {/* Ticket Type Options */}
                    <div className="space-y-3.5">
                      {event.ticket_types && event.ticket_types.map((type) => {
                        const localSoldOut = type.quantity_sold >= type.quantity_total;
                        return (
                          <label 
                            key={type.id}
                            className={`block relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group overflow-hidden ${
                              selectedType === type.id 
                                ? 'border-[#4E7D5B] bg-[#4E7D5B]/5 shadow-sm' 
                                : 'border-slate-100 dark:border-slate-800 hover:border-[#4E7D5B]/20 hover:bg-slate-50/50'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name="ticket_type_id" 
                              value={type.id} 
                              className="sr-only" 
                              checked={selectedType === type.id}
                              onChange={() => {
                                setSelectedType(type.id);
                                setQuantity(1);
                              }}
                            />
                            
                            <div className="flex justify-between items-center relative z-10 gap-3">
                              <div className="flex-1">
                                <div className={`font-bold text-xs uppercase tracking-wider mb-0.5 ${
                                  selectedType === type.id ? 'text-[#4E7D5B]' : 'text-slate-500'
                                }`}>
                                  {type.name}
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-400 leading-normal font-sans">
                                  {type.description || 'Access tier node'}
                                </div>
                                {localSoldOut && (
                                  <span className="inline-block mt-2 px-2 py-0.5 bg-amber-500/10 border border-amber-500/25 text-amber-600 rounded text-[8px] font-black uppercase tracking-wider">
                                    Sold Out (Waitlist Available)
                                  </span>
                                )}
                              </div>
                              <div className={`text-lg font-serif font-bold text-right ${
                                selectedType === type.id ? 'text-[#4E7D5B]' : 'text-slate-900 dark:text-white'
                              }`}>
                                {type.price === 0 ? 'Free' : `₹${type.price.toLocaleString('en-IN')}`}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    {/* Quantity Input */}
                    {!isSoldOut && (
                      <div className="flex items-center justify-between py-3.5 border-t border-b border-dashed border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Quantity</span>
                          <span className="text-[11px] font-serif italic text-slate-450 dark:text-slate-500">Select ticket nodes</span>
                        </div>
                        <div className="relative group">
                          <select 
                            value={quantity} 
                            onChange={(e) => setQuantity(parseInt(e.target.value))}
                            className="appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-855 focus:border-[#4E7D5B] focus:ring-0 text-xs font-bold text-slate-800 dark:text-slate-200 py-2.5 pl-5 pr-9 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                              <option key={i} value={i}>{i} {i > 1 ? 'NODES' : 'NODE'}</option>
                            ))}
                          </select>
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-colors group-hover:text-[#4E7D5B]">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Realtime Calculation Subtotal Display */}
                    {!isSoldOut && (
                      <div className="space-y-2 pt-2 text-xs">
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Subtotal ({quantity} {quantity > 1 ? 'nodes' : 'node'})</span>
                          <span className="font-bold text-slate-850 dark:text-slate-200">
                            ₹{totalCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500">
                          <span>Booking Fee</span>
                          <span className="font-semibold text-emerald-600">Free</span>
                        </div>
                        <div className="flex justify-between items-end pt-3 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-bold uppercase tracking-wider text-slate-900 dark:text-white">Estimated total</span>
                          <span className="text-2xl font-serif font-bold text-[#4E7D5B]">
                            ₹{totalCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    )}

                    {isSoldOut ? (
                      <button 
                        type="button"
                        onClick={handleJoinWaitlist}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white py-4.5 px-6 rounded-full text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
                      >
                        JOIN QUEUE WAITLIST &rarr;
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        className="w-full bg-[#4E7D5B] hover:bg-[#3D6449] text-white py-4.5 px-6 rounded-full text-xs font-black uppercase tracking-[0.25em] transition-all duration-300 shadow-lg shadow-[#4E7D5B]/20 active:scale-95 cursor-pointer"
                      >
                        CONFIRM RESERVATION &rarr;
                      </button>
                    )}
                  </form>

                  <div className="flex items-center justify-center gap-2 text-[9px] font-black text-slate-350 dark:text-slate-650 uppercase tracking-widest pt-2">
                    <Lock className="w-3.5 h-3.5 text-[#4E7D5B]" />
                    SECURED BY GROUNDED ENTERPRISE
                  </div>
                </div>
              </div>

              {/* Organizer Info Card */}
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-6 flex items-center justify-between group cursor-pointer hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg transition-all duration-500 rounded-3xl">
                <div className="flex items-center gap-4 text-left">
                  <div className="relative">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(event.organizer?.name || 'O')}&background=4E7D5B&color=fff`} 
                      className="w-12 h-12 rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-500"
                      alt="Organizer Profile"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#4E7D5B] rounded-full border border-white flex items-center justify-center">
                      <Verified className="w-2 h-2 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5">PRINCIPAL ARCHITECT</div>
                    <div className="text-base font-serif text-slate-900 dark:text-white group-hover:text-[#4E7D5B] transition-colors leading-none font-bold">{event.organizer?.name}</div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#4E7D5B] group-hover:border-[#4E7D5B] group-hover:rotate-12 transition-all duration-500 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
              </div>

              {/* Report Copyright / Legal Violation */}
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowReportModal(true)} 
                  className="text-[9px] font-black text-rose-500/80 hover:text-rose-600 uppercase tracking-widest flex items-center gap-2 transition-all p-2.5 bg-rose-500/5 hover:bg-rose-500/10 rounded-full px-5 border border-rose-500/10 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Report Violation
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recommendations Section */}
      {event.recommended_events && event.recommended_events.length > 0 && (
        <section className="py-20 px-6 md:px-12 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div className="text-left">
                <span className="text-[#4E7D5B] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">RESONANCE MAP</span>
                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white font-bold">Related Architectures</h2>
              </div>
              <Link to="/events" className="text-[10px] font-black text-slate-400 hover:text-[#4E7D5B] uppercase tracking-widest transition-colors">
                VIEW ALL NODES &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {event.recommended_events.map((rec) => (
                <Link 
                  key={rec.id}
                  to={`/events/${rec.slug}`} 
                  className="premium-card bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 group overflow-hidden rounded-3xl hover:shadow-lg transition-all duration-500"
                >
                  <div className="aspect-[16/10] relative overflow-hidden m-2 rounded-2xl">
                    <img 
                      src={rec.banner} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      alt={rec.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#4E7D5B] border border-white/20">
                      {rec.category}
                    </div>
                  </div>
                  <div className="p-6 pt-2 text-left">
                    <h4 className="text-lg font-serif text-slate-900 dark:text-white group-hover:text-[#4E7D5B] transition-colors truncate mb-3 font-bold">{rec.title}</h4>
                    <div className="flex items-center gap-5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#4E7D5B]" /> 
                        {new Date(rec.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#4E7D5B]" /> 
                        {rec.city || 'Global'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Copyright & Legal Violation Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md transition-all animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -translate-y-12 translate-x-12 blur-[40px]"></div>
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-serif text-slate-900 dark:text-white leading-tight font-bold">Report Violation</h3>
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block mt-0.5">Ecosystem Security Audit</span>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-605 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {token ? (
              <form onSubmit={handleReportSubmit} className="space-y-5 text-left">
                {reportMessage && (
                  <div className={`p-4 rounded-xl text-xs font-bold uppercase tracking-wider ${
                    reportMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                  }`}>
                    {reportMessage.text}
                  </div>
                )}
                
                <div>
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-2">Subject / Classification</label>
                  <select 
                    value={reportSubject} 
                    onChange={(e) => setReportSubject(e.target.value)}
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-rose-400 focus:ring-0 text-xs font-bold text-slate-800 dark:text-slate-205 py-3.5 px-5 rounded-xl cursor-pointer"
                  >
                    <option value="Copyright / Intellectual Property Violation">Copyright / Intellectual Property Violation</option>
                    <option value="Illegal / Fraudulent Content">Illegal / Fraudulent Content</option>
                    <option value="Community Violations & Harassment">Community Violations & Harassment</option>
                    <option value="Other Regulatory Restrictions">Other Regulatory Restrictions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-2">Evidence URL (Optional)</label>
                  <input 
                    type="url" 
                    value={reportEvidenceUrl}
                    onChange={(e) => setReportEvidenceUrl(e.target.value)}
                    placeholder="https://..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-rose-450 focus:ring-0 text-xs font-bold text-slate-800 dark:text-slate-200 py-3.5 px-5 rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-2">Detailed Narrative & Context</label>
                  <textarea 
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    required 
                    rows="4" 
                    placeholder="Please describe the copyright infringement or illegal issue in detail..." 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-rose-455 focus:ring-0 text-xs text-slate-800 dark:text-slate-200 py-3.5 px-5 rounded-xl outline-none"
                  ></textarea>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowReportModal(false)} 
                    className="flex-1 py-3.5 rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-600 hover:border-slate-350 transition-all cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submittingReport}
                    className="flex-1 py-3.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {submittingReport ? 'Submitting...' : 'Submit Audit Request'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                  <Lock className="w-6 h-6" />
                </div>
                <p className="text-slate-650 dark:text-slate-400 font-serif italic text-base mb-6">Authentication is required to initiate a security audit request.</p>
                <Link 
                  to="/login"
                  onClick={() => setShowReportModal(false)}
                  className="inline-flex items-center justify-center rounded-full bg-[#4E7D5B] px-8 py-3.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#4E7D5B]/20 hover:bg-[#3D6449] transition"
                >
                  Login Passage
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
