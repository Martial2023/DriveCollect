import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='w-full p-6 flex items-center justify-center flex-col'>
      <Link href={"/"} className='text-sm font-semibold flex items-center gap-1'>
        <span>Drive</span>
        <span className='text-primary'>Collect</span>
      </Link>

      <p className="text-sm">&copy; {new Date().getFullYear()} DriveCollect. Tous droits réservés.</p>
    </footer>
  )
}

export default Footer