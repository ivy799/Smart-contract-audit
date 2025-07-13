import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

const Home = () => {
    const router = useRouter()
  return (
    <div>
        <Navbar/>
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Price Page</h1>
            <p className="text-lg text-gray-700">Here you can find the latest prices and offers.</p>
        </main>
        <Footer/>
    </div>
  )
}

export default Home