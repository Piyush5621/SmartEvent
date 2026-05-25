<x-admin-layout>
    <x-slot name="header">
        Review Moderation
    </x-slot>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-6 border-b border-slate-100">
            <h2 class="text-lg font-bold text-slate-800">Event Reviews</h2>
            <p class="text-sm text-slate-500 mt-1">Moderate user reviews to maintain quality on the platform.</p>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
                <thead class="text-[11px] text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <tr>
                        <th class="px-6 py-4 font-bold">Reviewer</th>
                        <th class="px-6 py-4 font-bold">Event</th>
                        <th class="px-6 py-4 font-bold">Rating & Comment</th>
                        <th class="px-6 py-4 font-bold">Status</th>
                        <th class="px-6 py-4 text-right font-bold">Action</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    @forelse($reviews as $review)
                        <tr class="hover:bg-slate-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <p class="font-bold text-slate-800">{{ $review->user->name ?? 'Deleted User' }}</p>
                                <p class="text-xs text-slate-500">{{ $review->created_at->format('M d, Y') }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <p class="font-semibold text-slate-700">{{ $review->event->title ?? 'Deleted Event' }}</p>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center text-amber-400 mb-1">
                                    @for($i = 0; $i < $review->rating; $i++)
                                        <i data-lucide="star" class="w-4 h-4 fill-current"></i>
                                    @endfor
                                    @for($i = $review->rating; $i < 5; $i++)
                                        <i data-lucide="star" class="w-4 h-4 text-slate-200"></i>
                                    @endfor
                                </div>
                                <p class="text-slate-600 text-xs italic">"{{ Str::limit($review->comment, 100) }}"</p>
                            </td>
                            <td class="px-6 py-4">
                                @if($review->is_approved)
                                    <span class="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Approved
                                    </span>
                                @else
                                    <span class="inline-flex items-center gap-1.5 text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                                        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending
                                    </span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    @if(!$review->is_approved)
                                        <form action="{{ route('admin.reviews.approve', $review) }}" method="POST">
                                            @csrf
                                            <button type="submit" class="text-emerald-600 hover:text-emerald-800 font-bold text-xs px-2 py-1 bg-emerald-50 rounded">Approve</button>
                                        </form>
                                    @else
                                        <form action="{{ route('admin.reviews.reject', $review) }}" method="POST">
                                            @csrf
                                            <button type="submit" class="text-amber-600 hover:text-amber-800 font-bold text-xs px-2 py-1 bg-amber-50 rounded">Hide</button>
                                        </form>
                                    @endif
                                    <form action="{{ route('admin.reviews.destroy', $review) }}" method="POST" onsubmit="return confirm('Delete this review permanently?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="text-rose-600 hover:text-rose-800 font-bold text-xs px-2 py-1 bg-rose-50 rounded">Delete</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-12 text-center text-slate-500">No reviews found.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        @if($reviews->hasPages())
            <div class="p-6 border-t border-slate-100">
                {{ $reviews->links() }}
            </div>
        @endif
    </div>
</x-admin-layout>
