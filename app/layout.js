import './globals.css'
import { Inter } from 'next/font/google'
import Link from "next/link";
import {ArrowLeftIcon, HomeIcon} from "@heroicons/react/20/solid";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Cardano Ledger Analysis',
    description: 'A tool to trace activity on the Cardano blockchain',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>{children}</body>
        </html>
    )
}

export function MainLayout({children}) {
    return (
        <main className="min-h-screen w-full  items-baseline justify-center">
            <div className="flex items-baseline w-full bg-white p-5 lg:px-20">
                <Link href="/"
                      className="hover:bg-gray-200 rounded-full">
                    <HomeIcon className="h-6 w-6" />
                </Link>
            </div>
            <div className="min-h-screen w-full p-6 lg:px-20">
                {children}
            </div>
        </main>
    )
}