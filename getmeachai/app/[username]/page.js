import React from 'react'
import PaymentPage from '@/components/PaymentPage'
import { notFound } from 'next/navigation'
import connectDB from '@/db/connectDB'
import User from '@/models/User'

const Page = async ({ params }) => {
  let { username } = await params; // ✅ safe now
  await connectDB();
  const user = await User.findOne({ username });
  if (!user) {
    notFound();
  }

  return <PaymentPage username={username} />;
};


export default Page;
