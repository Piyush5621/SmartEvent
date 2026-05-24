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
            'banner' => $this->getFirstMediaUrl('banners') ?: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=600',
            'thumbnail' => $this->getFirstMediaUrl('thumbnails') ?: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=200',
            'category' => $this->category->name ?? null,
            'category_slug' => $this->category->slug ?? null,
            'venue' => $this->venue ? [
                'name' => $this->venue->name,
                'address' => $this->venue->address,
                'city' => $this->venue->city,
                'state' => $this->venue->state,
                'country' => $this->venue->country,
                'pincode' => $this->venue->pincode,
                'latitude' => $this->venue->latitude,
                'longitude' => $this->venue->longitude,
            ] : null,
            'organizer' => $this->organizer ? [
                'id' => $this->organizer->id,
                'name' => $this->organizer->name,
                'email' => $this->organizer->email,
            ] : null,
            'price_range' => [
                'min' => $this->ticketTypes->where('is_active', true)->min('price') ?? 0,
                'max' => $this->ticketTypes->where('is_active', true)->max('price') ?? 0,
            ],
            'stats' => [
                'total_capacity' => $this->total_capacity,
                'registered' => $this->registered_count,
                'available' => $this->total_capacity - $this->registered_count,
            ],
            'ticket_types' => $this->ticketTypes->where('is_active', true)->map(function ($type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'description' => $type->description,
                    'type' => $type->type,
                    'price' => (float) $type->price,
                    'original_price' => $type->original_price ? (float) $type->original_price : null,
                    'quantity_total' => $type->quantity_total,
                    'quantity_sold' => $type->quantity_sold,
                    'max_per_order' => $type->max_per_order,
                    'min_per_order' => $type->min_per_order,
                    'perks' => $type->perks,
                    'is_transferable' => $type->is_transferable,
                    'is_refundable' => $type->is_refundable,
                ];
            })->values(),
            'speakers' => $this->speakers->map(function ($speaker) {
                return [
                    'id' => $speaker->id,
                    'name' => $speaker->name,
                    'designation' => $speaker->designation,
                    'organization' => $speaker->organization,
                    'bio' => $speaker->bio,
                    'photo' => $speaker->photo ? asset('storage/' . $speaker->photo) : 'https://ui-avatars.com/api/?name=' . urlencode($speaker->name) . '&background=4E7D5B&color=fff',
                    'linkedin_url' => $speaker->linkedin_url,
                    'twitter_url' => $speaker->twitter_url,
                ];
            }),
            'sponsors' => $this->sponsors->map(function ($sponsor) {
                return [
                    'id' => $sponsor->id,
                    'name' => $sponsor->name,
                    'logo' => $sponsor->logo ? asset('storage/' . $sponsor->logo) : null,
                    'website_url' => $sponsor->website_url,
                    'tier' => $sponsor->tier,
                ];
            }),
            'sessions' => $this->sessions->sortBy('start_time')->map(function ($session) {
                return [
                    'id' => $session->id,
                    'title' => $session->title,
                    'description' => $session->description,
                    'start_time' => $session->start_time->toIso8601String(),
                    'end_time' => $session->end_time->toIso8601String(),
                    'room_or_track' => $session->room_or_track,
                    'speaker' => $session->speaker ? [
                        'name' => $session->speaker->name,
                    ] : null,
                ];
            })->values(),
            'reviews' => $this->reviews()->approved()->with('user')->latest()->get()->map(function ($review) {
                return [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'created_at' => $review->created_at->diffForHumans(),
                    'user_name' => $review->user->name,
                ];
            }),
            'recommended_events' => \App\Models\Event::published()
                ->upcoming()
                ->where('category_id', $this->category_id)
                ->where('id', '!=', $this->id)
                ->take(3)
                ->get()
                ->map(function ($rec) {
                    return [
                        'id' => $rec->id,
                        'title' => $rec->title,
                        'slug' => $rec->slug,
                        'banner' => $rec->getFirstMediaUrl('banners') ?: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=500',
                        'start_date' => $rec->start_date->toIso8601String(),
                        'city' => $rec->venue ? $rec->venue->city : 'Global',
                        'category' => $rec->category->name ?? null,
                    ];
                }),
            'available_coupons' => \App\Models\Coupon::where('is_active', true)
                ->where('valid_from', '<=', now())
                ->where('valid_until', '>=', now())
                ->where(function ($query) {
                    $query->where('event_id', $this->id)
                          ->orWhere(function ($q) {
                              $q->whereNull('event_id')
                                ->where('organizer_id', $this->organizer_id);
                          });
                })
                ->where(function ($query) {
                    $query->whereNull('usage_limit')
                          ->orWhereRaw('used_count < usage_limit');
                })
                ->get()
                ->map(function ($coupon) {
                    return [
                        'code' => $coupon->code,
                        'type' => $coupon->type,
                        'value' => (float)$coupon->value,
                        'max_discount' => $coupon->max_discount ? (float)$coupon->max_discount : null,
                        'min_order_amount' => (float)$coupon->min_order_amount,
                    ];
                }),
        ];
    }
}

