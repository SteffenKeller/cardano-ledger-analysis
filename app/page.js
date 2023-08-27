"use client";

import {useEffect, useState} from "react";
import {useRouter} from 'next/navigation'

import Link from "next/link";
import {validateAddress} from "@/utils/cardano";
import {checkDBSyncStatus} from "@/utils/database";

export default function Home() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    checkDBSyncStatus().then(console.log)
  })

  function handleTextFieldChange(e) {
    setSearchInput(e.target.value);
    setErrorMessage('');
  }

  function handleSearchClick() {
    if (searchInput.startsWith('addr') || searchInput.startsWith('stake')) {
      if (validateAddress(searchInput)) {
        router.push(`/address/${searchInput}`)
      } else {
        setErrorMessage('Invalid address format')
      }
    } else if (searchInput.length === 64) {
      router.push(`/transaction/${searchInput}`)
    } else {
      setErrorMessage('Invalid input')
    }
  }

  return (
      <main className="flex min-h-screen flex-col items-center p-10 mt-8">
        <div className="relative flex lg:p-20 py-20">
          <h1 className={`m-0 text-3xl lg:text-4xl  font-semibold`}>
            Cardano Ledger Analysis
          </h1>
        </div>

        <div className="relative flex w-8/12">
          <input
              type="text"
              id="address"
              className="flex-grow border border-gray-300 p-2 rounded-l-lg focus:border-blue-600 focus:outline-none transition-colors"
              placeholder="Enter address or transaction..."
              value={searchInput}
              onChange={handleTextFieldChange}
          />

          <a
              className="px-5 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none transition-colors hover:cursor-pointer"
              onClick={handleSearchClick}
          >
            Search
          </a>
        </div>

        {errorMessage !== '' &&
            <div className="relative flex pt-4 text-center text-red-700 font-semibold">
              {errorMessage}
            </div>
        }

        <div className="mb-32 grid pt-32 text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
          <Link
              href="/address"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 "
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Address Info{' '}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Find information about a specific Cardano wallet.
            </p>
          </Link>

          <Link
              href="/transaction"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 "
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Trace Back Tx{' '}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Trace back a transaction to see where the funds came from.
            </p>
          </Link>

          <Link
              href="/transaction"
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 "
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Follow Tx{' '}
              <span
                  className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Follow a transaction to see where the funds are going.
            </p>
          </Link>
        </div>
      </main>
  )
}
