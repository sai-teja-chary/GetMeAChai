"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import { Bounce } from 'react-toastify';

const Dashboard = () => {
  const router = useRouter();
  const { data: session ,status } = useSession()
  const [form, setForm] = useState({
    name: '',
    bio: '',
    email: '',
    username: '',
    profilepic: '',
    coverpic: '',
    razorpayid: '',
    razorpaysecret: ''
  })

  useEffect(() => {
    if (status === 'loading') return; // 🛑 Wait until session loads

    if (!session) {
      router.push('/');
      return;
    }

    if (session.user?.name) {
      getData(session.user.name);
    }
  }, [status, session, router]);

  const getData = async () => {
    let user = await fetchuser(session.user.name);
    setForm({
      name: user.name || '',
      bio: user.bio || '',
      email: user.email || '',
      username: user.username || '',
      profilepic: user.profilepic || '',
      coverpic: user.coverpic || '',
      razorpayid: user.razorpayid || '',
      razorpaysecret: user.razorpaysecret || ''
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(session.user.name, form);
    toast('Profile Updated...', {
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
    // optionally update session here
    // await update({ ...session.user, ...form });
  }
  if (status === 'loading') {
    return <div className="p-10 text-center">Loading Dashboard...</div>; // ✅ SHOW loader while session is loading
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
      <div className='flex flex-col items-center p-5 gap-2 mx-2'>
        <h1 className='text-3xl font-bold my-5 text-center'>
          Welcome to your Dashboard
        </h1>
        <form className='lg:w-[40%] sm:w-[70%] w-full' onSubmit={handleSubmit}>
          {[
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Bio', name: 'bio', type: 'text' },
            { label: 'Email', name: 'email', type: 'text' },
            { label: 'Username', name: 'username', type: 'text' },
            { label: 'Profile picture', name: 'profilepic', type: 'text' },
            { label: 'Cover picture', name: 'coverpic', type: 'text' },
            { label: 'Razorpay Id', name: 'razorpayid', type: 'password' },
            { label: 'Razorpay Secret', name: 'razorpaysecret', type: 'password' },
          ].map(({ label, name }) => (
            <div key={name} className='flex flex-col gap-2 mb-2'>
              <label htmlFor={name}>{label}</label>
              <input
                onChange={handleChange}
                value={form[name]}
                name={name}
                className='h-8 rounded-xl p-4 bg-gray-400 text-black font-bold'
                type={type}
              />
            </div>
          ))}

          <button
            type="submit"
            className='bg-blue-600 flex w-fit justify-center items-center h-8 rounded-xl p-4 mt-5 cursor-pointer hover:bg-blue-500'
          >
            Save
          </button>
        </form>
      </div>
    </>
  )
}

export default Dashboard
