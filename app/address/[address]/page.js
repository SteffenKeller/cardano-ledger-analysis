import Link from "next/link";
import {HomeIcon} from "@heroicons/react/24/solid";
import {getAddressInfo} from "@/utils/cardano";

export default async function AddressInfo({params}) {
    const addressInfo = await getAddressInfo(params.address)

    return (
        <>
            <div className="p-8">
                <h2 className="text-4xl mb-4">Address</h2>
                <div className="text-gray-600 break-all">
                    {addressInfo.address}
                </div>
            </div>
            <div className="mt-4">
                <List rows={[
                    ["Balance", `${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 6}).format(addressInfo.balance / 1_000_000)} ₳`],
                    ["Stake Address", addressInfo.stakeAddress],
                    ["Transaction Count", addressInfo.txCount],
                    ["First Activity", addressInfo.firstSeen.toLocaleString('de')],
                    ["Last Activity", addressInfo.lastSeen.toLocaleString('de')],
                ]}>
                </List>
            </div>
            <div className="button">

            </div>

        </>
    );
}

function Table({ rows }) {
    return (
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
            {rows.map((row) => (
                <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                            {row[0]}
                        </div>
                    </td>
                    <td className="px-6 py-4 break-all">
                        <div className="text-sm text-gray-500">
                            {row[1]}
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

function List({ rows }) {
    return (
        <div className="px-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
                {rows.map((row) => (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">{row[0]}</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 break-all">{row[1]}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}