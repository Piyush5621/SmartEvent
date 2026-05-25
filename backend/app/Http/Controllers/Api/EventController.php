<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventResource;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = Event::published()->upcoming()->where('is_restricted', false);

        if ($request->has('category') && $request->category) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Geolocation Radius Search (Nearby Me with range in km)
        if ($request->filled('latitude') && $request->filled('longitude') && $request->filled('radius')) {
            $latitude = (float) $request->latitude;
            $longitude = (float) $request->longitude;
            $radius = (float) $request->radius;

            $query->whereHas('venue', function ($q) use ($latitude, $longitude, $radius) {
                $q->whereNotNull('latitude')
                  ->whereNotNull('longitude')
                  ->whereRaw(
                      "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) <= ?",
                      [$latitude, $longitude, $latitude, $radius]
                  );
            });
        }

        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('short_description', 'like', '%' . $request->search . '%');
            });
        }

        $events = $query->with(['category', 'venue', 'organizer'])->latest()->paginate(12);

        // Fetch actively promoted events
        $promotedEvents = Event::published()
            ->upcoming()
            ->where('is_restricted', false)
            ->where(function($query) {
                $query->where('is_featured', true)
                      ->orWhereHas('promotions', function($q) {
                          $q->where('status', 'approved')
                            ->where('payment_status', 'paid')
                            ->where('start_date', '<=', now())
                            ->where('end_date', '>=', now());
                      });
            })
            ->with(['category', 'venue', 'organizer'])
            ->latest()
            ->get();

        return response()->json([
            'data' => EventResource::collection($events)->response()->getData(true)['data'],
            'meta' => EventResource::collection($events)->response()->getData(true)['meta'],
            'promoted' => EventResource::collection($promotedEvents)
        ]);
    }

    public function show($slug)
    {
        $event = Event::where('slug', $slug)->with(['category', 'venue', 'organizer', 'ticketTypes'])->firstOrFail();
        return new EventResource($event);
    }
}
