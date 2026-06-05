import React from 'react'
import DonationsHeader from './DonationsHeader.jsx'
import DonationsOverview from './DonationsOverview.jsx'

export default function Donations() {
  return (
    <div className="min-h-screen bg-[#F7F8F6] px-4 py-4">
        <DonationsHeader />
        <DonationsOverview />
    </div>
  )
}
