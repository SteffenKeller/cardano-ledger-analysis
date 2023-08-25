import Link from "next/link";
import {HomeIcon} from "@heroicons/react/24/solid";
import {getWalletInfo} from "@/utils/cardano";
import {queryLatestTxId} from "@/utils/database";

export default async function WalletInfo({params}) {
    const walletInfo = getWalletInfo(params.address)

    return (
        <main className="min-h-screen w-full p-5  items-baseline justify-center">
            <div className="py-5 lg:px-28 flex">
                <Link href="/"
                      className="p-2 hover:bg-gray-200 rounded-full">
                    <HomeIcon className="h-6 w-6 text-blue-600"/>
                </Link>
            </div>

            <div className="min-h-screen w-full lg:px-28 flex items-baseline justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full">
                    <h2 className="text-4xl mb-4">Wallet Info</h2>

                    {await queryLatestTxId()}

                    <div className="mt-8">
                        <p className="mb-2 text-lg font-medium text-gray-600">Address {walletInfo.address}</p>
                        <div
                            className="block mb-2 text-lg font-medium text-gray-600">Address {walletInfo.stakeAddress}</div>


                    </div>

                </div>
            </div>

        </main>
    );
}