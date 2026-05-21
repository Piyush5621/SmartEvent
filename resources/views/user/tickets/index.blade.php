<x-app-layout>
    <!-- Header Section -->
    <section class="pt-40 pb-16 px-8 bg-cream border-b border-slate-100 relative overflow-hidden">
        <div class="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="currentColor" class="text-primary"/>
            </svg>
        </div>

        <div class="max-w-[1440px] mx-auto relative z-10">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <span class="status-pill bg-primary/10 text-primary border-primary/20 mb-4 inline-block tracking-widest">COLLECTION</span>
                    <h1 class="heading-display text-slate-900">Your digital <span class="italic text-primary">passports</span>.</h1>
                    <p class="text-lg text-slate-500 mt-4 max-w-xl font-serif">
                        A repository of all your upcoming and past gatherings within the ecosystem.
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <button class="px-6 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-bold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm">
                        Upcoming
                    </button>
                    <button class="px-6 py-2.5 rounded-full bg-transparent text-sm font-bold text-slate-400 hover:text-slate-600 transition-all">
                        Past Records
                    </button>
                </div>
            </div>
        </div>
    </section>

    <div class="py-20 bg-cream min-h-screen px-8">
        <div class="max-w-[1440px] mx-auto">
            
            @if(session('success'))
                <div class="mb-12 bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl flex items-center gap-4 animate-fade-in">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                    <p class="text-sm font-bold tracking-tight">{{ session('success') }}</p>
                </div>
            @endif

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                @forelse($tickets as $ticket)
                    <article class="premium-card group bg-white border-slate-100 hover:border-primary/20 transition-all overflow-hidden flex flex-col h-full">
                        <div class="relative aspect-video overflow-hidden">
                            @if($ticket->event->getFirstMediaUrl('banners'))
                                <img src="{{ $ticket->event->getFirstMediaUrl('banners') }}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                            @else
                                <div class="w-full h-full bg-slate-900 flex items-center justify-center relative">
                                    <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
                                    <i data-lucide="image" class="w-12 h-12 text-slate-700 relative z-10"></i>
                                </div>
                            @endif

                            <!-- Status Badge -->
                            <div class="absolute top-4 right-4">
                                @if($ticket->status === 'confirmed')
                                    <span class="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">Confirmed</span>
                                @elseif($ticket->status === 'pending')
                                    <span class="bg-amber-400 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">Pending</span>
                                @else
                                    <span class="bg-slate-400 text-white text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg capitalize">{{ $ticket->status }}</span>
                                @endif
                            </div>

                            <!-- Ticket Icon Overlay -->
                            <div class="absolute bottom-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center text-primary shadow-sm">
                                <i data-lucide="ticket" class="w-5 h-5"></i>
                            </div>
                        </div>

                        <div class="p-8 flex flex-col flex-1">
                            <div class="flex items-center gap-3 mb-4">
                                <span class="text-[10px] font-black uppercase tracking-widest text-primary leading-none">{{ $ticket->event->start_date->format('M d, Y') }}</span>
                                <div class="w-1 h-1 rounded-full bg-slate-200"></div>
                                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{{ $ticket->event->venue ? $ticket->event->venue->city : 'Online' }}</span>
                            </div>

                            <h3 class="text-xl font-serif text-slate-900 mb-2 group-hover:text-primary transition-colors leading-tight">
                                {{ $ticket->event->title }}
                            </h3>
                            
                            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
                                {{ $ticket->ticketType->name }} &bull; Identity Pass x {{ $ticket->quantity }}
                            </p>

                            <div class="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                                <div>
                                    <span class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Energy Exchanged</span>
                                    <span class="text-lg font-serif text-slate-900">₹{{ number_format($ticket->total_amount) }}</span>
                                </div>
                                <a href="{{ route('user.tickets.show', $ticket->booking_reference) }}" class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group/link">
                                    OPEN PASS
                                    <i data-lucide="arrow-right" class="w-3 h-3 group-hover/link:translate-x-1 transition-transform"></i>
                                </a>
                            </div>
                        </div>
                    </article>
                @empty
                    <div class="col-span-full py-40 text-center bg-white rounded-[3rem] border border-slate-100 border-dashed">
                        <div class="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-8 text-primary/30">
                            <i data-lucide="ticket" class="w-12 h-12"></i>
                        </div>
                        <h3 class="text-2xl font-serif text-slate-900 mb-4">Your collection is empty.</h3>
                        <p class="text-slate-500 mb-10 max-w-sm mx-auto font-serif italic">
                            "The world is waiting for you to explore." Find your first seed of connection on the map.
                        </p>
                        <a href="{{ route('events.index') }}" class="btn-primary px-10 py-4 text-lg">Explore Experiences</a>
                    </div>
                @endforelse
            </div>
            
            @if($tickets->hasPages())
            <div class="mt-20 flex justify-center">
                {{ $tickets->links() }}
            </div>
            @endif
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</x-app-layout>
