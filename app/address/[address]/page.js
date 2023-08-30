import {getAddressInfo} from "@/utils/cardano";
import {formatLovelace} from "@/utils/ui";
import List from "@/components/List";

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
