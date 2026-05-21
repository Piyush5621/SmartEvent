<x-app-layout>
    <div class="py-32 bg-cream min-h-screen px-8">
        <div class="max-w-4xl mx-auto space-y-12">
            
            <!-- Breadcrumbs -->
            <div class="flex items-center gap-4">
                <a href="{{ route('user.tickets.index') }}" class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                    <i data-lucide="arrow-left" class="w-3 h-3"></i>
                    Back to collection
                </a>
            </div>

            @if(session('success'))
                <div class="bg-primary/10 border border-primary/20 text-primary px-6 py-4 rounded-2xl flex items-center gap-4">
                    <i data-lucide="check-circle" class="w-5 h-5"></i>
                    <p class="text-sm font-bold tracking-tight">{{ session('success') }}</p>
                </div>
            @endif

            <!-- The Digital Pass -->
            <div class="premium-card bg-white border-slate-100 shadow-2xl shadow-primary/5 overflow-hidden flex flex-col">
                <!-- Pass Header -->
                <div class="relative h-64 overflow-hidden">
                    @if($ticket->event->getFirstMediaUrl('banners'))
                        <img src="{{ $ticket->event->getFirstMediaUrl('banners') }}" class="w-full h-full object-cover">
                    @else
                        <div class="w-full h-full bg-slate-900 flex items-center justify-center">
                            <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
                        </div>
                    @endif
                    <div class="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
                    <div class="absolute bottom-8 left-8 right-8">
                        <span class="status-pill bg-primary text-white border-primary mb-4 inline-block tracking-widest">{{ $ticket->ticketType->name }}</span>
                        <h1 class="text-3xl md:text-4xl font-serif text-slate-900 leading-tight">{{ $ticket->event->title }}</h1>
                    </div>
                </div>

                <!-- Pass Content -->
                <div class="p-12">
                    <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
                        <!-- Left: Info -->
                        <div class="space-y-12">
                            <div class="grid grid-cols-2 gap-8">
                                <div>
                                    <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Arrival</span>
                                    <span class="text-sm font-bold text-slate-900">{{ $ticket->event->start_date->format('l, M d, Y') }}</span>
                                    <span class="block text-xs text-slate-500 mt-1">{{ $ticket->event->start_date->format('g:i A') }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Sanctuary</span>
                                    <span class="text-sm font-bold text-slate-900">{{ $ticket->event->venue ? $ticket->event->venue->name : 'Digital Realm' }}</span>
                                    <span class="block text-xs text-slate-500 mt-1">{{ $ticket->event->venue ? $ticket->event->venue->city : 'Online' }}</span>
                                </div>
                            </div>

                            <div class="pt-8 border-t border-slate-50 grid grid-cols-2 gap-8">
                                <div>
                                    <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Identity Reference</span>
                                    <span class="text-sm font-bold text-primary font-mono">{{ $ticket->booking_reference }}</span>
                                </div>
                                <div>
                                    <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Quantity</span>
                                    <span class="text-sm font-bold text-slate-900">{{ $ticket->quantity }} x Individual Passes</span>
                                </div>
                            </div>

                            <div class="pt-8 border-t border-slate-50">
                                <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Member Identity</span>
                                <div class="flex items-center gap-4">
                                    <img src="https://ui-avatars.com/api/?name={{ urlencode(Auth::user()->name) }}&background=4D7C0F&color=fff" class="w-10 h-10 rounded-full">
                                    <div>
                                        <span class="text-sm font-bold text-slate-900 block leading-none">{{ Auth::user()->name }}</span>
                                        <span class="text-[10px] text-slate-400 uppercase font-bold">{{ Auth::user()->email }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: QR & Pricing -->
                        <div class="bg-cream rounded-[2rem] p-10 flex flex-col items-center text-center">
                            <div class="bg-white p-6 rounded-3xl shadow-xl shadow-primary/5 mb-8 group cursor-pointer">
                                @if($ticket->status === 'confirmed')
                                    <img src="{{ asset('storage/' . $ticket->qr_code_path) }}" alt="QR Code" class="w-32 h-32 transition-transform group-hover:scale-105 duration-500">
                                @else
                                    <div class="w-32 h-32 flex flex-col items-center justify-center text-slate-300 gap-2">
                                        <i data-lucide="lock" class="w-8 h-8"></i>
                                        <span class="text-[10px] font-black uppercase tracking-widest leading-tight">Locked until<br>payment</span>
                                    </div>
                                @endif
                            </div>
                            
                            <div class="mb-8">
                                <span class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Energy Exchanged</span>
                                <span class="text-2xl font-serif text-slate-900">₹{{ number_format($ticket->total_amount) }}</span>
                            </div>

                            <div class="w-full pt-8 border-t border-slate-100 flex flex-col gap-3">
                                @if($ticket->status === 'confirmed')
                                    <a href="{{ route('user.tickets.download', $ticket) }}" class="btn-primary w-full py-4 text-xs">
                                        <i data-lucide="download" class="w-4 h-4 mr-2"></i> Download PDF Pass
                                    </a>
                                    
                                    @php
                                        $gCalStart = $ticket->event->start_date->copy()->setTimezone('UTC')->format('Ymd\THis\Z');
                                        $gCalEnd = $ticket->event->end_date 
                                            ? $ticket->event->end_date->copy()->setTimezone('UTC')->format('Ymd\THis\Z')
                                            : $ticket->event->start_date->copy()->addHours(2)->setTimezone('UTC')->format('Ymd\THis\Z');
                                        
                                        $gCalLocation = $ticket->event->venue 
                                            ? $ticket->event->venue->name . ', ' . $ticket->event->venue->city 
                                            : 'Digital Realm';
                                            
                                        $gCalDetails = "Pass Reference: " . $ticket->booking_reference . "\n" . "Thank you for reserving a passage to this modern eco-experience. Present this digital pass at the entrance.";
                                        
                                        $googleCalendarUrl = "https://calendar.google.com/calendar/render?" . http_build_query([
                                            'action' => 'TEMPLATE',
                                            'text' => $ticket->event->title,
                                            'dates' => $gCalStart . '/' . $gCalEnd,
                                            'details' => $gCalDetails,
                                            'location' => $gCalLocation,
                                        ]);
                                    @endphp
                                    
                                    <a href="{{ $googleCalendarUrl }}" target="_blank" class="w-full py-4 rounded-full border border-[#4E7D5B]/20 text-xs font-black uppercase tracking-widest text-[#4E7D5B] bg-[#4E7D5B]/5 hover:bg-[#4E7D5B] hover:text-white transition-all flex items-center justify-center gap-2">
                                        <i data-lucide="calendar-plus" class="w-4 h-4"></i> Add to Google Calendar
                                    </a>
                                @elseif($ticket->status === 'pending')
                                    <a href="{{ route('payments.checkout', $ticket->payment_id) }}" class="btn-primary w-full py-4 text-xs bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-amber-500/20">
                                        Complete Exchange
                                    </a>
                                @endif

                                @if($ticket->ticketType->is_transferable && $ticket->status === 'confirmed')
                                    <button @click="document.getElementById('transfer-modal').classList.remove('hidden')" 
                                            class="w-full py-4 rounded-full border border-slate-200 text-xs font-black uppercase tracking-widest text-slate-600 hover:border-primary hover:text-primary transition-all">
                                        Transfer Ownership
                                    </button>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Perforated Edge Divider -->
                <div class="h-8 bg-cream relative">
                    <div class="absolute inset-0 flex items-center justify-center">
                        <div class="w-full border-t border-dashed border-slate-200"></div>
                    </div>
                    <div class="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cream -translate-x-4 border-r border-slate-100"></div>
                    <div class="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-cream translate-x-4 border-l border-slate-100"></div>
                </div>
                
                <div class="p-8 bg-white text-center">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                        Present this pass at the sanctuary entrance for seamless entry.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Transfer Modal -->
    <div id="transfer-modal" class="hidden fixed z-[100] inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onclick="document.getElementById('transfer-modal').classList.add('hidden')"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div class="inline-block align-bottom bg-white rounded-[2.5rem] text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form action="{{ route('user.tickets.transfer', $ticket->booking_reference) }}" method="POST">
                    @csrf
                    <div class="bg-white p-10">
                        <div class="text-center">
                            <div class="w-16 h-16 bg-cream rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                <i data-lucide="share-2" class="w-8 h-8"></i>
                            </div>
                            <h3 class="text-2xl font-serif text-slate-900 mb-4" id="modal-title">
                                Transfer Ownership
                            </h3>
                            <p class="text-sm text-slate-500 mb-8 font-serif italic">
                                "Connection is better when shared." Enter the email of the person you want to transfer this pass to.
                            </p>
                            <div class="text-left space-y-4">
                                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Recipient Identity (Email)</label>
                                <input type="email" name="email" required placeholder="recipient@example.com" 
                                       class="form-input w-full">
                            </div>
                        </div>
                    </div>
                    <div class="bg-cream p-8 flex flex-col gap-3">
                        <button type="submit" class="btn-primary w-full py-4 text-xs">
                            Confirm Transfer
                        </button>
                        <button type="button" onclick="document.getElementById('transfer-modal').classList.add('hidden')" 
                                class="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                            Cancel Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</x-app-layout>
