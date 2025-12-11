import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api, { authApiRequest } from '@/services/api';
import { inventoryService } from '@/services/inventoryService';

interface CheckoutFormData {
  address: string;
  pincode: string;
  delivery_instructions: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  selected_set: boolean;
}

interface PaymentResult {
  payment_id: string;
  order_id: string;
  payment_error_message?: string | null;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const getToken = async (): Promise<string | null> => {
  return localStorage.getItem('authToken');
};

const Checkout = () => {
  const { items, clearCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isSignedIn } = useAuth();
  const [errors, setErrors] = useState({ pincode: '', phone: '' });
  const [ipAddress, setIpAddress] = useState('');
  // Loading overlay for payment
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);

  // Extract user details from custom auth
  const customerName = user?.fullName || '';
  const email = user?.email || '';
  const phone = user?.phoneNumber || '';
  const userId = user?.id || '';

  const [formData, setFormData] = useState<CheckoutFormData>({
    address: '',
    pincode: '',
    delivery_instructions: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gateway'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIpAddress(data.ip))
      .catch(() => setIpAddress(''));
  }, []);

  const handlePaymentGateway = async (): Promise<PaymentResult | false> => {
    try {
      // 1. Create order on backend
      setIsRazorpayLoading(true);
      const orderRes = await authApiRequest(
        'post',
        '/payment/order',
        getToken,
        {
          amount: totalAmount,
          currency: 'INR',
          receipt: `receipt_order_${Date.now()}`,
        }
      );
      const orderData = orderRes.data;
      if (!orderData.success) throw new Error('Failed to create Razorpay order');

      // 2. Open Razorpay checkout
      return new Promise((resolve, reject) => {
        setIsRazorpayLoading(true);
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
          toast({
            title: "Payment Error",
            description: "Razorpay key is not configured. Please contact support.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          reject(new Error('Razorpay key not configured'));
          return;
        }
        const options = {
          key: razorpayKey, // Make sure this env variable is set
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Furnisure',
          description: 'Order Payment',
          order_id: orderData.order.id,
          handler: async function (response) {
            setIsRazorpayLoading(true);
            // 3. Verify payment on backend
            const verifyRes = await authApiRequest(
              'post',
              '/payment/verify',
              getToken,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            const verifyData = verifyRes.data;
            if (verifyData.success) {
              setIsRazorpayLoading(false);
              toast({
                title: "Payment Successful",
                description: "Your payment was successful!",
              });
              resolve({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                payment_error_message: null,
              });
            } else {
              setIsRazorpayLoading(false);
              toast({
                title: "Payment Verification Failed",
                description: "Payment could not be verified.",
                variant: "destructive",
              });
              reject({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                payment_error_message: verifyData.payment_error_message || verifyData.message || 'Verification failed',
              });
            }
          },
          prefill: {
            name: customerName,
            email: email,
            contact: phone,
          },
          theme: { color: "#bb9a65" },
        };

        if (typeof window.Razorpay !== 'function') {
          toast({
            title: "Payment Error",
            description: "Razorpay failed to load. Please disable ad blockers or try again later.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          reject(new Error('Razorpay not loaded'));
          return;
        }
        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error.message || "Payment failed. Please try again.",
        variant: "destructive",
      });
      setIsRazorpayLoading(false);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  

    let firstInvalidField: string | null = null;
    const newErrors = { ...errors };
    if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      newErrors.pincode = 'Invalid Indian pincode';
      if (!firstInvalidField) firstInvalidField = 'pincode';
    }
    setErrors(newErrors);
    if (firstInvalidField) {
      setIsSubmitting(false);
      // Focus and scroll to the first invalid field
      const el = document.getElementById(firstInvalidField);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        (el as HTMLElement).focus();
      }
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Fetch latest product data to ensure prices are up to date
    let orderItems: OrderItem[] = [];
    let finalTotalAmount = 0;

    try {
      const productIds = items.map(item => item.id);
      const productPromises = productIds.map(id => inventoryService.getProductById(id));
      const products = await Promise.all(productPromises);

      // Create a map for quick lookup
      const productMap = new Map();
      products.forEach(product => {
        productMap.set(product.id, product);
      });

      // Recalculate order items with correct prices
      let calculatedTotal = 0;
      orderItems = items.map(item => {
        const product = productMap.get(item.id);
        if (!product) {
          throw new Error(`Product ${item.id} not found`);
        }
        const price = item.selectedSet && product.set_price ? product.set_price : product.price;
        const itemTotal = price * item.quantity;
        calculatedTotal += itemTotal;
        return {
          product_id: item.id,
          quantity: item.quantity,
          price: price,
          selected_set: item.selectedSet || false,
        };
      });

      // Use calculated total instead of cart total
      finalTotalAmount = calculatedTotal;
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast({
        title: "Error",
        description: "Failed to verify product prices. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    let paymentReferenceId: string | null = null;
    let razorpayOrderId: string | null = null;
    let paymentErrorMessage: string | null = null;
    let paymentStatus: 'pending' | 'paid' | 'failed' | 'unverified' = 'pending';
    const currentPaymentMethod: 'cod' | 'gateway' = paymentMethod;

    try {
      // Handle payment gateway flow
      if (currentPaymentMethod === 'gateway') {
        try {
          const paymentResult = await handlePaymentGateway();
          if (!paymentResult) {
            paymentStatus = 'failed';
            // Try to get Razorpay order id from the last attempt if possible
            // (You may need to refactor handlePaymentGateway to return this on failure)
            // For now, leave as null if not available
          } else {
            paymentReferenceId = paymentResult.payment_id;
            razorpayOrderId = paymentResult.order_id;
            paymentErrorMessage = paymentResult.payment_error_message || null;
            paymentStatus = 'paid';
          }
        } catch (gatewayError: any) {
          paymentStatus = 'failed';
          paymentReferenceId = gatewayError?.payment_id || null;
          razorpayOrderId = gatewayError?.order_id || null;
          paymentErrorMessage = gatewayError?.payment_error_message || (gatewayError?.message ?? 'Payment failed');
        }
      }

      // Always store the order, even if payment failed (except in development for failed payments)
      let order = null;
      const isDev = import.meta.env.VITE_DEV;
      if (!(isDev && paymentStatus === 'failed')) {
        // Prepare order data, excluding empty phone
  const orderData: any = {
    customer_name: customerName,
    email,
    phone: phone || '',
    ...formData,
    total_amount: finalTotalAmount,
    payment_method: currentPaymentMethod,
    payment_status: paymentStatus as any, // allow 'failed' and 'unverified' for backend
    payment_reference_id: paymentReferenceId,
    razorpay_order_id: razorpayOrderId,
    payment_error_message: paymentErrorMessage,
    user_id: userId || undefined,
    items: orderItems,
    ip_address: ipAddress,
  };

        order = await createOrder(orderData);
      }

      if (order) {
        clearCart();
        const paymentMessage = paymentStatus === 'paid'
          ? "Your order has been placed and paid successfully!"
          : paymentStatus === 'failed'
            ? "Order was created but payment failed. Please contact support or try again."
            : "Your order has been placed successfully! Pay on delivery.";

        toast({
          title: "Order placed successfully!",
          description: paymentMessage,
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please sign in to checkout</h2>
          <p className="text-muted-foreground mb-4">You must be logged in to place an order.</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-8 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-4">Add some products to your cart to checkout.</p>
              <Button onClick={() => navigate('/browse')}>
                Browse Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-background via-muted/20 to-background">
      {isRazorpayLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center shadow-lg">
            <svg className="animate-spin h-8 w-8 text-[#bb9a65] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span className="text-[#bb9a65] font-semibold">Processing Payment...</span>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Checkout</h1>
          <p className="text-muted-foreground">Please fill in your details to complete your order.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="space-y-6">
            {/* Delivery Information */}
            <Card className="shadow-lg border-[#bb9a65]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">Full Name</Label>
                    <Input
                      id="customer_name"
                      type="text"
                      value={customerName}
                      readOnly
                      className="bg-background/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      className="bg-background/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      readOnly
                      className="bg-background/50 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      pattern="[1-9][0-9]{5}"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^\d*$/.test(value)) return;
                        if (value.length > 6) return;
                        setFormData({ ...formData, pincode: value });
                        const isValid = /^[1-9][0-9]{5}$/.test(value);
                        setErrors({ ...errors, pincode: isValid || value === '' ? '' : 'Invalid pincode' });
                      }}
                      required
                      placeholder="Enter your pincode for delivery"
                      className={`bg-background/50 ${errors.pincode ? 'border border-red-500' : ''}`}
                    />
                    {errors.pincode && (
                      <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      rows={3}
                      placeholder="Enter your complete delivery address"
                      className="bg-background/50"
                    />
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <Label htmlFor="delivery_instructions">Delivery Instructions (optional)</Label>
                    <Textarea
                      id="delivery_instructions"
                      value={formData.delivery_instructions}
                      onChange={(e) => setFormData({ ...formData, delivery_instructions: e.target.value })}
                      rows={2}
                      placeholder="E.g. Leave at the door, call on arrival, etc."
                      className="bg-background/50"
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-lg border-[#bb9a65]/20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={v => setPaymentMethod(v as 'cod' | 'gateway')} className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 mr-3 text-green-600" />
                      <div>
                        <div className="font-medium">Cash on Delivery</div>
                        <div className="text-sm text-muted-foreground">Pay when your order arrives</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                    <RadioGroupItem value="gateway" id="gateway" />
                    <Label htmlFor="gateway" className="flex items-center cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 mr-3 text-blue-600" />
                      <div>
                        <div className="font-medium">Online Payment</div>
                        <div className="text-sm text-muted-foreground">Pay securely with card/UPI/wallet</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={handleSubmit}
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Processing...' :
                paymentMethod === 'cod'
                  ? `Place Order - ₹${totalAmount.toLocaleString()} (COD)`
                  : `Pay Now - ₹${totalAmount.toLocaleString()}`
              }
            </Button>
          </div>

          {/* Order Summary */}
          <Card className="shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.selectedSet}`} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      {item.selectedSet && (
                        <span className="text-xs text-[#bb9a65] font-medium">(Complete Set)</span>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-[#bb9a65]">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Including all taxes and free delivery
                  </p>

                  {/* Payment Method Summary */}
                  <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center text-sm">
                      {paymentMethod === 'cod' ? (
                        <>
                          <Banknote className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-green-600 font-medium">Cash on Delivery</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-blue-600 font-medium">Online Payment</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
