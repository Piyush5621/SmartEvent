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
        $query = Event::published()->upcoming();

        if ($request->has('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $events = $query->with(['category', 'venue', 'organizer'])->latest()->paginate(15);

        return EventResource::collection($events);
    }

    public function show($slug)
    {
        $event = Event::where('slug', $slug)->with(['category', 'venue', 'organizer', 'ticketTypes'])->firstOrFail();
        return new EventResource($event);
    }
}
