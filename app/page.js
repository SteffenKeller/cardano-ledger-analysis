"use client";

import {useEffect, useState} from "react";
import {useRouter} from 'next/navigation'

import Link from "next/link";
import Image from "next/image";

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
      <main className="flex min-h-screen flex-col items-center p-10">

        <div className="relative flex p-5">
          <Image
              src="/cardano.png"
              width={100}
              height={100}
              alt="Cardano Logo"
          />
        </div>

        <div className="relative flex p-5">
          <h1 className={`m-0 text-3xl lg:text-4xl  font-semibold`}>
            Cardano Ledger Analysis
          </h1>
        </div>

        <div className="relative flex mt-8 w-full lg:w-9/12">
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
            <div className="relative flex pt-2 text-center text-red-700 font-semibold">
              {errorMessage}
            </div>
        }
      </main>
  )
}
