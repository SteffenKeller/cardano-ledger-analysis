"use client";

import { useState } from 'react';
import Link from "next/link";

export default function Address() {
    const [address, setAddress] = useState('');
    return (
        <>
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
        </>
    );
}