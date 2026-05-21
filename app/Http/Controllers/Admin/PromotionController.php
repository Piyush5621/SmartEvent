<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EventPromotion;
use App\Models\EventPromotionPlan;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $plans = EventPromotionPlan::latest()->get();
        $promotions = EventPromotion::with(['event.organizer', 'plan'])
            ->latest()
            ->paginate(15);

        // Compute summary metrics for the Admin view
        $totalEarned = EventPromotion::where('payment_status', 'paid')->sum('amount_paid');
        $pendingCount = EventPromotion::where('status', 'pending')->count();
        $activeCount = EventPromotion::where('status', 'approved')->where('end_date', '>', now())->count();

        return view('admin.promotions.index', compact('plans', 'promotions', 'totalEarned', 'pendingCount', 'activeCount'));
    }

    /**
     * Approve showcase request.
     */
    public function approve(Request $request, $id)
    {
        $promotion = EventPromotion::findOrFail($id);
        $duration = $promotion->plan->duration_days;

        $promotion->update([
            'status' => 'approved',
            'start_date' => now(),
            'end_date' => now()->addDays($duration),
            'payment_status' => 'paid',
        ]);

        return back()->with('success', 'Event showcase approved and assigned to the homepage slider successfully!');
    }

    /**
     * Reject showcase request.
     */
    public function reject(Request $request, $id)
    {
        $promotion = EventPromotion::findOrFail($id);

        $promotion->update([
            'status' => 'rejected',
        ]);

        return back()->with('success', 'Showcase request rejected successfully.');
    }
}
