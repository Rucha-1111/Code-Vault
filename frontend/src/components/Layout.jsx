import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f7f6fb]">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
