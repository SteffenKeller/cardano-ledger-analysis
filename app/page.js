import Image from "next/image";

import {queryTransactionsByOutSum} from "@/utils/database";
import SearchBar from "@/components/SearchBar";

export default function Home() {

    return (
        <main className="flex min-h-screen flex-col items-center p-10">

            <Header />

            <SearchBar />

            <div className="mt-4 grid lg:grid-cols-3 gap-3 w-full">
                <LargestTransactions />
                <RecentTransactions />
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

async function LargestTransactions() {
    const transactions = await queryTransactionsByOutSum(10)
    return (
        <>
            <div className="bg-white rounded-xl shadow-lg w-full">
                <div className="ps-4 pt-4">
                    <h2 className="text-lg mb-4">Highest Outputs (24h)</h2>
                </div>
                <div className="mt-4">
                    <table className="border-t border-gray-100 w-full">

                        <tbody className="h-64 bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full">
                        {transactions.map((transaction) => (
                            <tr className="flex w-full mb-4">
                                <td className ="w-1/3"></td>
                                <td className ="w-1/3">transaction.id</td>
                                <td className ="w-1/3">transaction.id</td>
                            </tr>

                        ))}
                        </tbody>

                    </table>
                </div>
            </div>
        </>
    )
}

function RecentTransactions({addressInfo}) {
    return (
        <>
            <div className="bg-white p-4 rounded-xl shadow-lg w-full">
                <div className="">
                    <h2 className="text-lg mb-4">Content</h2>
                </div>
                <div className="mt-4">
                    here
                </div>
            </div>
        </>
    )
}

