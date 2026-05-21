<?php

namespace App\Models;

use Database\Factories\EventFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Support\Str;

class Event extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected static function newFactory(): EventFactory
    {
        return EventFactory::new();
    }

    protected $guarded = [];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'registration_start' => 'datetime',
        'registration_end' => 'datetime',
        'tags' => 'array',
        'faqs' => 'array',
        'is_featured' => 'boolean',
        'is_recurring' => 'boolean',
        'requires_approval' => 'boolean',
    ];

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    // Boot method for slug generation (substitute for HasSlug)
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($event) {
            if (empty($event->slug)) {
                $event->slug = Str::slug($event->title) . '-' . Str::random(6);
            }
        });
    }

    // Relationships
    public function organizer() { return $this->belongsTo(User::class, 'organizer_id'); }
    public function category() { return $this->belongsTo(EventCategory::class); }
    public function venue() { return $this->belongsTo(Venue::class); }
    public function ticketTypes() { return $this->hasMany(TicketType::class); }
    public function tickets() { return $this->hasMany(Ticket::class); }
    public function sessions() { return $this->hasMany(EventSession::class); }
    public function speakers() { return $this->hasMany(Speaker::class); }
    public function sponsors() { return $this->hasMany(Sponsor::class); }
    public function waitlists() { return $this->hasMany(Waitlist::class); }
    public function reviews() { return $this->hasMany(Review::class); }
    public function copyrightReports() { return $this->hasMany(CopyrightReport::class); }
    public function promotions() { return $this->hasMany(EventPromotion::class); }
    public function activePromotion() { return $this->hasOne(EventPromotion::class)->where('status', 'approved')->where('end_date', '>', now()); }

    // Scopes
    public function scopePublished($q) { return $q->where('status', 'published'); }
    public function scopeUpcoming($q) { return $q->where('start_date', '>=', now()); }
    public function scopeFeatured($q) { return $q->where('is_featured', true); }

    // Accessors
    public function getAvailableCapacityAttribute() {
        return $this->total_capacity - $this->registered_count;
    }
    public function getIsFullAttribute() {
        return $this->registered_count >= $this->total_capacity;
    }
    public function registerMediaConversions(\Spatie\MediaLibrary\MediaCollections\Models\Media $media = null): void
    {
        $this->addMediaConversion('thumb')
              ->width(400)
              ->height(225)
              ->sharpen(10);
    }
}
