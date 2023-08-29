import {getAddressInfo} from "@/utils/cardano";
import {formatLovelace} from "@/utils/ui";

export default async function AddressInfo({params}) {
    const addressInfo = await getAddressInfo(params.address)

    return (
        <>
            <PaymentAddressInfo addressInfo={addressInfo}></PaymentAddressInfo>
            {addressInfo.stakeAddress != null &&
                <StakeAddressInfo addressInfo={addressInfo}></StakeAddressInfo>
            }
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
            <div className="bg-white px-6 py-8 mt-6 rounded-xl shadow-lg w-full">
                <div className="">
                    <h2 className="text-3xl mb-4">Controlled Stake Key</h2>
                    <div className="text-gray-600 break-all">
                        {addressInfo.stakeAddress}
                    </div>
                </div>
                <div className="mt-4">
                    <List rows={[
                        ["Total Stake", formatLovelace(0)],
                        ["Delegated To", formatLovelace(0)],
                    ]}>
                    </List>
                </div>
            </div>
        </>
    )
}

function List({ rows }) {
    return (
        <div className="px-4 border-t border-gray-100">
            <dl className="divide-y divide-gray-100 grid lg:grid-cols-2">
                {rows.map((row, i) => (
                    <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">{row[0]}</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 break-all">{row[1]}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}