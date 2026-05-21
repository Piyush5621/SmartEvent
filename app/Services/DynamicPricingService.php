<?php

namespace App\Services;

use App\Models\TicketType;

class DynamicPricingService
{
    /**
     * Calculate current dynamic price for a ticket type based on demand and time.
     */
    public function getCurrentPrice(TicketType $ticketType): float
    {
        $basePrice = $ticketType->price;
        
        if ($basePrice <= 0) {
            return 0; // Free tickets remain free
        }

        // Feature toggle or check if dynamic pricing is enabled on the event/ticket
        // For demonstration, we assume it's always enabled if this service is called

        $multiplier = 1.0;

        // 1. Time-based dynamic pricing (increase as event approaches)
        $eventStartDate = $ticketType->event->start_date;
        $daysUntilEvent = now()->diffInDays($eventStartDate, false);

        if ($daysUntilEvent > 0 && $daysUntilEvent <= 7) {
            // Last 7 days: price goes up by 15%
            $multiplier += 0.15;
        } elseif ($daysUntilEvent > 0 && $daysUntilEvent <= 30) {
            // Last 30 days: price goes up by 5%
            $multiplier += 0.05;
        }

        // 2. Demand-based pricing (scarcity)
        $soldRatio = $ticketType->quantity_sold / max($ticketType->quantity_total, 1);
        
        if ($soldRatio >= 0.9) {
            // 90% sold out: surge price by 25%
            $multiplier += 0.25;
        } elseif ($soldRatio >= 0.75) {
            // 75% sold out: surge price by 10%
            $multiplier += 0.10;
        }

        // Calculate final price and round to 2 decimals
        return round($basePrice * $multiplier, 2);
    }
}
