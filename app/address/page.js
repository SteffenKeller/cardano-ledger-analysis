"use client";

import { useState } from 'react';
import Link from "next/link";
import { HomeIcon } from "@heroicons/react/24/solid";


export default function Wallet() {
    const [address, setAddress] = useState('');
    return (
        <main className="min-h-screen w-full p-5  items-baseline justify-center">
            <div className="py-5 lg:px-28 flex">
                <Link href="/"
                      className="p-2 hover:bg-gray-200 rounded-full">
                    <HomeIcon className="h-6 w-6 text-blue-600" />
                </Link>
            </div>

            <div className="min-h-screen w-full lg:px-28 flex items-baseline justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                    <h2 className="text-4xl mb-4">Address Info</h2>

                    <div className="mt-8">
                        <label className="block mb-2 text-lg font-medium text-gray-600" htmlFor="address">Enter Address</label>
                        <div className="flex">
                            <input
                                type="text"
                                id="address"
                                className="flex-grow border border-gray-300 p-2 rounded-l-lg focus:border-blue-600 focus:outline-none transition-colors"
                                placeholder="Payment address or stake address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />

                            <Link
                                className="px-5 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none transition-colors"
                                href={`/address/${address}`}
                            >
                                Search
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

        </main>
    );
}