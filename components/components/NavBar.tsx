import { CarFront } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { ModeToggle } from '../ui/ModeToggle'


function NavBar() {
    return (
        <nav className='p-4 px-6 md:px-[10%] w-full flex items-center justify-between mb-8'>
            <Link
                href={""}
                className=''
            >
                <h2 className='text-3xl text-white font-semibold flex items-center'>
                    <CarFront className='w-8 h-8 mr-1'/>
                    <span>Drive</span>
                    <span className='text-primary'>Collect</span>
                </h2>
            </Link>

            <ModeToggle />
        </nav>
    )
}

export default NavBar