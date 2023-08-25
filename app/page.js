import Image from 'next/image'
import Link from "next/link";

import {queryLatestTxId} from "@/utils/database";

export default async function Home() {

  return (
      <main className="flex min-h-screen flex-col items-center p-10">
        <div className="relative flex lg:p-40 py-20">
          <h1 className={`m-0 text-3xl lg:text-4xl  font-semibold`}>
            Cardano Ledger Analysis
          </h1>
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left">
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
