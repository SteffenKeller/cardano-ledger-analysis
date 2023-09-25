import {getAddressInfo} from "@/utils/cardano";
import {formatLovelace} from "@/utils/ui";
import List from "@/components/List";
import Notes from "@/components/Notes";
import Link from "next/link";
import {CodeBracketSquareIcon} from "@heroicons/react/20/solid";

export default async function AddressInfo({params}) {
    const addressInfo = await getAddressInfo(params.address)

    return (
        <>
            <PaymentAddressInfo addressInfo={addressInfo} />
            {addressInfo.stakeAddress != null &&
                <StakeAddressInfo addressInfo={addressInfo} />
            }
            <Notes reference={params.address} />
        </>
    );
}

function PaymentAddressInfo({addressInfo}) {
    return (
        <>
            <div className="bg-white px-6 py-8 rounded-xl shadow-lg w-full">
                <div className="">
                    <h2 className="text-3xl mb-4">Address</h2>
                    <div className="text-gray-600 break-all">
                        {addressInfo.address}
                    </div>
                </div>
                <div className="mt-4">
                    <List rows={[
                        ["Balance", formatLovelace(addressInfo.balance)],
                        ["Transaction Count", addressInfo.txCount],
                        ["First Activity", addressInfo.firstSeen.toUTCString()],
                        ["Last Activity", addressInfo.lastSeen.toUTCString()],
                    ]}>
                    </List>
                </div>
            </div>

        </>
    )
}

function StakeAddressInfo({addressInfo}) {
    return (
        <>
            <div className="bg-white p-6 mt-4 rounded-xl shadow-lg w-full">
                <div className="">
                    <h2 className="text-xl mb-4">Controlled Stake Key</h2>
                    <div className="text-gray-600 break-all">
                        <dl className="divide-y divide-gray-100 grid lg:grid-cols-2">
                            {addressInfo.stakeAddress}
                            <div className="grid grid-cols-2 gap-4 px-0 mt-4 lg:mt-0">
                                <dt className="text-sm font-medium leading-6 text-gray-900 text-left lg:text-right">Total Stake</dt>
                                <dd className="mt-1 text-sm leading-6 text-gray-700 mt-0 break-all text-end">{formatLovelace(addressInfo.stakeAddressTotalStake)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>

                <div className="mt-4 ">
                    <h2 className="text-xl mb-2 ">Related Addresses</h2>
                </div>

                {addressInfo.stakeAddressPaymentAddresses.map((row, i) => (
                    <div className="grid md:grid-cols-4 py-1">
                        <div className="flex items-center leading-6 md:col-span-3 gap-3">
                            <Link className="text-sm   break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${row.address}`}>{row.address}</Link>
                        </div>
                        <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">
                            <div>{formatLovelace(row.balance)}</div>
                        </div>
                    </div>
                ))}



            </div>
        </>
    )
}

