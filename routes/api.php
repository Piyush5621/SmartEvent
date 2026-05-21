<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentWebhookController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\OrganizerController;

Route::middleware(['throttle:api'])->group(function () {
    // Public Routes
    Route::get('/events', [EventController::class, 'index']);
    Route::get('/events/{slug}', [EventController::class, 'show']);

    Route::prefix('v1')->name('api.v1.')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');

        Route::get('/events', [EventController::class, 'index'])->name('events.index');
        Route::get('/events/{slug}', [EventController::class, 'show'])->name('events.show');

        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/user', function (Request $request) {
                return $request->user();
            })->name('user');

            Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');

            Route::get('/my-tickets', [TicketController::class, 'index'])->name('tickets.index');
            Route::get('/my-waitlists', [TicketController::class, 'waitlists'])->name('waitlists.index');

            Route::middleware(['role:organizer|admin'])->prefix('organizer')->group(function () {
                Route::get('/stats', [OrganizerController::class, 'stats'])->name('stats');
                Route::get('/events/{event}/attendees', [OrganizerController::class, 'attendees'])->name('events.attendees');
            });
        });
    });
});

// Webhooks
Route::post('/webhooks/stripe', [PaymentWebhookController::class, 'handleStripe']);
Route::post('/webhooks/razorpay', [PaymentWebhookController::class, 'handleRazorpay']);