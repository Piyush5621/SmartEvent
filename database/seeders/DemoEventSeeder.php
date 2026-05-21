<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;
use App\Models\User;
use App\Models\EventCategory;
use App\Models\Venue;
use Illuminate\Support\Str;

class DemoEventSeeder extends Seeder
{
    public function run(): void
    {
        $organizer = User::where('email', 'organizer@smartevent.com')->first();
        $category = EventCategory::first();
        $venue = Venue::first();

        if (!$organizer || !$category || !$venue) return;

        Event::updateOrCreate(
            ['slug' => Str::slug('Global Tech Summit 2026')],
            [
                'organizer_id' => $organizer->id,
                'category_id' => $category->id,
                'venue_id' => $venue->id,
                'title' => 'Global Tech Summit 2026',
                'short_description' => 'The biggest tech conference of the year is back!',
                'description' => 'Join us for three days of inspiration, networking, and the latest in tech.',
                'type' => 'physical',
                'status' => 'published',
                'start_date' => now()->addDays(30)->setHour(10)->setMinute(0),
                'end_date' => now()->addDays(32)->setHour(18)->setMinute(0),
                'total_capacity' => 2000,
                'registered_count' => 150,
                'is_featured' => true,
                'views_count' => 1250,
            ]
        );

        Event::updateOrCreate(
            ['slug' => Str::slug('AI Workshop: Practical LLMs')],
            [
                'organizer_id' => $organizer->id,
                'category_id' => $category->id,
                'venue_id' => $venue->id,
                'title' => 'AI Workshop: Practical LLMs',
                'short_description' => 'Learn how to build real-world applications with AI.',
                'description' => 'Hands-on workshop covering fine-tuning, RAG, and deployment.',
                'type' => 'online',
                'status' => 'draft',
                'start_date' => now()->addDays(15)->setHour(14)->setMinute(0),
                'end_date' => now()->addDays(15)->setHour(17)->setMinute(0),
                'total_capacity' => 100,
                'registered_count' => 0,
                'is_featured' => false,
                'views_count' => 45,
            ]
        );
    }
}
