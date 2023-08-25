import Link from "next/link";
import {HomeIcon} from "@heroicons/react/24/solid";
import {getAddressInfo} from "@/utils/cardano";

export default async function WalletInfo({params}) {
    const addressInfo = await getAddressInfo(params.address)

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
                    <h2 className="text-4xl mb-4">Address</h2>
                    <div className="text-gray-600">
                        {addressInfo.address}
                    </div>

                    <div className="mt-8">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        Address
                                    </div>
                                </td>
                                <td className="px-6 py-4 break-all">
                                    <div className="text-sm text-gray-500">
                                        {addressInfo.address}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        Stake Address
                                    </div>
                                </td>
                                <td className="px-6 py-4 break-all">
                                    <div className="text-sm text-gray-500">
                                        {addressInfo.stakeAddress}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        Balance
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {new Intl.NumberFormat('de-DE', { maximumFractionDigits: 6}).format(addressInfo.balance / 1_000_000)} ₳
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        Transaction Count
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {addressInfo.txCount}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        First Seen
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-500">
                                        {addressInfo.firstSeen.toLocaleString('de')}
                                    </div>
                                </td>
                            </tr>



                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

        </main>
    );
}