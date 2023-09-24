import Image from "next/image";

import {queryTransactionsWithHighestOutputs, checkDBSyncStatus, queryRecentTransactions} from "@/utils/database";
import SearchBar from "@/components/SearchBar";
import {formatLovelace, timeSinceDate, truncateTransactionHash} from "@/utils/ui";

export default function Home() {

    checkDBSyncStatus().then()

    return (
        <main className="flex min-h-screen flex-col items-center p-10">

            <Header />

            <div className="bg-white p-4 mt-4 rounded-xl shadow-lg w-full">
                <div className="">
                    <h2 className="text-lg font-medium mb-4">Search</h2>
                </div>
                <SearchBar />
            </div>

            <div className="mt-4 grid w-full">
                <RecentTransactions />
            </div>

        </main>
    )
}

function Header() {
    return (
        <>
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
        </>
    )

}

async function RecentTransactions() {
    const transactions = await queryRecentTransactions(50)
    return (
        <>
            <div className="bg-white rounded-xl shadow-lg w-full">
                <div className="ps-4 pt-4">
                    <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
                </div>
                <div className="mt-4">
                    <TransactionsTable transactions={transactions} />
                </div>
            </div>
        </>
    )
}

async function HighestOutputTransactions() {
    const transactions = await queryTransactionsWithHighestOutputs(50)
    return (
        <>
            <div className="bg-white rounded-xl shadow-lg w-full">
                <div className="ps-4 pt-4">
                    <h2 className="text-lg mb-4 font-medium">Transactions With Highest Outputs (7d)</h2>
                </div>
                <div className="mt-4">
                    <TransactionsTable transactions={transactions} />
                </div>
            </div>
        </>
    )
}

function TransactionsTable({transactions}) {
    return(
        <table className="border-t border-gray-100 w-full">
            <thead className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full mt-1">
            <tr className="flex w-full px-5 py-2 text-sm">
                <th className="w-full text-left">Hash</th>
                <th className="w-1/4">Block</th>
                <th className="w-1/3">Time</th>
                <th className="w-1/4 text-right">Value</th>
            </tr>
            </thead>
            <tbody className="h-80 bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full">
            {transactions.map((transaction) => (
                <tr className="flex w-full mb-4 px-5 text-sm">
                    <td className ="w-full break-all text-left font-medium text-blue-600 hover:text-blue-500 hover:underline"><a href={`/transaction/${transaction.hash.toString('hex')}`}>{transaction.hash.toString('hex')}</a></td>
                    <td className ="w-1/4 text-center">{transaction.block_no}</td>
                    <td className ="w-1/3 text-center">{timeSinceDate(new Date(transaction.time))}</td>
                    <td className ="w-1/4 text-right">{`${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2}).format(transaction.out_sum / 1_000_000)} ₳`}</td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

