import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { MapPin, Calendar, Compass, Search, ChevronLeft, ChevronRight, Crosshair, Trash2 } from 'lucide-react';

export default function EventListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [firstItem, setFirstItem] = useState(0);
  const [lastItem, setLastItem] = useState(0);
  const [promotedEvents, setPromotedEvents] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-slide for promoted events
  useEffect(() => {
    if (promotedEvents.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % promotedEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [promotedEvents]);

  // Search/Filters inputs
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  
  // Geolocation locking
  const [locationLocked, setLocationLocked] = useState(
    searchParams.has('latitude') && searchParams.has('longitude')
  );
  const [lat, setLat] = useState(searchParams.get('latitude') || '');
  const [lng, setLng] = useState(searchParams.get('longitude') || '');
  const [radius, setRadius] = useState(searchParams.get('radius') || '50');
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get('/categories');
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Failed to load categories list', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const params = {};
        if (searchParams.get('search')) params.search = searchParams.get('search');
        if (searchParams.get('category')) params.category = searchParams.get('category');
        if (searchParams.get('type')) params.type = searchParams.get('type');
        if (searchParams.get('latitude')) params.latitude = searchParams.get('latitude');
        if (searchParams.get('longitude')) params.longitude = searchParams.get('longitude');
        if (searchParams.get('radius')) params.radius = searchParams.get('radius');
        params.page = currentPage;

        const response = await api.get('/events', { params });
        const pagination = response.data.meta || {};
        
        setEvents(response.data.data || []);
        setTotalCount(pagination.total || response.data.data.length || 0);
        setCurrentPage(pagination.current_page || 1);
        setLastPage(pagination.last_page || 1);
        setFirstItem(pagination.from || 1);
        setLastItem(pagination.to || response.data.data.length || 0);
        setPromotedEvents(response.data.promoted || []);
      } catch (err) {
        console.error('Failed to load events list', err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [searchParams, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const handleFormatChange = (format) => {
    const newParams = new URLSearchParams(searchParams);
    if (format) {
      newParams.set('type', format);
    } else {
      newParams.delete('type');
    }
    newParams.set('page', '1');
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catSlug) => {
    const newParams = new URLSearchParams(searchParams);
    if (catSlug) {
      newParams.set('category', catSlug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const requestLocation = () => {
    if (locationLocked) return;
    setGeoLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLat(latitude);
          setLng(longitude);
          setLocationLocked(true);
          setGeoLoading(false);

          const newParams = new URLSearchParams(searchParams);
          newParams.set('latitude', latitude.toString());
          newParams.set('longitude', longitude.toString());
          newParams.set('radius', radius);
          newParams.set('page', '1');
          setCurrentPage(1);
          setSearchParams(newParams);
        },
        (error) => {
          alert('GPS Lock failed: ' + error.message);
          setGeoLoading(false);
        }
      );
    } else {
      alert('Location lock not supported by browser.');
      setGeoLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    if (locationLocked) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('radius', newRadius);
      newParams.set('page', '1');
      setCurrentPage(1);
      setSearchParams(newParams);
    }
  };

  const resetRadar = () => {
    setLat('');
    setLng('');
    setLocationLocked(false);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('latitude');
    newParams.delete('longitude');
    newParams.delete('radius');
    newParams.set('page', '1');
    setCurrentPage(1);
    setSearchParams(newParams);
  };

  const selectedCategory = searchParams.get('category');
  const selectedFormat = searchParams.get('type');

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-500 overflow-x-hidden selection:bg-[#4E7D5B] selection:text-white">
      <Navbar />

      {/* Cinematic Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#4E7D5B]/5 dark:bg-[#4E7D5B]/2 rounded-full blur-[140px]"></div>
        <div className="absolute top-[40%] left-[2%] w-[500px] h-[500px] bg-amber-500/3 dark:bg-[#4E7D5B]/3 rounded-full blur-[120px]"></div>
      </div>

      {/* Top Promoted Carousel (BookMyShow Style) */}
      {promotedEvents.length > 0 && (
        <section className="pt-28 pb-10 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
          <div className="relative rounded-[2rem] overflow-hidden aspect-[21/10] md:aspect-[21/8] lg:aspect-[21/7] shadow-2xl border border-slate-100 dark:border-slate-800 bg-slate-900 group">
            
            {/* Slides Container */}
            <div className="w-full h-full relative">
              {promotedEvents.map((pe, index) => (
                <div 
                  key={pe.id}
                  className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ${
                    index === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                  style={{ backgroundImage: `url('${pe.banner}')` }}
                >
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent"></div>

                  {/* Slide Contents */}
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-16 flex flex-col justify-end h-full text-left space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="px-3.5 py-1 rounded-full bg-[#4E7D5B] text-white text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#4E7D5B]/30">
                        Featured Gathering
                      </span>
                      <span className="px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/10">
                        {pe.category}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white font-bold leading-tight tracking-tight line-clamp-2">
                      {pe.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-6 text-slate-300 text-xs md:text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#4E7D5B]" />
                        {new Date(pe.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#4E7D5B]" />
                        {pe.venue ? pe.venue.name : 'Global Portal'}
                      </span>
                    </div>

                    <div className="pt-3">
                      <Link to={`/events/${pe.slug}`} className="inline-flex items-center gap-2 bg-[#4E7D5B] hover:bg-[#3D6449] text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition shadow-lg shadow-[#4E7D5B]/20">
                        Book Pass &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Left Arrow */}
            <button 
              onClick={() => setActiveSlide((prev) => (prev - 1 + promotedEvents.length) % promotedEvents.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/40 hover:bg-[#4E7D5B] text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 border border-white/10 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Arrow */}
            <button 
              onClick={() => setActiveSlide((prev) => (prev + 1) % promotedEvents.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-950/40 hover:bg-[#4E7D5B] text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 border border-white/10 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 right-8 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm z-20 border border-white/5">
              {promotedEvents.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-500 rounded-full cursor-pointer ${
                    activeSlide === index ? 'w-5 h-1.5 bg-[#4E7D5B]' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/85'
                  }`}
                ></button>
              ))}
            </div>

          </div>
        </section>
      )}

      <section className={`pb-24 px-6 md:px-12 max-w-7xl mx-auto relative z-10 ${promotedEvents.length > 0 ? 'pt-12' : 'pt-32'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          
          {/* Sidebar Filters */}
          <aside className="space-y-8 lg:sticky lg:top-28 text-left">
            {/* Search */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Search Ecosystem</h3>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input 
                  type="text" 
                  placeholder="Keywords, hosts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 focus:border-[#4E7D5B] focus:ring-0 text-xs font-bold text-slate-800 dark:text-slate-200 py-3.5 pl-4 pr-10 rounded-xl outline-none" 
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#4E7D5B] cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Domain Spheres</h3>
              <div className="flex flex-col gap-1.5">
                <button 
                  onClick={() => handleCategoryChange(null)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${
                    !selectedCategory ? 'bg-[#4E7D5B]/10 text-[#4E7D5B]' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/55'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Compass className="w-4 h-4" />
                    All Spheres
                  </span>
                </button>

                {categories.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer text-left ${
                      selectedCategory === cat.slug ? 'bg-[#4E7D5B]/10 text-[#4E7D5B]' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/55'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Switcher */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Experience Format</h3>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => handleFormatChange(null)}
                  className={`px-3 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest text-center transition cursor-pointer ${
                    !selectedFormat ? 'bg-[#4E7D5B] text-white border-transparent' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-slate-500 hover:border-[#4E7D5B]/20'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => handleFormatChange('physical')}
                  className={`px-3 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest text-center transition cursor-pointer ${
                    selectedFormat === 'physical' ? 'bg-[#4E7D5B] text-white border-transparent' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-slate-500 hover:border-[#4E7D5B]/20'
                  }`}
                >
                  Physical
                </button>
                <button 
                  onClick={() => handleFormatChange('online')}
                  className={`px-3 py-2.5 rounded-xl border text-[9px] font-black uppercase tracking-widest text-center transition cursor-pointer ${
                    selectedFormat === 'online' ? 'bg-[#4E7D5B] text-white border-transparent' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-850 text-slate-500 hover:border-[#4E7D5B]/20'
                  }`}
                >
                  Online
                </button>
              </div>
            </div>

            {/* Geolocation lock radar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Nearby Radar</h3>
                {locationLocked && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>}
              </div>

              {locationLocked && (
                <div className="p-3 bg-[#4E7D5B]/5 border border-[#4E7D5B]/10 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SCAN RANGE</span>
                    <span className="text-xs font-black text-[#4E7D5B]">{radius} KM</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="1000" 
                    step="5" 
                    value={radius} 
                    onChange={(e) => handleRadiusChange(e.target.value)}
                    className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#4E7D5B]" 
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={requestLocation}
                  className="flex-1 px-4 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {geoLoading ? (
                    <span>LOCKING...</span>
                  ) : (
                    <>
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>{locationLocked ? 'COORDS LOCKED' : 'LOCK LOCATION'}</span>
                    </>
                  )}
                </button>

                {locationLocked && (
                  <button 
                    onClick={resetRadar}
                    className="w-10 h-10 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl flex items-center justify-center cursor-pointer hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Events Grid */}
          <main className="lg:col-span-3 space-y-8 text-left">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-serif font-bold text-slate-900 dark:text-white leading-tight">
                  {selectedCategory ? (
                    <span>Domain: <span className="text-[#4E7D5B] capitalize">{selectedCategory}</span></span>
                  ) : searchQuery ? (
                    <span>Search Results: <span className="text-[#4E7D5B] italic font-serif">"{searchQuery}"</span></span>
                  ) : (
                    <span>All Experience Spheres</span>
                  )}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Showing {firstItem}-{lastItem} of {totalCount} gatherings
                </p>
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-4 border-[#4E7D5B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading experiences...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map(evt => {
                  const spotsLeft = evt.stats.available;
                  let statusText = 'EXCLUSIVE PASS';
                  let statusColor = 'bg-slate-950/80 dark:bg-slate-900/80 text-white';
                  if (spotsLeft <= 0) {
                    statusText = 'FULLY RESERVED';
                    statusColor = 'bg-rose-500 text-white';
                  } else if (spotsLeft < 15) {
                    statusText = 'LIMITED NODES';
                    statusColor = 'bg-amber-500 text-white';
                  }

                  return (
                    <article key={evt.id} className="premium-card group bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 flex flex-col justify-between h-full">
                      <Link to={`/events/${evt.slug}`} className="flex flex-col justify-between h-full">
                        <div>
                          {/* Banner */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 dark:bg-slate-950">
                            <img 
                              src={evt.banner} 
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              alt={evt.title} 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent"></div>

                            {/* Date Overlay */}
                            <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-xl p-2.5 text-center min-w-[50px] shadow-sm border border-white/20 dark:border-slate-850/20">
                              <span className="block text-[8px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5 leading-none">
                                {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                              </span>
                              <span className="block text-lg font-serif text-slate-900 dark:text-white leading-none font-bold">
                                {new Date(evt.start_date).getDate()}
                              </span>
                            </div>

                            {/* Status badge */}
                            <div className="absolute top-4 right-4">
                              <span className={`px-3 py-1.5 rounded-lg text-[8px] font-black tracking-widest ${statusColor} shadow-md`}>
                                {statusText}
                              </span>
                            </div>

                            {/* Price */}
                            <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-950 dark:text-white px-3.5 py-1.5 rounded-full text-[9px] font-black tracking-widest shadow-sm border border-white/20">
                              {evt.price_range.min === 0 ? 'FREE' : `FROM ₹${evt.price_range.min.toLocaleString('en-IN')}`}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 space-y-2.5">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[#4E7D5B] dark:text-[#8ac99d]">
                              {evt.category}
                            </span>
                            <h4 className="text-base font-serif text-slate-900 dark:text-white font-bold leading-snug group-hover:text-[#4E7D5B] transition-colors line-clamp-2">
                              {evt.title}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-serif italic line-clamp-2 leading-relaxed">
                              {evt.short_description}
                            </p>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between mt-auto">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#4E7D5B]" />
                            {evt.venue ? evt.venue.city : 'Global Domain'}
                          </span>
                          <span className="text-[9px] font-black text-[#4E7D5B] dark:text-[#8bc99d] uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Book &rarr;
                          </span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="py-24 text-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 border-dashed rounded-3xl">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-1.5 font-bold">The map is empty</h3>
                <p className="text-xs text-slate-450 dark:text-slate-400 max-w-xs mx-auto mb-6">No gatherings match the selected filter conditions.</p>
                <button 
                  onClick={resetRadar}
                  className="px-6 py-3 bg-[#4E7D5B] text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-[#3D6449] transition shadow-md cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {lastPage > 1 && (
              <div className="pt-10 flex justify-center items-center gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Page {currentPage} of {lastPage}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                  disabled={currentPage === lastPage}
                  className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </main>

        </div>
      </section>

    </div>
  );
}
