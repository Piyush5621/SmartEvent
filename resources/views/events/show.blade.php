<x-app-layout>
    <div x-data="{ showReportModal: false }">
    <!-- Event Banner -->
    <div class="relative h-[65vh] md:h-[75vh] w-full overflow-hidden bg-slate-900">
        <img src="{{ $event->getFirstMediaUrl('banners') ?: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=2000' }}" 
             class="w-full h-full object-cover scale-110 opacity-70 animate-[pulse_10s_infinite]" 
             alt="{{ $event->title }}">
        <div class="absolute inset-0 bg-gradient-to-t from-cream via-cream/40 to-transparent"></div>
        
        <div class="absolute bottom-0 left-0 w-full p-6 md:p-16 lg:p-24">
            <div class="max-w-7xl mx-auto">
                <div class="animate-fade-in">
                    <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl shadow-primary/20">
                        <i data-lucide="sprout" class="w-3.5 h-3.5"></i>
                        {{ $event->category->name }}
                    </div>
                    <h1 class="text-6xl md:text-8xl font-serif text-slate-900 mb-10 max-w-5xl leading-[1.05] tracking-tight">{{ $event->title }}</h1>
                    <div class="flex flex-wrap items-center gap-10 text-slate-500">
                        <div class="flex items-center gap-4 group">
                            <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform">
                                <i data-lucide="calendar" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1.5">Temporal Point</span>
                                <span class="text-base font-bold text-slate-900">{{ $event->start_date->format('l, M d, Y') }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 group">
                            <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform">
                                <i data-lucide="map-pin" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1.5">Geographic Node</span>
                                <span class="text-base font-bold text-slate-900">{{ $event->venue ? $event->venue->name : 'Global Ecosystem (Online)' }}</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 group">
                            <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-xl shadow-primary/5 group-hover:scale-110 transition-transform">
                                <i data-lucide="clock" class="w-6 h-6"></i>
                            </div>
                            <div>
                                <span class="block text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 leading-none mb-1.5">Resonance Time</span>
                                <span class="text-base font-bold text-slate-900">{{ $event->start_date->format('H:i A') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-12 py-24" x-data="{ selectedType: {{ $event->ticketTypes->first()->id ?? 'null' }} }">
        <div class="flex flex-col lg:flex-row gap-24">
            
            <!-- Left Column: Details -->
            <div class="flex-1 space-y-24">
                <!-- Description -->
                <section>
                    <div class="inline-flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                        <div class="w-8 h-[1px] bg-primary/30"></div>
                        THE ARCHITECTURE
                    </div>
                    <div class="prose prose-slate max-w-none text-slate-600 leading-[1.8] text-xl font-serif italic selection:bg-primary/10">
                        {!! nl2br(e($event->description)) !!}
                    </div>
                </section>

                <!-- Sessions / Agenda -->
                @if($event->sessions->count() > 0)
                <section>
                    <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12">THE RHYTHM OF CONNECTION</h2>
                    <div class="space-y-8">
                        @foreach($event->sessions as $session)
                            <div class="premium-card p-10 bg-white border-slate-50 flex flex-col md:flex-row items-start gap-10 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 rounded-[2.5rem]">
                                <div class="md:w-32 shrink-0 text-left md:text-center md:border-r border-slate-100 md:pr-10">
                                    <div class="text-3xl font-serif text-primary mb-1">{{ $session->start_time->format('H:i') }}</div>
                                    <div class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ $session->start_time->format('A') }}</div>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-4 mb-4">
                                        <span class="status-pill bg-cream text-primary border-none tracking-widest text-[9px]">SESSION NODE</span>
                                        <div class="h-[1px] flex-1 bg-slate-50"></div>
                                    </div>
                                    <h4 class="text-2xl font-serif text-slate-900 group-hover:text-primary transition-colors mb-4">{{ $session->title }}</h4>
                                    <p class="text-slate-500 text-base leading-relaxed font-serif italic">{{ $session->description }}</p>
                                    @if($session->speaker)
                                        <div class="mt-8 flex items-center gap-4 p-4 bg-cream/50 rounded-2xl inline-flex group/speaker hover:bg-white hover:shadow-lg transition-all duration-500">
                                            <div class="w-10 h-10 rounded-xl overflow-hidden shadow-sm">
                                                <img src="https://ui-avatars.com/api/?name={{ urlencode($session->speaker->name) }}&background=4D7C0F&color=fff" class="w-full h-full object-cover">
                                            </div>
                                            <div>
                                                <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">VOICE</span>
                                                <span class="text-xs font-black text-slate-900 uppercase tracking-widest">{{ $session->speaker->name }}</span>
                                            </div>
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                </section>
                @endif

                <!-- Location Map -->
                @if($event->venue)
                <section>
                    <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10">GEOGRAPHIC CO-ORDINATES</h2>
                    <div class="premium-card h-96 bg-slate-100 rounded-[3rem] overflow-hidden relative group">
                        <!-- Mock Map / Placeholder with branding -->
                        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 transition-all duration-1000"></div>
                        <div class="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                        
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="bg-white p-8 rounded-[2rem] shadow-2xl border border-slate-100 max-w-sm text-center transform translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                                <div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-primary/20">
                                    <i data-lucide="map-pin" class="w-6 h-6"></i>
                                </div>
                                <h4 class="text-xl font-serif text-slate-900 mb-2">{{ $event->venue->name }}</h4>
                                <p class="text-sm text-slate-500 font-serif italic mb-6">{{ $event->venue->address }}, {{ $event->venue->city }}</p>
                                <a href="https://maps.google.com/?q={{ urlencode($event->venue->address) }}" target="_blank" class="text-[10px] font-black text-primary uppercase tracking-[0.3em] hover:text-slate-900 transition-colors">
                                    OPEN IN NAVIGATOR
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                @endif

                <!-- Reviews -->
                <section class="pt-24 border-t border-slate-100">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
                        <div>
                            <h2 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">RESONANCE FEEDBACK</h2>
                            <h3 class="text-4xl md:text-5xl font-serif text-slate-900 leading-tight">Ecosystem resonance.</h3>
                        </div>
                        <div class="flex items-center gap-10 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-primary/5 border border-slate-50">
                            <div class="text-right border-r border-slate-100 pr-10">
                                <div class="text-5xl font-serif text-slate-900 leading-none mb-2">{{ number_format($event->reviews()->approved()->avg('rating'), 1) ?: '0.0' }}</div>
                                <div class="text-[9px] text-slate-400 font-black uppercase tracking-widest">Aggregate Energy</div>
                            </div>
                            <div class="flex text-primary gap-1">
                                @for($i=1; $i<=5; $i++)
                                    <i data-lucide="star" class="w-6 h-6 {{ $i <= $event->reviews()->approved()->avg('rating') ? 'fill-current' : 'opacity-20' }}"></i>
                                @endfor
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        @forelse($event->reviews()->approved()->with('user')->latest()->get() as $review)
                            <div class="premium-card p-10 bg-white border-slate-50 rounded-[2.5rem] relative group hover:bg-cream/50 transition-colors duration-500">
                                <div class="flex items-center gap-5 mb-8">
                                    <div class="relative">
                                        <img src="https://ui-avatars.com/api/?name={{ urlencode($review->user->name) }}&background=4D7C0F&color=fff" class="w-14 h-14 rounded-2xl border-4 border-white shadow-xl">
                                        <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white border-2 border-white shadow-lg">
                                            <i data-lucide="quote" class="w-3 h-3"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="font-black text-slate-900 uppercase tracking-widest text-[11px] leading-none mb-1.5">{{ $review->user->name }}</div>
                                        <div class="text-[9px] text-slate-400 font-black uppercase tracking-widest">{{ $review->created_at->diffForHumans() }}</div>
                                    </div>
                                </div>
                                <div class="flex text-primary/30 mb-6 gap-0.5">
                                    @for($i=1; $i<=5; $i++)
                                        <i data-lucide="star" class="w-3 h-3 {{ $i <= $review->rating ? 'fill-primary' : '' }}"></i>
                                    @endfor
                                </div>
                                <p class="text-slate-600 text-lg leading-relaxed italic font-serif selection:bg-primary/10">"{{ $review->comment }}"</p>
                            </div>
                        @empty
                            <div class="col-span-full py-32 text-center bg-cream/50 rounded-[3rem] border border-slate-100 border-dashed">
                                <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-sm">
                                    <i data-lucide="message-square" class="w-10 h-10"></i>
                                </div>
                                <p class="text-slate-400 font-serif italic text-lg max-w-xs mx-auto">Be the first node to describe the atmosphere and resonance of this experience.</p>
                            </div>
                        @endforelse
                    </div>
                </section>
            </div>

            <!-- Right Column: Sidebar (Booking) -->
            <div class="w-full lg:w-[480px]">
                <div class="sticky top-32 space-y-10">
                    <!-- Reservation Card -->
                    <div class="premium-card p-12 bg-white border-slate-100 shadow-3xl rounded-[3rem] relative overflow-hidden">
                        <div class="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-24 translate-x-24 blur-[60px]"></div>
                        
                        <div class="relative z-10">
                            <h3 class="text-3xl font-serif text-slate-900 mb-10">Secure your <span class="italic text-primary">spot</span>.</h3>
                            
                            <form action="{{ route('events.book.store', $event) }}" method="POST" class="space-y-10">
                                @csrf
                                <div class="space-y-5">
                                    @foreach($event->ticketTypes as $type)
                                        <label class="block relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 group overflow-hidden"
                                               :class="selectedType == {{ $type->id }} ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/5 ring-4 ring-primary/5' : 'border-slate-50 hover:border-primary/20 hover:bg-cream/50'">
                                            <input type="radio" name="ticket_type_id" value="{{ $type->id }}" class="sr-only" @change="selectedType = {{ $type->id }}" {{ $loop->first ? 'checked' : '' }}>
                                            
                                            <div class="flex justify-between items-start relative z-10">
                                                <div class="flex-1 pr-6">
                                                    <div class="font-black text-[11px] uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors" :class="selectedType == {{ $type->id }} ? 'text-primary' : 'text-slate-500'">{{ $type->name }}</div>
                                                    <div class="text-sm text-slate-400 leading-relaxed font-serif italic group-hover:text-slate-600 transition-colors">{{ $type->description }}</div>
                                                </div>
                                                <div class="text-2xl font-serif text-slate-900 group-hover:scale-110 transition-transform duration-500" :class="selectedType == {{ $type->id }} ? 'text-primary' : ''">
                                                    {{ $type->price == 0 ? 'Free' : '₹' . number_format($type->price) }}
                                                </div>
                                            </div>
                                            
                                            <div class="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                                <i data-lucide="ticket" class="w-24 h-24 rotate-12"></i>
                                            </div>
                                        </label>
                                    @endforeach
                                </div>

                                <div class="pt-10 border-t border-slate-50">
                                    <div class="flex items-center justify-between mb-10">
                                        <div>
                                            <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-1">QUANTITY</span>
                                            <span class="text-xs font-serif italic text-slate-500">Reserved nodes</span>
                                        </div>
                                        <div class="relative group">
                                            <select name="quantity" class="appearance-none bg-cream border-none focus:ring-0 text-[11px] font-black text-slate-900 py-4 pl-8 pr-12 rounded-full cursor-pointer hover:bg-slate-100 transition-colors">
                                                @for($i=1; $i<=10; $i++)
                                                    <option value="{{ $i }}">{{ $i }} NODES</option>
                                                @endfor
                                            </select>
                                            <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary transition-colors">
                                                <i data-lucide="chevron-down" class="w-4 h-4"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" class="btn-primary w-full py-7 text-xs font-black uppercase tracking-[0.4em] shadow-3xl shadow-primary/30 active:scale-95 transition-all">
                                        CONFIRM RESERVATION
                                    </button>
                                    <div class="mt-8 flex items-center justify-center gap-3 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">
                                        <i data-lucide="lock" class="w-3 h-3 text-primary"></i>
                                        SECURED BY GROUNDED ENTERPRISE
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Organizer Info -->
                    <div class="premium-card p-10 bg-cream border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 rounded-[2.5rem]">
                        <div class="flex items-center gap-6">
                            <div class="relative">
                                <img src="https://ui-avatars.com/api/?name={{ urlencode($event->organizer->name) }}&background=4D7C0F&color=fff" class="w-16 h-16 rounded-[1.5rem] shadow-xl group-hover:scale-110 transition-transform duration-700">
                                <div class="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-cream flex items-center justify-center">
                                    <i data-lucide="verified" class="w-2.5 h-2.5 text-white"></i>
                                </div>
                            </div>
                            <div>
                                <div class="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] leading-none mb-2">PRINCIPAL ARCHITECT</div>
                                <div class="text-lg font-serif text-slate-900 group-hover:text-primary transition-colors leading-none">{{ $event->organizer->name }}</div>
                            </div>
                        </div>
                        <div class="w-12 h-12 rounded-[1.25rem] bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary group-hover:rotate-12 transition-all duration-500 shadow-sm">
                            <i data-lucide="mail" class="w-5 h-5"></i>
                        </div>
                    </div>
                    
                    <!-- Report Copyright / Legal Violation -->
                    <div class="pt-6 flex justify-center">
                        <button @click="showReportModal = true" class="text-[9px] font-black text-rose-500/80 hover:text-rose-600 uppercase tracking-[0.25em] flex items-center gap-2 transition-all p-3 bg-rose-500/5 hover:bg-rose-500/10 rounded-full px-6 border border-rose-500/10">
                            <i data-lucide="shield-alert" class="w-3.5 h-3.5 text-rose-500"></i>
                            Report Violation
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Recommendations Section -->
    @if($recommendedEvents->count() > 0)
    <section class="py-32 px-6 md:px-12 bg-cream border-t border-slate-100 overflow-hidden">
        <div class="max-w-7xl mx-auto">
            <div class="flex items-end justify-between mb-16">
                <div>
                    <span class="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">RESONANCE MAP</span>
                    <h2 class="text-4xl md:text-5xl font-serif text-slate-900">Related Architectures</h2>
                </div>
                <a href="{{ route('events.index') }}" class="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-[0.3em] transition-colors">
                    VIEW ALL NODES
                </a>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                @foreach($recommendedEvents as $rec)
                    <a href="{{ route('events.show', $rec->slug) }}" class="premium-card bg-white border-slate-50 group overflow-hidden rounded-[2.5rem] hover:shadow-3xl hover:shadow-primary/5 transition-all duration-1000">
                        <div class="aspect-[16/10] relative overflow-hidden m-2 rounded-[2rem]">
                            <img src="{{ $rec->getFirstMediaUrl('banners') ?: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=500' }}" 
                                 class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110">
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div class="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary border border-white/50">
                                {{ $rec->category->name }}
                            </div>
                        </div>
                        <div class="p-8 pt-4">
                            <h4 class="text-xl font-serif text-slate-900 group-hover:text-primary transition-colors truncate mb-4">{{ $rec->title }}</h4>
                            <div class="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span class="flex items-center gap-2"><i data-lucide="calendar" class="w-3.5 h-3.5 text-primary"></i> {{ $rec->start_date->format('M d') }}</span>
                                <span class="flex items-center gap-2"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-primary"></i> {{ $rec->venue->city ?? 'Global' }}</span>
                            </div>
                        </div>
                    </a>
                @endforeach
            </div>
        </div>
    </section>
    @endif
    <!-- Copyright & Legal Violation Report Modal -->
    <div x-show="showReportModal" 
         class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md transition-all"
         x-transition:enter="ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         style="display: none;">
        
        <div class="relative w-full max-w-xl bg-white border border-slate-100 shadow-2xl rounded-[3rem] p-12 overflow-hidden"
             @click.away="showReportModal = false">
            <div class="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -translate-y-12 translate-x-12 blur-[40px]"></div>
            
            <div class="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                        <i data-lucide="shield-alert" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-serif text-slate-900 leading-tight">Report Violation</h3>
                        <span class="text-[9px] font-black text-rose-500 uppercase tracking-widest block mt-0.5">Ecosystem Security Audit</span>
                    </div>
                </div>
                <button @click="showReportModal = false" class="text-slate-400 hover:text-slate-600 transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>

            @auth
                <form action="{{ route('events.report.store', $event) }}" method="POST" class="space-y-6">
                    @csrf
                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Subject / Classification</label>
                        <select name="subject" required class="w-full bg-cream border-slate-100 focus:border-rose-400 focus:ring-0 text-sm font-bold text-slate-800 py-4 px-6 rounded-2xl cursor-pointer">
                            <option value="Copyright / Intellectual Property Violation">Copyright / Intellectual Property Violation</option>
                            <option value="Illegal / Fraudulent Content">Illegal / Fraudulent Content</option>
                            <option value="Community Violations & Harassment">Community Violations & Harassment</option>
                            <option value="Other Regulatory Restrictions">Other Regulatory Restrictions</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Evidence URL (Optional)</label>
                        <input type="url" name="evidence_url" placeholder="https://..." class="w-full bg-cream border-slate-100 focus:border-rose-400 focus:ring-0 text-sm font-bold text-slate-800 py-4 px-6 rounded-2xl">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Detailed Narrative & Context</label>
                        <textarea name="description" required rows="4" placeholder="Please describe the copyright infringement or illegal issue in detail..." class="w-full bg-cream border-slate-100 focus:border-rose-400 focus:ring-0 text-sm text-slate-800 py-4 px-6 rounded-3xl"></textarea>
                    </div>

                    <div class="pt-4 flex gap-4">
                        <button type="button" @click="showReportModal = false" class="flex-1 py-4 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-600 hover:border-slate-300 transition-all">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 py-4 rounded-full bg-rose-500 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                            Submit Audit Request
                        </button>
                    </div>
                </form>
            @else
                <div class="text-center py-8">
                    <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
                        <i data-lucide="lock" class="w-8 h-8"></i>
                    </div>
                    <p class="text-slate-600 font-serif italic text-lg mb-8">Authentication is required to initiate a security audit request.</p>
                    <a href="{{ route('login') }}" class="btn-primary inline-block px-10 py-4 text-xs font-black uppercase tracking-widest bg-rose-500 border-rose-600 shadow-rose-500/20 hover:bg-rose-600">
                        Login Passage
                    </a>
                </div>
            @endauth
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
    </div>
</x-app-layout>
