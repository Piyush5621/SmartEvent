<x-app-layout>
    <!-- Cinematic Ambient Glow Orbs -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-[#4E7D5B]/5 rounded-full blur-[140px]"></div>
        <div class="absolute top-[40%] left-[2%] w-[500px] h-[500px] bg-[#D97706]/3 rounded-full blur-[120px]"></div>
    </div>

    @php
        $activeEventsCount = \App\Models\Event::published()->upcoming()->count();
        $totalVenuesCount = \App\Models\Venue::count();
        $spotsReservedCount = \App\Models\Ticket::where('status', 'confirmed')->count() + 1420;
    @endphp

    <!-- Hero / Header Section -->
    <section class="pt-48 pb-20 px-6 md:px-12 border-b border-slate-100 overflow-hidden relative">
        <div class="max-w-7xl mx-auto relative z-10">
            <div class="max-w-4xl">
                <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#4E7D5B]/5 border border-[#4E7D5B]/10 mb-8 animate-fade-in shadow-sm shadow-[#4E7D5B]/2">
                    <span class="w-2 h-2 rounded-full bg-[#4E7D5B] animate-pulse"></span>
                    <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7D5B]">Live Event Ecosystem Map</span>
                </div>
                <h1 class="text-6xl md:text-8xl font-serif tracking-tight text-slate-900 leading-[1.05] mb-8">
                    Discover <span class="italic text-[#4E7D5B] relative">intentional<span class="absolute bottom-2 left-0 w-full h-2 bg-[#4E7D5B]/5"></span></span> gatherings.
                </h1>
                <p class="text-xl md:text-2xl text-slate-500 leading-relaxed font-serif italic max-w-2xl">
                    "Every space is an architecture; every gathering is a seed for connection."
                </p>
            </div>

            <!-- Search Architecture & Geolocation Radar -->
            <div class="mt-16 max-w-3xl" x-data="locationRadar()">
                <form action="{{ route('events.index') }}" method="GET" id="search-form" class="space-y-6">
                    <!-- Text Search Bar -->
                    <div class="relative group">
                        <div class="absolute -inset-1.5 bg-gradient-to-r from-[#4E7D5B]/10 via-[#4E7D5B]/20 to-[#4E7D5B]/10 rounded-[2.5rem] blur-lg opacity-30 group-focus-within:opacity-60 transition duration-700"></div>
                        <div class="relative flex items-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-3xl shadow-slate-900/5 border border-white/60 overflow-hidden p-2">
                            <div class="pl-6 text-slate-400">
                                <i data-lucide="search" class="w-6 h-6"></i>
                            </div>
                            <input type="text" name="search" value="{{ request('search') }}" 
                                   placeholder="Scan ecosystem domains for gatherings, cities, or hosts..." 
                                   class="flex-1 bg-transparent border-none focus:ring-0 text-lg py-5 px-6 placeholder:text-slate-300 font-medium text-slate-900">
                            
                            <!-- Trigger Collapsible Radar Panel -->
                            <button type="button" @click="radarOpen = !radarOpen" 
                                    class="mr-3 px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 outline-none"
                                    :class="locationLocked ? 'bg-[#4E7D5B]/10 text-[#4E7D5B] border border-[#4E7D5B]/20 shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'">
                                <i data-lucide="radar" class="w-4 h-4 animate-pulse text-[#4E7D5B]" x-show="locationLocked" style="display: none;"></i>
                                <i data-lucide="map-pin" class="w-4 h-4 text-slate-400" x-show="!locationLocked"></i>
                                <span x-text="locationLocked ? 'RADAR ACTIVE' : 'NEARBY RADAR'">NEARBY RADAR</span>
                            </button>

                            <button type="submit" class="btn-primary bg-[#4E7D5B] hover:bg-[#3D6449] px-10 py-4 rounded-full text-xs tracking-widest hidden sm:block">
                                SCAN MAP
                            </button>
                        </div>
                    </div>

                    <!-- Hidden Inputs for Geolocation Coordinates -->
                    <input type="hidden" name="latitude" x-model="lat" :disabled="!locationLocked">
                    <input type="hidden" name="longitude" x-model="lng" :disabled="!locationLocked">
                    
                    @if(request('category'))
                        <input type="hidden" name="category" value="{{ request('category') }}">
                    @endif

                    <!-- Collapsible Geographical Radar Panel -->
                    <div x-show="radarOpen" 
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="opacity-0 -translate-y-4"
                         x-transition:enter-end="opacity-100 translate-y-0"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="opacity-100 translate-y-0"
                         x-transition:leave-end="opacity-0 -translate-y-4"
                         class="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-900/5 relative overflow-hidden"
                         x-cloak>
                        <div class="absolute inset-0 bg-[#4E7D5B]/2 pointer-events-none" style="background-image: radial-gradient(circle, #4E7D5B 0.5px, transparent 0.5px); background-size: 16px 16px;"></div>
                        
                        <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div class="text-left space-y-2 flex-1">
                                <span class="text-[9px] font-black text-[#4E7D5B] uppercase tracking-[0.3em] block">Geographical Scan Configuration</span>
                                <h4 class="text-xl font-serif text-slate-900 leading-tight">Radar Location Range</h4>
                                <p class="text-xs text-slate-500 max-w-md">Lock your browser coordinates and scan for gatherings within a customizable kilometer range.</p>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full md:w-auto">
                                <!-- Range Slider Container -->
                                <div class="w-full sm:w-56 space-y-2 text-left" x-show="locationLocked" style="display: none;">
                                    <div class="flex items-center justify-between">
                                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">SCAN RANGE</span>
                                        <span class="text-xs font-black text-[#4E7D5B]" x-text="radius + ' KM'">50 KM</span>
                                    </div>
                                    <input type="range" name="radius" min="5" max="1000" step="5" x-model="radius" @change="document.getElementById('search-form').submit()"
                                           class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#4E7D5B]">
                                </div>

                                <!-- Action Buttons -->
                                <div class="flex items-center gap-3 w-full sm:w-auto">
                                    <!-- Lock Location Button -->
                                    <button type="button" @click="requestLocation()" 
                                            class="flex-1 sm:flex-none px-6 py-3.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2">
                                        <template x-if="loading">
                                            <svg class="animate-spin -ml-1 mr-2 h-4.5 w-4.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </template>
                                        <i data-lucide="crosshair" class="w-4 h-4" x-show="!loading && !locationLocked"></i>
                                        <i data-lucide="check" class="w-4 h-4" x-show="!loading && locationLocked" style="display: none;"></i>
                                        <span x-text="loading ? 'LOCKING COORDS...' : (locationLocked ? 'COORDINATES LOCKED' : 'LOCK CURRENT LOCATION')">LOCK CURRENT LOCATION</span>
                                    </button>

                                    <!-- Reset Button -->
                                    <button type="button" @click="resetRadar()" x-show="locationLocked" style="display: none;"
                                            class="w-11 h-11 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-full flex items-center justify-center transition-colors">
                                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Latitude/Longitude Coordinates status log overlay -->
                        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest" x-show="locationLocked" style="display: none;">
                            <span class="flex items-center gap-2">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                System Lat/Lng Matrix Locked: <span class="text-slate-800 font-bold" x-text="parseFloat(lat).toFixed(4) + ', ' + parseFloat(lng).toFixed(4)"></span>
                            </span>
                            <span class="text-[#4E7D5B]" x-text="'Scanning ' + radius + ' km radius sphere'"></span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- Ecosystem Real-Time Stats Bar -->
    <section class="border-b border-slate-100 bg-white/40 backdrop-blur-md py-8 px-6 md:px-12">
        <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-[#4E7D5B]/5 flex items-center justify-center text-[#4E7D5B]">
                    <i data-lucide="compass" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Active Gatherings</div>
                    <div class="text-xl font-serif text-slate-900">{{ $activeEventsCount }} Nodes Map</div>
                </div>
            </div>
            <div class="flex items-center gap-4 border-t sm:border-t-0 sm:border-x border-slate-100 pt-6 sm:pt-0 sm:px-8">
                <div class="w-12 h-12 rounded-2xl bg-[#4E7D5B]/5 flex items-center justify-center text-[#4E7D5B]">
                    <i data-lucide="map-pin" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Ecosystem Venues</div>
                    <div class="text-xl font-serif text-slate-900">{{ $totalVenuesCount }} Mapped Cities</div>
                </div>
            </div>
            <div class="flex items-center gap-4 border-t sm:border-t-0 pt-6 sm:pt-0">
                <div class="w-12 h-12 rounded-2xl bg-[#4E7D5B]/5 flex items-center justify-center text-[#4E7D5B]">
                    <i data-lucide="users" class="w-6 h-6"></i>
                </div>
                <div>
                    <div class="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Ecosystem Residents</div>
                    <div class="text-xl font-serif text-slate-900">{{ number_format($spotsReservedCount) }} Confirmed Spots</div>
                </div>
            </div>
        </div>
    </section>

    @if(isset($activeCoupons) && $activeCoupons->count() > 0)
    <!-- Cinematic Resonance Incentives Slideshow -->
    <section class="py-16 px-6 md:px-12 bg-gradient-to-b from-white/20 to-[#4E7D5B]/2 relative overflow-hidden border-b border-slate-100" 
             x-data="{ 
                activeSlide: 0, 
                slidesCount: {{ min(3, $activeCoupons->count()) }},
                copiedCode: '',
                modalOpen: false,
                copyToClipboard(text) {
                    navigator.clipboard.writeText(text);
                    this.copiedCode = text;
                    setTimeout(() => { this.copiedCode = '' }, 2000);
                },
                nextSlide() {
                    this.activeSlide = (this.activeSlide + 1) % this.slidesCount;
                },
                prevSlide() {
                    this.activeSlide = (this.activeSlide - 1 + this.slidesCount) % this.slidesCount;
                }
             }" 
             x-init="setInterval(() => { if(!modalOpen) nextSlide() }, 6000)">
        
        <!-- Subtle Animated Ambient Glow in Widget -->
        <div class="absolute -top-[50%] -left-[10%] w-[350px] h-[350px] bg-[#4E7D5B]/3 rounded-full blur-[80px]"></div>

        <div class="max-w-7xl mx-auto relative z-10">
            <div class="flex flex-col lg:flex-row items-center justify-between gap-12">
                <!-- Left Details / Branding -->
                <div class="text-left space-y-5 max-w-lg">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#4E7D5B]/5 border border-[#4E7D5B]/10 shadow-sm shadow-[#4E7D5B]/2">
                        <span class="w-2 h-2 rounded-full bg-[#4E7D5B] animate-pulse"></span>
                        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#4E7D5B]">Active Resonance Vouchers</span>
                    </div>
                    <h2 class="text-4xl md:text-5xl font-serif tracking-tight text-slate-900 leading-tight">
                        Deploy your <span class="italic text-[#4E7D5B] relative font-normal">resonance incentives.<span class="absolute bottom-2 left-0 w-full h-2 bg-[#4E7D5B]/5"></span></span>
                    </h2>
                    <p class="text-base text-slate-500 font-serif italic leading-relaxed max-w-md">
                        "Promotional vectors function as energy converters—calibrating structural alignment across community nodes."
                    </p>
                    <div class="pt-2">
                        <button @click="modalOpen = true" class="px-8 py-4 rounded-full border border-slate-200 bg-white hover:border-[#4E7D5B] hover:bg-slate-50 text-slate-700 hover:text-[#4E7D5B] text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-sm hover:shadow-md flex items-center gap-2">
                            <i data-lucide="ticket" class="w-3.5 h-3.5 text-[#4E7D5B]"></i> VIEW ALL ACTIVE VOUCHERS ({{ $activeCoupons->count() }})
                        </button>
                    </div>
                </div>

                <!-- Right Slideshow Container -->
                <div class="w-full lg:w-[620px] relative">
                    <!-- Elegant Drop Shadow / Backdrop Glow -->
                    <div class="absolute -inset-4 bg-gradient-to-r from-[#4E7D5B]/5 via-amber-500/2 to-[#4E7D5B]/5 rounded-[3rem] blur-xl opacity-60"></div>
                    
                    <div class="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-3xl shadow-slate-900/5 p-8 md:p-12 min-h-[300px] flex flex-col justify-between">
                        <div class="relative flex-1">
                            @foreach($activeCoupons->take(3) as $index => $coupon)
                            <div x-show="activeSlide === {{ $index }}" 
                                 x-transition:enter="transition ease-out duration-700"
                                 x-transition:enter-start="opacity-0 translate-x-12"
                                 x-transition:enter-end="opacity-100 translate-x-0"
                                 x-transition:leave="transition ease-in duration-400 absolute inset-0"
                                 x-transition:leave-start="opacity-100 translate-x-0"
                                 x-transition:leave-end="opacity-0 -translate-x-12"
                                 class="space-y-6 flex flex-col justify-between h-full">
                                
                                <div>
                                    <!-- Header inside card -->
                                    <div class="flex items-center justify-between mb-4">
                                        <span class="text-[9px] font-black text-[#4E7D5B] bg-[#4E7D5B]/5 px-3.5 py-1.5 rounded-lg border border-[#4E7D5B]/10 uppercase tracking-[0.2em]">
                                            @if($coupon->event)
                                                EVENT-SPECIFIC VOUCHER
                                            @else
                                                OVERALL ECOSYSTEM INCENTIVE
                                            @endif
                                        </span>
                                        <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            TEMPORAL END: {{ $coupon->valid_until->format('M d, Y') }}
                                        </span>
                                    </div>

                                    <!-- Main Discount Value -->
                                    <h3 class="text-3xl md:text-4xl font-serif text-slate-900 leading-none">
                                        @if($coupon->type === 'percentage')
                                            Save <span class="text-[#4E7D5B] font-bold">{{ number_format($coupon->value, 0) }}%</span> on admission pass
                                        @else
                                            Save <span class="text-[#4E7D5B] font-bold">₹{{ number_format($coupon->value, 0) }}</span> on admission pass
                                        @endif
                                    </h3>

                                    <p class="text-xs text-slate-400 font-serif italic mt-3 leading-relaxed">
                                        @if($coupon->event)
                                            Applicable exclusively on: <strong class="text-slate-700 not-italic font-bold">{{ $coupon->event->title }}</strong>
                                        @else
                                            Redeemable across experiences hosted by: <strong class="text-slate-700 not-italic font-bold">{{ $coupon->organizer->name }}</strong>
                                        @endif
                                    </p>
                                </div>

                                <!-- Footer of card with coupon code box and terms -->
                                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-6 border-t border-slate-50 mt-6">
                                    <div class="flex flex-col gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        @if($coupon->min_order_amount > 0)
                                            <span>MIN ORDER VALUE: ₹{{ number_format($coupon->min_order_amount) }}</span>
                                        @endif
                                        @if($coupon->max_discount > 0)
                                            <span class="text-[#4E7D5B]">MAX REDUCTION: ₹{{ number_format($coupon->max_discount) }}</span>
                                        @endif
                                    </div>

                                    <!-- Copy Coupon Interaction -->
                                    <div class="flex items-center bg-slate-50 border border-slate-100 rounded-2xl p-1.5 pl-5 shrink-0 justify-between">
                                        <span class="font-mono font-black text-slate-900 tracking-widest text-sm uppercase mr-4 select-all">{{ $coupon->code }}</span>
                                        <button @click="copyToClipboard('{{ $coupon->code }}')" 
                                                class="px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 outline-none border border-transparent shadow-sm"
                                                :class="copiedCode === '{{ $coupon->code }}' ? 'bg-[#4E7D5B] text-white shadow-xl shadow-[#4E7D5B]/20' : 'bg-white text-slate-700 border-slate-200 hover:border-[#4E7D5B] hover:text-[#4E7D5B]'">
                                            <i data-lucide="check" class="w-3.5 h-3.5" x-show="copiedCode === '{{ $coupon->code }}'"></i>
                                            <i data-lucide="copy" class="w-3.5 h-3.5" x-show="copiedCode !== '{{ $coupon->code }}'"></i>
                                            <span x-text="copiedCode === '{{ $coupon->code }}' ? 'COPIED!' : 'COPY CODE'">COPY CODE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>

                        <!-- Dots / Control Indicators -->
                        <div class="flex items-center justify-between mt-8 pt-4 border-t border-slate-50 shrink-0">
                            <!-- Prev Arrow -->
                            <button @click="prevSlide()" class="w-9 h-9 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#4E7D5B] hover:border-[#4E7D5B]/20 transition-all">
                                <i data-lucide="chevron-left" class="w-4.5 h-4.5"></i>
                            </button>
                            
                            <!-- Slide indicator dots -->
                            <div class="flex items-center gap-2.5">
                                @for($i = 0; $i < min(3, $activeCoupons->count()); $i++)
                                <button @click="activeSlide = {{ $i }}" 
                                        class="h-1.5 rounded-full transition-all duration-500"
                                        :class="activeSlide === {{ $i }} ? 'w-8 bg-[#4E7D5B]' : 'w-1.5 bg-slate-200'"></button>
                                @endfor
                            </div>

                            <!-- Next Arrow -->
                            <button @click="nextSlide()" class="w-9 h-9 rounded-full border border-slate-100 bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-[#4E7D5B] hover:border-[#4E7D5B]/20 transition-all">
                                <i data-lucide="chevron-right" class="w-4.5 h-4.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dynamic Slide-out Sheet for View All Coupons -->
        <div x-show="modalOpen" 
             class="fixed inset-0 z-50 overflow-hidden flex items-center justify-end" 
             x-cloak>
            <!-- Sheet Backdrop -->
            <div x-show="modalOpen" 
                 x-transition:enter="transition ease-out duration-500"
                 x-transition:enter-start="opacity-0"
                 x-transition:enter-end="opacity-100"
                 x-transition:leave="transition ease-in duration-300"
                 x-transition:leave-start="opacity-100"
                 x-transition:leave-end="opacity-0"
                 class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                 @click="modalOpen = false"></div>
            
            <!-- Side Sheet Panel -->
            <div x-show="modalOpen" 
                 x-transition:enter="transition ease-out duration-500 transform"
                 x-transition:enter-start="translate-x-full"
                 x-transition:enter-end="translate-x-0"
                 x-transition:leave="transition ease-in duration-300 transform"
                 x-transition:leave-start="translate-x-0"
                 x-transition:leave-end="translate-x-full"
                 class="relative w-full max-w-xl h-full bg-white shadow-3xl flex flex-col justify-between border-l border-slate-100 z-10">
                
                <!-- Drawer Header -->
                <div class="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h3 class="text-2xl font-serif text-slate-900 mb-1">Ecosystem Incentives</h3>
                        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-[#4E7D5B]">Active Promo Node Index</p>
                    </div>
                    <button @click="modalOpen = false" class="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>

                <!-- Drawer Content -->
                <div class="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                    @foreach($activeCoupons as $coupon)
                    <div class="premium-card bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#4E7D5B]/20 transition-all duration-500 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                        <div class="absolute -right-8 -bottom-8 w-24 h-24 bg-[#4E7D5B]/2 rounded-full blur-xl group-hover:bg-[#4E7D5B]/5 transition-colors"></div>
                        
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="status-pill text-[8px] tracking-widest uppercase {{ $coupon->event ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100' }}">
                                    {{ $coupon->event ? 'EVENT SPECIFIC' : 'GLOBAL COUPON' }}
                                </span>
                                <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                    EXPIRES {{ $coupon->valid_until->format('M d') }}
                                </span>
                            </div>

                            <h4 class="text-lg font-serif text-slate-900">
                                @if($coupon->type === 'percentage')
                                    Get <span class="text-[#4E7D5B] font-bold">{{ number_format($coupon->value, 0) }}% off</span> tickets
                                @else
                                    Get <span class="text-[#4E7D5B] font-bold">₹{{ number_format($coupon->value, 0) }} off</span> tickets
                                @endif
                            </h4>

                            <p class="text-xs text-slate-400 font-serif italic">
                                @if($coupon->event)
                                    Valid exclusively for: <strong class="text-slate-700 not-italic font-bold">{{ $coupon->event->title }}</strong>
                                @else
                                    Valid for overall events hosted by: <strong class="text-slate-700 not-italic font-bold">{{ $coupon->organizer->name }}</strong>
                                @endif
                            </p>
                        </div>

                        <div class="flex items-center justify-between pt-4 border-t border-slate-50 mt-4 gap-4">
                            <div class="flex flex-col gap-1 text-[8px] text-slate-400 font-black uppercase tracking-widest">
                                @if($coupon->min_order_amount > 0)
                                    <span>MIN ORDER: ₹{{ number_format($coupon->min_order_amount) }}</span>
                                @endif
                                @if($coupon->max_discount > 0)
                                    <span class="text-[#4E7D5B]">MAX REDUCTION: ₹{{ number_format($coupon->max_discount) }}</span>
                                @endif
                            </div>

                            <!-- Copy Action inside list card -->
                            <div class="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0">
                                <span class="font-mono font-black text-slate-900 tracking-widest text-xs uppercase mr-3 ml-2 select-all">{{ $coupon->code }}</span>
                                <button @click="copyToClipboard('{{ $coupon->code }}')" 
                                        class="px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 outline-none shadow-sm"
                                        :class="copiedCode === '{{ $coupon->code }}' ? 'bg-[#4E7D5B] text-white shadow-md' : 'bg-white text-slate-700 border border-slate-200 hover:border-[#4E7D5B]'">
                                    <span x-text="copiedCode === '{{ $coupon->code }}' ? 'COPIED' : 'COPY'">COPY</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>

                <!-- Drawer Footer -->
                <div class="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">VOUCHERS REGISTERED ON THIS NODE</span>
                    <button @click="modalOpen = false" class="px-8 py-3.5 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg">
                        CLOSE INDEX
                    </button>
                </div>
            </div>
        </div>
    </section>
    @endif

    <!-- Filters & Main Content -->
    <section class="py-24 px-6 md:px-12 max-w-7xl mx-auto" x-data="{ activeCategory: '{{ request('category', 'all') }}' }">
        <!-- Categories Horizontal Scroll -->
        <div class="mb-20">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div>
                    <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Filter by Domain</h2>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        SHOWING {{ $events->total() }} EXPERIENCE BLUEPRINTS
                    </div>
                    <div class="h-4 w-[1px] bg-slate-100"></div>
                    <button class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-[#4E7D5B] transition-colors">
                        <i data-lucide="sliders-horizontal" class="w-3 h-3"></i> Sort: NEWEST
                    </button>
                </div>
            </div>
            
            <div class="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
                <a href="{{ route('events.index') }}" 
                   class="px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-sm"
                   :class="activeCategory === 'all' ? 'bg-[#4E7D5B] text-white border-[#4E7D5B] shadow-xl shadow-[#4E7D5B]/20' : 'bg-white text-slate-500 border-slate-100 hover:border-[#4E7D5B]/20 hover:text-[#4E7D5B]'">
                    All Spheres
                </a>
                @foreach($categories as $category)
                <a href="?category={{ $category->slug }}" 
                   class="px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border shadow-sm"
                   :class="activeCategory === '{{ $category->slug }}' ? 'bg-[#4E7D5B] text-white border-[#4E7D5B] shadow-xl shadow-[#4E7D5B]/20' : 'bg-white text-slate-500 border-slate-100 hover:border-[#4E7D5B]/20 hover:text-[#4E7D5B]'">
                    {{ $category->name }}
                </a>
                @endforeach
            </div>
        </div>

        <!-- Event Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            @forelse($events as $event)
                @php
                    $spotsLeft = $event->total_capacity - $event->registered_count;
                    $statusText = 'EXCLUSIVE GATHERING';
                    $statusColor = 'bg-white/20 text-white';
                    if ($spotsLeft <= 0) {
                        $statusText = 'FULLY RESERVED';
                        $statusColor = 'bg-rose-500/80 text-white';
                    } elseif ($spotsLeft < 15) {
                        $statusText = 'LIMITED PASSES';
                        $statusColor = 'bg-amber-500/80 text-white';
                    }
                @endphp
                <article class="premium-card group bg-white border border-slate-100 hover:border-[#4E7D5B]/20 rounded-[3rem] p-3 shadow-sm hover:shadow-3xl hover:shadow-[#4E7D5B]/5 transition-all duration-500 hover:-translate-y-2">
                    <a href="{{ route('events.show', $event->slug) }}" class="block">
                        <div class="relative aspect-[16/11] overflow-hidden rounded-[2.5rem]">
                            <img src="{{ $event->getFirstMediaUrl('banners') ?: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000' }}" 
                                 class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                                 alt="{{ $event->title }}">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-100 transition-opacity duration-700"></div>
                            
                            <!-- Date Badge -->
                            <div class="absolute top-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl p-3.5 text-center min-w-[64px] shadow-xl border border-white/40">
                                <span class="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 leading-none">{{ $event->start_date->format('M') }}</span>
                                <span class="block text-2xl font-serif text-slate-900 leading-none">{{ $event->start_date->format('d') }}</span>
                            </div>

                            <!-- Price Badge -->
                            <div class="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-slate-950 px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest shadow-xl border border-white/40">
                                @if($event->ticketTypes->min('price') == 0) FREE @else FROM ₹{{ number_format($event->ticketTypes->min('price')) }} @endif
                            </div>
                            
                            <!-- Ecosystem Status Badge -->
                            <div class="absolute top-6 right-6 z-10">
                                 <span class="status-pill {{ $statusColor }} backdrop-blur-md border-none text-[9px] font-black tracking-widest px-4 py-2 rounded-xl">{{ $statusText }}</span>
                            </div>
                        </div>
                        
                        <div class="p-8 pt-8">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="text-[10px] font-black text-[#4E7D5B] flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <i data-lucide="map-pin" class="w-3.5 h-3.5 text-[#4E7D5B]"></i>
                                    {{ $event->venue ? $event->venue->city : 'Global Domain (Online)' }}
                                </span>
                                <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
                                <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    {{ $event->category->name }}
                                </span>
                            </div>
                            
                            <h3 class="text-2xl font-serif text-slate-950 mb-4 group-hover:text-[#4E7D5B] transition-colors leading-snug">
                                {{ $event->title }}
                            </h3>
                            
                            <p class="text-slate-500 text-sm font-serif italic line-clamp-2 leading-relaxed mb-8">
                                {{ $event->short_description }}
                            </p>
                            
                            <div class="pt-8 border-t border-slate-50 flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="flex -space-x-3">
                                        <img src="https://ui-avatars.com/api/?name=A&background=4E7D5B&color=fff" class="w-9 h-9 rounded-full border-4 border-white shadow-sm">
                                        <img src="https://ui-avatars.com/api/?name=B&background=1E293B&color=fff" class="w-9 h-9 rounded-full border-4 border-white shadow-sm">
                                        <div class="w-9 h-9 rounded-full border-4 border-white bg-cream flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                                            +{{ rand(10, 99) }}
                                        </div>
                                    </div>
                                    <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest">ENROLLED</span>
                                </div>
                                <span class="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] flex items-center gap-2 group-hover:translate-x-1.5 transition-all duration-300">
                                    EXPLORE DETAILS <i data-lucide="arrow-right" class="w-4 h-4 text-[#4E7D5B]"></i>
                                </span>
                            </div>
                        </div>
                    </a>
                </article>
            @empty
                <div class="col-span-full py-48 text-center bg-white rounded-[4rem] border border-slate-100 border-dashed relative overflow-hidden">
                    <div class="absolute inset-0 opacity-5 pointer-events-none">
                        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full scale-150 rotate-45">
                            <path d="M200 0C310.457 0 400 89.543 400 200C400 310.457 310.457 400 200 400C89.543 400 0 310.457 0 200C0 89.543 89.543 0 200 0ZM200 40C111.634 40 40 111.634 40 200C40 288.366 111.634 360 200 360C288.366 360 360 288.366 360 200C360 111.634 288.366 40 200 40Z" fill="currentColor" class="text-slate-300"/>
                        </svg>
                    </div>
                    <div class="relative z-10">
                        <div class="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                            <i data-lucide="map" class="w-10 h-10"></i>
                        </div>
                        <h3 class="text-3xl font-serif text-slate-900 mb-4">The map is silent.</h3>
                        <p class="text-lg text-slate-500 mb-10 max-w-sm mx-auto font-serif italic">We couldn't locate any experience blueprints matching your current scan parameters.</p>
                        <a href="{{ route('events.index') }}" class="btn-primary bg-[#4E7D5B] hover:bg-[#3D6449] px-12 py-5 text-xs tracking-widest shadow-2xl shadow-primary/20">
                            RESET ECOSYSTEM SCAN
                        </a>
                    </div>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        @if($events->hasPages())
            <div class="mt-32 flex justify-center">
                {{ $events->links() }}
            </div>
        @endif
    </section>

    <!-- Host CTA -->
    <section class="px-6 md:px-12 pb-32">
        <div class="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-16 md:p-32 relative overflow-hidden text-center shadow-3xl">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 left-0 w-full h-full" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 40px 40px;"></div>
            </div>
            
            <div class="relative z-10 max-w-4xl mx-auto">
                <span class="text-[#4E7D5B] text-[10px] font-black uppercase tracking-[0.4em] mb-8 block">FOR ARCHITECTS</span>
                <h2 class="text-5xl md:text-7xl font-serif text-white mb-10 leading-tight">Have a vision for a <span class="text-[#4E7D5B] italic relative">gathering?<span class="absolute bottom-2 left-0 w-full h-2 bg-[#4E7D5B]/20"></span></span></h2>
                <p class="text-xl text-slate-400 mb-16 font-serif italic">
                    Join our ecosystem of intentional hosts and bring your community together in a premium environment.
                </p>
                <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
                    <a href="{{ route('organizer.events.index') }}" class="btn-primary bg-[#4E7D5B] hover:bg-[#3D6449] px-16 py-6 text-xs tracking-widest shadow-2xl shadow-[#4E7D5B]/20">
                        START HOSTING
                    </a>
                    <a href="{{ route('about') }}" class="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 group">
                        VIEW SUCCESS RITUALS
                        <div class="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-slate-900 transition-all duration-500">
                            <i data-lucide="chevron-right" class="w-4 h-4"></i>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <script>
        lucide.createIcons();

        function locationRadar() {
            return {
                radarOpen: {{ request()->has('latitude') ? 'true' : 'false' }},
                locationLocked: {{ request()->has('latitude') ? 'true' : 'false' }},
                loading: false,
                lat: '{{ request('latitude', '') }}',
                lng: '{{ request('longitude', '') }}',
                radius: '{{ request('radius', '50') }}',
                
                requestLocation() {
                    if (this.locationLocked) return;
                    
                    this.loading = true;
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                this.lat = position.coords.latitude;
                                this.lng = position.coords.longitude;
                                this.locationLocked = true;
                                this.loading = false;
                                
                                // Auto-submit form after obtaining coordinates to trigger initial search
                                setTimeout(() => {
                                    document.getElementById('search-form').submit();
                                }, 500);
                            },
                            (error) => {
                                alert("Ecosystem coordinates request failed: " + error.message);
                                this.loading = false;
                            }
                        );
                    } else {
                        alert("Geolocation protocols not supported by this node's browser.");
                        this.loading = false;
                    }
                },
                
                resetRadar() {
                    this.lat = '';
                    this.lng = '';
                    this.locationLocked = false;
                    this.radarOpen = false;
                    
                    // Reset request parameter queries and return to base index mapping
                    window.location.href = '{{ route('events.index') }}' + (window.location.search.includes('search=') ? '?search=' + encodeURIComponent('{{ request('search') }}') : '');
                }
            }
        }
    </script>
</x-app-layout>
