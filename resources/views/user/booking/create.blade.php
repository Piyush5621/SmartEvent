<x-guest-layout>
    <div class="py-12 bg-gray-50 min-h-screen">
        <div class="max-w-3xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-2xl">
                <!-- Header -->
                <div class="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-8 text-white relative overflow-hidden">
                    <div class="relative z-10">
                        <span class="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-sm">Checkout</span>
                        <h1 class="text-3xl font-bold mt-4">{{ $event->title }}</h1>
                        <p class="mt-2 text-indigo-100 flex items-center">
                            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {{ $event->start_date->format('l, F j, Y \a\t g:i A') }}
                        </p>
                    </div>
                </div>

                <div class="p-8">
                    @if(session('error'))
                        <div class="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" /></svg>
                                </div>
                                <div class="ml-3">
                                    <p class="text-sm text-red-700">{{ session('error') }}</p>
                                </div>
                            </div>
                        </div>
                    @endif

                    <form action="{{ route('events.book.store', $event) }}" method="POST" id="booking-form">
                        @csrf
                        
                        <h3 class="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Select Tickets</h3>
                        
                        <div class="space-y-4 mb-8">
                            @foreach($event->ticketTypes as $ticket)
                                @php 
                                    $isAvailable = $ticket->quantity_sold < $ticket->quantity_total;
                                    $isSaleStarted = !$ticket->sale_starts_at || now()->gte($ticket->sale_starts_at);
                                    $isSaleEnded = $ticket->sale_ends_at && now()->gt($ticket->sale_ends_at);
                                    $canBuy = $isAvailable && $isSaleStarted && !$isSaleEnded;
                                @endphp
                                <label class="relative block bg-white border rounded-xl p-5 cursor-pointer hover:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500 transition shadow-sm {{ !$canBuy ? 'opacity-60 bg-gray-50' : '' }}">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 mr-4">
                                                <input type="radio" name="ticket_type_id" value="{{ $ticket->id }}" class="h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500" {{ !$canBuy ? 'disabled' : '' }} required onchange="updateTotal({{ $ticket->price }})">
                                            </div>
                                            <div>
                                                <span class="block text-lg font-bold text-gray-900">{{ $ticket->name }}</span>
                                                <span class="block text-sm text-gray-500 mt-1">{{ $ticket->description ?? ucfirst($ticket->type) }}</span>
                                            </div>
                                        </div>
                                        <div class="text-right">
                                            @if($ticket->price > 0)
                                                <span class="block text-xl font-bold text-indigo-600">₹{{ number_format($ticket->price, 2) }}</span>
                                                @if($ticket->original_price)
                                                    <span class="block text-sm text-gray-400 line-through">₹{{ number_format($ticket->original_price, 2) }}</span>
                                                @endif
                                            @else
                                                <span class="block text-xl font-bold text-green-600">Free</span>
                                            @endif
                                        </div>
                                    </div>
                                    
                                    @if(!$canBuy)
                                        <div class="mt-4 pt-3 border-t text-sm font-semibold text-red-500">
                                            @if(!$isAvailable)
                                                Sold Out
                                            @elseif(!$isSaleStarted)
                                                Sale starts {{ $ticket->sale_starts_at->format('M d, Y') }}
                                            @elseif($isSaleEnded)
                                                Sales Ended
                                            @endif
                                        </div>
                                    @endif
                                </label>
                            @endforeach
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
                                <select name="quantity" id="quantity" required class="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg" onchange="updateTotal(null)">
                                    @for($i = 1; $i <= 10; $i++)
                                        <option value="{{ $i }}">{{ $i }}</option>
                                    @endfor
                                </select>
                            </div>
                            
                            <div>
                                <label for="coupon_code" class="block text-sm font-medium text-gray-700">Coupon Code (Optional)</label>
                                <div class="mt-1 flex rounded-md shadow-sm">
                                    <input type="text" name="coupon_code" id="coupon_code" class="flex-1 min-w-0 block w-full px-3 py-2.5 rounded-none rounded-l-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 uppercase font-mono" placeholder="Enter code">
                                    <button type="button" onclick="applyCoupon()" class="inline-flex items-center px-5 py-2.5 border border-l-0 border-gray-300 rounded-r-md bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition duration-300 shadow-sm">
                                        Apply
                                    </button>
                                </div>
                                
                                <!-- Coupon Feedback Alert -->
                                <div id="coupon-feedback" class="mt-3 hidden text-xs font-semibold px-4 py-3 rounded-xl border"></div>

                                <!-- Available Vouchers Grid -->
                                @if(isset($availableCoupons) && $availableCoupons->count() > 0)
                                <div class="mt-5 space-y-2">
                                    <span class="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Vouchers on this Experience:</span>
                                    <div class="flex flex-wrap gap-3">
                                        @foreach($availableCoupons as $avCoupon)
                                        <button type="button" onclick="selectCoupon('{{ $avCoupon->code }}')" class="inline-flex flex-col items-start px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition text-left group shrink-0">
                                            <span class="font-mono font-black text-xs text-slate-800 tracking-wider group-hover:text-indigo-700">{{ $avCoupon->code }}</span>
                                            <span class="text-[9px] text-slate-500 mt-1 flex items-center gap-1.5">
                                                @if($avCoupon->type === 'percentage')
                                                    {{ number_format($avCoupon->value, 0) }}% OFF
                                                @else
                                                    ₹{{ number_format($avCoupon->value, 0) }} OFF
                                                @endif
                                                @if($avCoupon->min_order_amount > 0)
                                                    <span class="text-slate-400 font-medium">(Min ₹{{ number_format($avCoupon->min_order_amount, 0) }})</span>
                                                @endif
                                            </span>
                                        </button>
                                        @endforeach
                                    </div>
                                </div>
                                @endif
                            </div>
                        </div>

                        <!-- Attendee Details (Simplified for now) -->
                        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
                            <h4 class="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Buyer Information</h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="block text-gray-500">Name</span>
                                    <span class="block font-medium">{{ Auth::user()->name }}</span>
                                </div>
                                <div>
                                    <span class="block text-gray-500">Email</span>
                                    <span class="block font-medium">{{ Auth::user()->email }}</span>
                                </div>
                            </div>
                            <p class="mt-4 text-xs text-gray-500">Tickets will be sent to this email address.</p>
                        </div>

                        <!-- Order Summary -->
                        <div class="border-t border-gray-200 pt-6 flex justify-between items-end">
                            <div>
                                <p class="text-sm text-gray-500">Total Amount</p>
                                <p class="text-3xl font-bold text-gray-900" id="total-display">₹0.00</p>
                            </div>
                            <button type="submit" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all">
                                Proceed to Payment &rarr;
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script>
        let selectedPrice = 0;
        let discountAmount = 0;
        let appliedCoupon = null;

        function selectCoupon(code) {
            document.getElementById('coupon_code').value = code;
            applyCoupon();
        }

        async function applyCoupon() {
            const codeInput = document.getElementById('coupon_code');
            const code = codeInput.value.trim();
            const feedbackEl = document.getElementById('coupon-feedback');
            
            if (!code) {
                // Reset coupon if empty
                discountAmount = 0;
                appliedCoupon = null;
                feedbackEl.classList.add('hidden');
                updateTotalDisplay();
                return;
            }

            // Must select a ticket first
            const selectedTicketRadio = document.querySelector('input[name="ticket_type_id"]:checked');
            if (!selectedTicketRadio) {
                feedbackEl.className = "mt-3 text-xs font-semibold px-4 py-3 rounded-xl border bg-yellow-50 border-yellow-200 text-yellow-800";
                feedbackEl.innerText = "Please select a ticket type before applying the coupon.";
                feedbackEl.classList.remove('hidden');
                codeInput.value = '';
                return;
            }

            const ticketTypeId = selectedTicketRadio.value;
            const quantity = parseInt(document.getElementById('quantity').value) || 1;

            try {
                feedbackEl.className = "mt-3 text-xs font-semibold px-4 py-3 rounded-xl border bg-slate-50 border-slate-200 text-slate-500 animate-pulse";
                feedbackEl.innerText = "Validating incentive node...";
                feedbackEl.classList.remove('hidden');

                const response = await fetch("{{ route('events.validate-coupon', $event) }}", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        coupon_code: code,
                        ticket_type_id: ticketTypeId,
                        quantity: quantity
                    })
                });

                const data = await response.json();

                if (response.ok && data.valid) {
                    discountAmount = parseFloat(data.discount);
                    appliedCoupon = data;
                    feedbackEl.className = "mt-3 text-xs font-semibold px-4 py-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center justify-between";
                    feedbackEl.innerHTML = `
                        <span>${data.message}</span>
                        <button type="button" onclick="clearCoupon()" class="text-emerald-700 hover:text-emerald-900 underline font-black uppercase tracking-wider ml-2">Remove</button>
                    `;
                } else {
                    discountAmount = 0;
                    appliedCoupon = null;
                    feedbackEl.className = "mt-3 text-xs font-semibold px-4 py-3 rounded-xl border bg-rose-50 border-rose-200 text-rose-800";
                    feedbackEl.innerText = data.message || "Invalid coupon code.";
                }
            } catch (error) {
                discountAmount = 0;
                appliedCoupon = null;
                feedbackEl.className = "mt-3 text-xs font-semibold px-4 py-3 rounded-xl border bg-rose-50 border-rose-200 text-rose-800";
                feedbackEl.innerText = "Could not validate coupon. Please try again.";
            }

            updateTotalDisplay();
        }

        function clearCoupon() {
            document.getElementById('coupon_code').value = '';
            discountAmount = 0;
            appliedCoupon = null;
            document.getElementById('coupon-feedback').classList.add('hidden');
            updateTotalDisplay();
        }

        function updateTotal(price) {
            if (price !== null) {
                selectedPrice = parseFloat(price);
            }
            
            // If coupon is already applied, re-apply it to update discount based on quantity / new ticket type
            if (document.getElementById('coupon_code').value.trim()) {
                applyCoupon();
            } else {
                updateTotalDisplay();
            }
        }

        function updateTotalDisplay() {
            const quantity = parseInt(document.getElementById('quantity').value) || 1;
            const subtotal = selectedPrice * quantity;
            const total = Math.max(0, subtotal - discountAmount);

            const displayEl = document.getElementById('total-display');
            
            if (subtotal === 0) {
                displayEl.innerHTML = '<span class="text-green-600 font-bold text-3xl">Free</span>';
            } else if (discountAmount > 0) {
                displayEl.innerHTML = `
                    <div class="text-right">
                        <span class="block text-sm text-slate-400 line-through">₹${subtotal.toFixed(2)}</span>
                        <span class="block text-xs text-emerald-600 font-semibold">- ₹${discountAmount.toFixed(2)}</span>
                        <span class="block text-3xl font-bold text-slate-900 mt-1">₹${total.toFixed(2)}</span>
                    </div>
                `;
            } else {
                displayEl.innerHTML = `<span class="block text-3xl font-bold text-slate-900">₹${total.toFixed(2)}</span>`;
            }
        }
    </script>
</x-guest-layout>
