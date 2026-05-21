<x-organizer-layout>
    <x-slot name="header">
        Resonance Feedback Moderation
    </x-slot>

    <div class="mb-12">
        <h2 class="text-3xl font-serif text-slate-900 mb-2">Community Echo</h2>
        <p class="text-slate-500 font-serif italic text-sm">"Monitoring the emotional resonance and feedback loops within your gathering ecosystems."</p>
    </div>

    <div class="space-y-12">
        <!-- Resonance Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="premium-card p-10 bg-white border-slate-100 relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700"></div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">AWAITING VERIFICATION</span>
                <div class="text-5xl font-serif text-amber-500 mb-2">{{ $reviews->where('is_approved', false)->count() }}</div>
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Pending Moderation Protocols</p>
            </div>

            <div class="premium-card p-10 bg-[#1E293B] text-white relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700"></div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">AVERAGE RESONANCE</span>
                <div class="text-5xl font-serif text-primary mb-2">{{ number_format($reviews->avg('rating'), 1) ?: '0.0' }}<span class="text-2xl text-white/20 ml-1">/5</span></div>
                <div class="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest">
                    <i data-lucide="star" class="w-3 h-3 fill-current"></i> HIGH FIDELITY FEEDBACK
                </div>
            </div>

            <div class="premium-card p-10 bg-white border-slate-100 relative overflow-hidden group">
                <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-110 transition-transform duration-700"></div>
                <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">COLLECTIVE ECHOES</span>
                <div class="text-5xl font-serif text-slate-900 mb-2">{{ $reviews->total() }}</div>
                <p class="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Resident Reflections</p>
            </div>
        </div>

        <!-- Feedback Ledger -->
        <div class="premium-card bg-white border-slate-100 overflow-hidden shadow-3xl shadow-primary/5 rounded-[3rem]">
            <div class="overflow-x-auto no-scrollbar">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-cream/30">
                            <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resident & Node</th>
                            <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Resonance Score</th>
                            <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Reflection</th>
                            <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                            <th class="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        @forelse($reviews as $review)
                            <tr class="group hover:bg-cream/50 transition-colors duration-500">
                                <td class="px-10 py-8">
                                    <div class="flex items-center gap-5">
                                        <div class="w-12 h-12 rounded-2xl bg-cream flex items-center justify-center border border-slate-100 overflow-hidden group-hover:scale-110 transition-transform duration-500 shadow-sm">
                                            <img src="https://ui-avatars.com/api/?name={{ urlencode($review->user->name) }}&background=4D7C0F&color=fff" class="w-full h-full object-cover">
                                        </div>
                                        <div>
                                            <p class="font-bold text-slate-900 group-hover:text-primary transition-colors leading-none mb-2">{{ $review->user->name }}</p>
                                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ $review->event->title }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-10 py-8">
                                    <div class="flex items-center gap-1.5 text-primary">
                                        @for($i=1; $i<=5; $i++)
                                            <i data-lucide="star" class="w-3.5 h-3.5 {{ $i <= $review->rating ? 'fill-current' : 'text-slate-100' }}"></i>
                                        @endfor
                                    </div>
                                    <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-1 block">RATING: {{ $review->rating }}/5</span>
                                </td>
                                <td class="px-10 py-8">
                                    <p class="text-sm font-serif italic text-slate-600 line-clamp-2 max-w-sm">"{{ $review->comment }}"</p>
                                </td>
                                <td class="px-10 py-8">
                                    @if($review->is_approved)
                                        <span class="status-pill bg-primary/10 text-primary border-primary/20 tracking-widest">AMPLIFIED</span>
                                    @else
                                        <span class="status-pill bg-amber-50 text-amber-500 border-amber-100 tracking-widest">PENDING PROTOCOL</span>
                                    @endif
                                </td>
                                <td class="px-10 py-8 text-right">
                                    <div class="flex items-center justify-end gap-4">
                                        @if(!$review->is_approved)
                                            <form action="{{ route('organizer.reviews.approve', $review) }}" method="POST">
                                                @csrf
                                                @method('PATCH')
                                                <button class="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-500 shadow-sm border border-primary/10">
                                                    <i data-lucide="check" class="w-4 h-4"></i>
                                                </button>
                                            </form>
                                        @endif
                                        <form action="{{ route('organizer.reviews.destroy', $review) }}" method="POST" onsubmit="return confirm('Terminate this reflection node?')">
                                            @csrf
                                            @method('DELETE')
                                            <button class="w-10 h-10 rounded-xl bg-rose-50 text-rose-300 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all duration-500 shadow-sm border border-rose-100">
                                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-10 py-32 text-center bg-cream/20">
                                    <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200 shadow-sm border border-slate-50">
                                        <i data-lucide="message-square" class="w-10 h-10"></i>
                                    </div>
                                    <h3 class="text-2xl font-serif text-slate-900 mb-2">No echoes detected.</h3>
                                    <p class="text-slate-500 font-serif italic max-w-sm mx-auto text-base">Wait for the gathering to conclude for resident reflections to appear.</p>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            @if($reviews->hasPages())
                <div class="p-10 border-t border-slate-50 bg-white">
                    {{ $reviews->links() }}
                </div>
            @endif
        </div>
    </div>

    <script>
        lucide.createIcons();
    </script>
</x-organizer-layout>
