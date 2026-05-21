<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Payment;
use App\Models\Ticket;
use Illuminate\Http\Request;

class OrganizerController extends Controller
{
    public function stats(Request $request)
    {
        $organizer = $request->user();
        $eventIds = $organizer->organizedEvents()->pluck('id');

        $confirmedTickets = Ticket::whereIn('event_id', $eventIds)
            ->where('status', 'confirmed')
            ->sum('quantity');

        $revenue = Payment::whereIn('event_id', $eventIds)
            ->where('status', 'completed')
            ->sum('amount');

        return response()->json([
            'events_created' => $eventIds->count(),
            'tickets_sold' => $confirmedTickets,
            'total_revenue' => $revenue,
        ]);
    }

    public function attendees(Event $event)
    {
        $user = auth()->user();

        if (!$user->hasRole('admin') && $event->organizer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $attendees = Ticket::with(['user', 'ticketType'])
            ->where('event_id', $event->id)
            ->where('status', 'confirmed')
            ->get()
            ->map(function ($ticket) {
                return [
                    'ticket_reference' => $ticket->booking_reference,
                    'attendee_name' => $ticket->user->name,
                    'attendee_email' => $ticket->user->email,
                    'ticket_type' => $ticket->ticketType->name,
                    'quantity' => $ticket->quantity,
                    'checked_in_at' => optional($ticket->checked_in_at)->toIso8601String(),
                ];
            });

        return response()->json(['data' => $attendees]);
    }
}
