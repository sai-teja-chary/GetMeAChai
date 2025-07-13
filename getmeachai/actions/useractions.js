"use server"
import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import connectDB from "@/db/connectDB";
import User from "@/models/User";


export const initiate = async (amount, to_user, paymentForm) => {
  try {
    await connectDB();
    
    const user = await User.findOne({ username: to_user });
    if (!user) {
      throw new Error('Recipient user not found.');
    }

    const instance = new Razorpay({
      key_id: user.razorpayid,
      key_secret: user.razorpaysecret
    });

    const options = {
      amount: Number.parseInt(amount),
      currency: 'INR'
    };

    const response = await instance.orders.create(options);

    await Payment.create({
      oid: response.id,
      amount: amount / 100,
      to_user,
      name: paymentForm.name,
      message: paymentForm.message
    });

    return response;
  } catch (error) {
    if (error.statusCode === 401) {
      // Razorpay credentials are incorrect
      throw new Error('Razorpay ID or Secret is invalid.');
    }

    // Other errors (validation, DB issues, etc.)
    throw new Error(error.message || 'Something went wrong while creating the order.');
  }
};


export const fetchuser = async (username) => {
    await connectDB();
    const u = await User.findOne({ username }).lean();

    if (!u) return null;

    return {
        ...u,
        _id: u._id.toString(),
        createdAt: u.createdAt?.toISOString(),
        updatedAt: u.updatedAt?.toISOString(),
    };
};


export const fetchPayments = async (username) => {
    await connectDB();
    let payments = await Payment.find({ to_user: username, done: true }).sort({ createdAt: -1 }).lean();
    payments = payments.map((payment) => ({
        ...payment,
        _id: payment._id.toString(), // REQUIRED
        createdAt: payment.createdAt?.toISOString(),
        updatedAt: payment.updatedAt?.toISOString()
    }));

    return payments;
};

export const updateProfile = async (oldusername, data) => {
    await connectDB();
    let ndata = data;
    if (ndata.username !== oldusername) {
        let user = await User.findOne({ username: ndata.username });
        if (user) {
            return {error: "Username already exists"};
        }
        await User.updateOne({email: ndata.email}, ndata);
        await Payment.updateMany({to_user: oldusername}, {to_user: ndata.username});
    }
    else{
        await User.updateOne({email: ndata.email}, ndata);
    }
}
