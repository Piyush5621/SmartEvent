<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, Event $event)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if user attended the event
        $hasTicket = $event->tickets()->where('user_id', Auth::id())->where('status', 'confirmed')->exists();
        if (!$hasTicket) {
            return back()->with('error', 'You can only review events you have attended.');
        }

        // Check if event has ended
        if ($event->end_date > now()) {
            return back()->with('error', 'You can only leave a review after the event has ended.');
        }

        Review::updateOrCreate(
            ['user_id' => Auth::id(), 'event_id' => $event->id],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
                'is_approved' => false // Moderation by default
            ]
        );

        return back()->with('success', 'Your review has been submitted and is pending approval.');
    }
}
