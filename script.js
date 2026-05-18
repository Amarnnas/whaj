// ============================================
// JavaScript - قرطاسية وهج E-Commerce
// ============================================

// Global Variables
let cart = [];
const WHATSAPP_NUMBER = "249900079075";

/**
 * Toggle the shopping cart sidebar
 */
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('-translate-x-full');
}

/**
 * Add item to cart
 * @param {string} name - Product name
 * @param {number} price - Product price
 */
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`تم إضافة "${name}" للسلة`);
}

/**
 * Remove item from cart by index
 * @param {number} index - Item index in cart array
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

/**
 * Update the cart UI with current cart items
 */
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('cart-total');

    // Update cart count badge
    count.innerText = cart.length;

    // Show empty cart message if no items
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-slate-400 space-y-4 opacity-50">
                <svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                <p class="font-black text-lg">السلة فارغة حالياً</p>
            </div>`;
        total.innerHTML = '0 <span class="text-sm">ج.س</span>';
        return;
    }

    // Render cart items
    container.innerHTML = cart
        .map(
            (item, index) => `
            <div class="bg-white border border-slate-100 p-4 rounded-xl flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                <div>
                    <p class="font-black text-wahajDeepNavy">${item.name}</p>
                    <p class="text-wahajGlowAmber font-bold mt-1">${item.price.toLocaleString()} ج.س</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-400 hover:bg-red-50 hover:text-red-600 p-2 rounded-lg transition-colors focus:outline-none" title="إزالة">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        `
        )
        .join('');

    // Calculate and display total
    const sum = cart.reduce((acc, item) => acc + item.price, 0);
    total.innerHTML = `${sum.toLocaleString()} <span class="text-sm">ج.س</span>`;
}

/**
 * Show a toast notification message
 * @param {string} msg - Message to display
 */
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');

    toastMsg.innerText = msg;
    toast.classList.remove('translate-y-32');

    // Auto-hide after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-y-32');
    }, 3000);
}

/**
 * Validate customer data
 * @returns {object|null} - Returns customer data or null if invalid
 */
function validateCustomerData() {
    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    // Check if cart is empty
    if (cart.length === 0) {
        showToast('السلة فارغة! يرجى إضافة منتجات.');
        return null;
    }

    // Check if all required fields are filled
    if (!name || !phone || !address) {
        showToast('عفواً، يرجى إكمال كافة بيانات الطلب الأساسية.');
        return null;
    }

    // Validate phone number (basic validation)
    if (!/^\d{10,}$/.test(phone.replace(/[^\d]/g, ''))) {
        showToast('رقم الهاتف غير صحيح.');
        return null;
    }

    return { name, phone, address };
}

/**
 * Format order message for WhatsApp
 * @param {object} customer - Customer data
 * @returns {string} - Formatted message
 */
