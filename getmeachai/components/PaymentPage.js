"use client"
import React, { useState, useEffect } from 'react'
import Script from 'next/script';
import { initiate } from '@/actions/useractions';
import { fetchuser, fetchPayments } from '@/actions/useractions';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { Bounce } from 'react-toastify';

const PaymentPage = ({ username }) => {
    const searchParams = useSearchParams();
    const { status } = useSession();
    const router = useRouter();
    const [paymentForm, setPaymentForm] = useState({ name: '', message: '', amount: '' })
    const [currentUser, setCurrentUser] = useState({});
    const [payments, setPayments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        getData();
        if (status === "unauthenticated") {
            router.push('/login');
        }

    }, [status]);

    useEffect(() => {
        if (searchParams.get("paymentDone") == "true") {
            toast('Thanks for the Donation❤️❤️❤️', {
                position: "bottom-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            router.push(`/${username}`);
        }
    }, [])



    const pay = async (amount) => {
        try {
            const a = await initiate(amount, username, paymentForm)

            let orderId = a.id
            const options = {
                key: currentUser.razorpayid, // Replace with your Razorpay key_id
                amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: 'INR',
                name: 'Acme Corp',
                description: 'Test Transaction',
                order_id: orderId, // This is the order_id created in the backend
                callback_url: `${process.env.NEXT_PUBLIC_URL}/api/razorpay`, // Your success URL
                prefill: {
                    name: 'Gaurav Kumar',
                    email: 'gaurav.kumar@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#F37254'
                },
            }
            const rzp = new Razorpay(options);
            rzp.open();
        } catch (error) {
            setErrorMessage(error.message)
        }
    }

    let handleChange = (e) => {
        setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });

    }

    let getData = async (props) => {
        let u = await fetchuser(username);
        setCurrentUser(u);
        let dbPayments = await fetchPayments(username);
        setPayments(dbPayments);
        console.log(u, dbPayments);
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <div>
                <div className="w-[100%] h-110 bg-white relative">
                    <img src={currentUser.coverpic ? currentUser.coverpic : '/coverpic.png'} alt='coverpic' className='object-cover w-full h-110 border-b border-b-white'></img>
                    <div className="profilepic absolute  top-105 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-40 h-40 border-white border-2 rounded-xl overflow-hidden">
                        <img src={currentUser.profilepic ? currentUser.profilepic : '/profilepic.png'} alt='coverpic' className='w-40 h-40 object-cover'></img>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-2 justify-center items-center mt-20'>
                <h2 className='text-2xl font-bold'>@{username}</h2>
                <p>{currentUser.bio}</p>
            </div>
            <div className='flex flex-col md:flex-row  gap-5 justify-between m-5 w-[80%] mx-auto my-20'>
                <div className='md:w-1/2 bg-gray-900 rounded-xl min-h-[40vh]'>
                    <h2 className='text-xl fontbold p-4'>Make a Payment</h2>
                    {currentUser.razorpayid && currentUser.razorpaysecret && !errorMessage ? <p className='text-green-500 p-4'>Razorpay is connected, you can pay</p> : (!errorMessage?<p className='text-red-500 p-4'>Razorpay is not connected</p> : <p className='text-red-500 p-4'>{errorMessage}</p>)}
                    <div className='m-5 flex flex-col gap-4 w-[80%]'>
                        <input onChange={handleChange} value={paymentForm.name} name='name' className='h-10 bg-gray-700 p-4 placeholder:text-gray-200 placeholder:font-bold placeholder:text-sm rounded-lg' type="text" placeholder='Enter Name' />
                        <input onChange={handleChange} value={paymentForm.message} name='message' className='h-10 bg-gray-700 p-4 placeholder:text-gray-200 placeholder:font-bold placeholder:text-sm rounded-lg' type="text" placeholder='Enter Message' />
                        <input onChange={handleChange} value={paymentForm.amount} name='amount' className='h-10 bg-gray-700 p-4 placeholder:text-gray-200 placeholder:font-bold placeholder:text-sm rounded-lg' type="text" placeholder='Enter Amount' />
                        <button onClick={() => { pay(Number.parseInt(paymentForm.amount) * 100) }} disabled={paymentForm.name.length < 3 || paymentForm.amount <= 0 } className='bg-blue-600 disabled:bg-blue-400 flex justify-center items-center h-10 rounded-lg p-4 cursor-pointer hover:bg-blue-500'>Send</button>
                    </div>
                </div>
                <div className='md:w-1/2 bg-gray-900 rounded-xl min-h-[30vh]'>
                    <h2 className='text-xl fontbold p-4'>Supporters</h2>
                    {payments.length === 0 && <p className='p-6'>No payments yet</p>}
                    {console.log(payments)}
                    {payments.map((payment, index) => (
                        <div key={index} className='flex items-center gap-2 m-5'>
                            <img className='w-7' src="/avatar.gif" alt="" />
                            <p>{payment.name} donated <span className='font-bold'>₹{payment.amount}</span> with a message "{payment.message}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default PaymentPage
