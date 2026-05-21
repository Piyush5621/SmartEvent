<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'short_description' => $this->short_description,
            'start_date' => $this->start_date->toIso8601String(),
            'end_date' => $this->end_date->toIso8601String(),
            'type' => $this->type,
            'status' => $this->status,
            'banner' => $this->getFirstMediaUrl('banners'),
            'category' => $this->category->name ?? null,
            'venue' => $this->venue ? [
                'name' => $this->venue->name,
                'address' => $this->venue->address,
                'city' => $this->venue->city,
            ] : null,
            'organizer' => $this->organizer->name ?? null,
            'price_range' => [
                'min' => $this->ticketTypes->min('price'),
                'max' => $this->ticketTypes->max('price'),
            ],
            'stats' => [
                'total_capacity' => $this->total_capacity,
                'registered' => $this->registered_count,
                'available' => $this->available_capacity,
            ]
        ];
    }
}