function formatOrderMessage(customer) {
    let message = `*🛍️ طلب شراء جديد (E-commerce Order)*\n\n`;

    // Customer Information
    message += `*📋 بيانات العميل (Customer Info):*\n`;
    message += `▪️ الاسم: ${customer.name}\n`;
    message += `▪️ الهاتف: ${customer.phone}\n`;
    message += `▪️ التوصيل: ${customer.address}\n\n`;

    // Cart Items
    message += `*🛒 سلة المشتريات (Cart Items):*\n`;
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price.toLocaleString()} ج.س\n`;
    });

    // Total Amount
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    message += `\n*💰 الإجمالي المطلوب (Total): ${total.toLocaleString()} ج.س*\n\n`;
    message += `بانتظار تأكيدكم للطلب، شكراً لكم.`;

    return message;
}

/**
 * Send order to WhatsApp
 */
function sendToWhatsApp() {
    // Validate customer data
    const customer = validateCustomerData();
    if (!customer) return;

    // Format message
    const message = formatOrderMessage(customer);

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp with message
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

    // Clear cart and form
    cart = [];
    updateCartUI();
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-address').value = '';
    showToast('تم إرسال الطلب بنجاح إلى الواتساب!');
}

/**
 * Filter products based on search input
 */
function filterProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    const productCards = productsGrid.querySelectorAll('.group');
    
    productCards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Mock Google Login
 */
let isLoggedIn = false;
function mockGoogleLogin() {
    isLoggedIn = !isLoggedIn;
    const btn = document.getElementById('googleLoginBtn');
    const text = document.getElementById('loginText');
    
    if (isLoggedIn) {
        text.innerText = 'أحمد';
        btn.classList.add('bg-slate-100');
        showToast('تم تسجيل الدخول بنجاح عبر قوقل!');
    } else {
        text.innerText = 'دخول';
        btn.classList.remove('bg-slate-100');
        showToast('تم تسجيل الخروج');
    }
}

/**
 * Submit Feedback
 */
function submitFeedback(e) {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value || 'عميل';
    document.getElementById('feedbackText').value = '';
    document.getElementById('feedbackName').value = '';
    
    showToast(`شكراً لك يا ${name} على مقترحك!`);
}

/**
 * Toggle Payment Method
 */
function togglePaymentMethod() {
    const isBank = document.querySelector('input[name="payment_method"]:checked').value === 'bank';
    const bankDetails = document.getElementById('bankDetailsContainer');
    
    if (isBank) {
        bankDetails.classList.remove('hidden');
    } else {
        bankDetails.classList.add('hidden');
    }
}

/**
 * Update Bank Info based on selection
 */
const bankData = {
    khartoum: { name: 'بنك الخرطوم (حساب مؤسسة)', account: '1234567' },
    omdurman: { name: 'بنك أمدرمان الوطني (وهج)', account: '9876543' },
    faisal: { name: 'بنك فيصل الإسلامي (وهج)', account: '4561230' },
    islamic: { name: 'البنك الإسلامي السوداني (وهج)', account: '7418529' },
    cashi: { name: 'حساب كاشي (وهج للخدمات)', account: '0900079075' }
};

function updateBankInfo() {
    const bank = document.getElementById('bankSelect').value;
    const infoContainer = document.getElementById('bankAccountInfo');
    const accNum = document.getElementById('accountNumber');
    const accName = document.getElementById('accountName');
    
    if (bank && bankData[bank]) {
        accNum.innerText = bankData[bank].account;
        accName.innerText = bankData[bank].name;
        infoContainer.classList.remove('hidden');
    }
}

/**
 * Process Checkout
 */
function processCheckout() {
    const customer = validateCustomerData();
    if (!customer) return;
    
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
    
    if (paymentMethod === 'bank') {
        const bank = document.getElementById('bankSelect').value;
        const receipt = document.getElementById('transferReceipt').files.length;
        
        if (!bank) {
            showToast('يرجى اختيار البنك');
            return;
        }
        if (receipt === 0) {
            showToast('يرجى إرفاق إشعار التحويل لتأكيد الدفع');
            return;
        }
    }
    
    // Generate mock order ID
    const orderId = 'WHJ-' + Math.floor(1000 + Math.random() * 9000);
    
    // Save to local storage for tracking
    const orderData = {
        id: orderId,
        status: paymentMethod === 'bank' ? 'review' : 'received', 
        date: new Date().toISOString()
    };
    
    let orders = JSON.parse(localStorage.getItem('whaj_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('whaj_orders', JSON.stringify(orders));
    
    // Format message for WhatsApp
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    let message = `*🛍️ طلب شراء جديد: ${orderId}*\n\n`;
    message += `▪️ الاسم: ${customer.name}\n`;
    message += `▪️ الهاتف: ${customer.phone}\n`;
    message += `▪️ التوصيل: ${customer.address}\n`;
    message += `▪️ طريقة الدفع: ${paymentMethod === 'bank' ? 'تحويل بنكي (تم رفع الإشعار في النظام)' : 'الدفع عند الاستلام'}\n\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price.toLocaleString()} ج.س\n`;
    });
    
    message += `\n*💰 الإجمالي: ${total.toLocaleString()} ج.س*\n\n`;
    
    showToast(`تم استلام طلبك! رقم الطلب: ${orderId}`);
    
    // Clear cart and form
    cart = [];
    updateCartUI();
    document.getElementById('customer-name').value = '';
    document.getElementById('customer-phone').value = '';
    document.getElementById('customer-address').value = '';
    if (paymentMethod === 'bank') {
        document.getElementById('transferReceipt').value = '';
        document.getElementById('bankSelect').value = '';
        document.getElementById('bankAccountInfo').classList.add('hidden');
    }
    toggleCart();
    
    // Open WhatsApp
    setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
        document.getElementById('order-tracking').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
}

/**
 * Track Order
 */
function trackOrder(e) {
    e.preventDefault();
    const orderId = document.getElementById('trackingIdInput').value.trim().toUpperCase();
    
    let orders = JSON.parse(localStorage.getItem('whaj_orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    const resultDiv = document.getElementById('trackingResult');
    const statusText = document.getElementById('trackStatusText');
    const progressLine = document.getElementById('trackProgressLine');
    const step3 = document.getElementById('step3Icon');
    const step4 = document.getElementById('step4Icon');
    
    resultDiv.classList.remove('hidden');
    
    if (order) {
        if (order.status === 'review') {
            statusText.innerText = 'جاري مراجعة إشعار الدفع';
            progressLine.style.width = '33%';
            step3.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy');
            step4.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy');
        } else if (order.status === 'received') {
            statusText.innerText = 'تم الاستلام وجاري التجهيز';
            progressLine.style.width = '33%'; 
            step3.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy');
            step4.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy');
        }
    } else {
        if (orderId.startsWith('WHJ-')) {
            statusText.innerText = 'قيد التوصيل';
            progressLine.style.width = '66%';
            step3.classList.add('bg-wahajGlowAmber', 'text-wahajDeepNavy', 'shadow-md');
            step3.classList.remove('bg-slate-200', 'text-slate-500');
            step4.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy');
        } else {
            statusText.innerText = 'الطلب غير موجود';
            progressLine.style.width = '0%';
            step3.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy', 'shadow-md');
            step3.classList.add('bg-slate-200', 'text-slate-500');
            step4.classList.remove('bg-wahajGlowAmber', 'text-wahajDeepNavy');
        }
    }
}

/**
 * Initialize the application
 */
function initApp() {
    // Update cart UI on load
    updateCartUI();

    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Press 'Escape' to close cart
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            if (!cartSidebar.classList.contains('-translate-x-full')) {
                toggleCart();
            }
        }
    });

    // Close cart when clicking outside of it
    document.getElementById('cartSidebar').addEventListener('click', (e) => {
        if (e.target.id === 'cartSidebar') {
            toggleCart();
        }
    });

    console.log('قرطاسية وهج - مرحباً بكم!');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);

// Also initialize on page load
window.addEventListener('load', initApp);

