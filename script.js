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
