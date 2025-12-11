# TODO: Add Phone Number to Customer Details in Admin Order Page

## Tasks:
- [x] Edit OrderManager.tsx to display phone number in the customer details dialog
- [x] Modify backend getAllOrders to populate phone from user profile if not in order
- [ ] Test the changes by running the frontend dev server and checking the order details modal

## Details:
- Frontend: Frontend/src/components/adminComponents/OrderManager.tsx - Added phone display in dialog.
- Backend: Backend/src/controllers/orderController.js - Added logic to fetch phone from ClerkUser if order.phone is empty and user_id exists.
- Testing: Navigate to admin panel > Orders > Click "Details" on an order to verify phone displays (from order or profile).

---

# TODO: Fix Checkout Page to Fetch Latest Product Data and Use Calculated Totals

## Tasks:
- [x] Add product data fetching logic before order creation in Checkout.tsx
- [x] Use calculated total amount instead of cart total for order data
- [x] Fix variable scoping issues (orderItems, finalTotalAmount)
- [x] Remove merge conflict markers and clean up code

## Details:
- Frontend: Frontend/src/pages/Checkout.tsx - Added product fetching to ensure prices are up-to-date, recalculated totals, and used calculated amounts in order data.
- This ensures orders are created with accurate pricing even if product prices change after items are added to cart.

---

# TODO: Fix React Console Errors and Warnings

## Tasks:
- [x] Fix "Invalid prop `data-lov-id` supplied to `React.Fragment`" by replacing React.Fragment with span having display: contents
- [x] Fix "AnimatePresence mode set to 'wait' with multiple children" by removing mode="wait"
- [x] Fix 400 Bad Request on orders by ensuring phone field is always sent as string

## Details:
- Frontend: Frontend/src/pages/Index.tsx - Replaced React.Fragment with <span style={{ display: 'contents' }}> in MarqueeSection and removed mode="wait" from AnimatePresence in OurLatestProject.
- Frontend: Frontend/src/pages/Checkout.tsx - Modified to always send phone as string instead of conditionally.
- These fixes resolve the console warnings and ensure order creation works properly.
