<?php

namespace App\Http\Controllers\Organizer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function index()
    {
        // Reviews for events owned by the organizer
        $reviews = Review::whereHas('event', function($q) {
            $q->where('organizer_id', Auth::id());
        })->with(['user', 'event'])->latest()->paginate(20);

        return view('organizer.reviews.index', compact('reviews'));
    }

    public function approve(Review $review)
    {
        // Verify ownership
        if ($review->event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $review->update(['is_approved' => true]);

        return back()->with('success', 'Review approved successfully.');
    }

    public function destroy(Review $review)
    {
        // Verify ownership
        if ($review->event->organizer_id !== Auth::id()) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Review deleted successfully.');
    }
}
