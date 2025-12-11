import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      return null;
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }
  return razorpayInstance;
};

export const createOrder = async (req, res) => {
  try {
    const instance = getRazorpayInstance();
    if (!instance) {
      return res.status(503).json({ success: false, error: "Payment service not configured" });
    }
    const { amount, currency = "INR", receipt } = req.body;
    const options = {
      amount: amount * 100,
      currency,
      receipt,
    };
    const order = await instance.orders.create(options);
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign.toString())
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } else {
    res
      .status(400)
      .json({
        success: false,
        message: "Invalid signature",
        payment_error_message: "Invalid signature",
      });
  }
};
