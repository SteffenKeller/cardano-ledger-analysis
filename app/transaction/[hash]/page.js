import Link from "next/link";
import {getTransactionInfo} from "@/utils/cardano";
import {formatDate, formatLovelace} from "@/utils/ui";
import List from "@/components/List";

export default async function TransactionInfo({params}) {
    const transactionInfo = await getTransactionInfo(params.hash)

    return (
        <>
            <div className="bg-white px-6 py-8 rounded-xl shadow-lg w-full">
                <div className="">
                    <h2 className="text-3xl mb-4">Transaction</h2>
                    <div className="text-gray-600 break-all">
                        {transactionInfo.hash}
                    </div>
                </div>
                <div className="mt-4">
                    <List rows={[
                        ["Timestamp", formatDate(transactionInfo.block.time)],
                        ["Block", transactionInfo.block.block_no],
                        ["Total Output", formatLovelace(transactionInfo.tx.out_sum)],
                        ["Fee", formatLovelace(transactionInfo.tx.fee)],
                    ]}>
                    </List>
                </div>
            </div>
            <div className="bg-white px-6 py-8 mt-4 rounded-xl shadow-lg w-full divide-y divide-gray-100">
                <div className="text-xl mb-2">Inputs</div>
                {transactionInfo.inputs.map((object, i) => (
                    <div className="grid md:grid-cols-4">
                        <div className="flex items-center leading-6 md:col-span-3 gap-3">
                            <Link className="text-sm   break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${object.address}`}>{object.address}</Link>
                            <div className="bg-purple-800 text-white px-2 rounded flex align-middle">{object.wallet_id}</div>
                        </div>
                        <Link className="text-xs  leading-6 md:col-span-3 break-all font-light text-blue-600 hover:text-blue-500 hover:underline" href={`/transaction/${object.tx_hash}`}>{object.tx_hash}</Link>
                        <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">{formatLovelace(object.value)}</div>
                    </div>
                ))}
                <div className="text-xl mb-2 pt-4">Outputs</div>
                {transactionInfo.outputs.map((object, i) => (
                    <div className="grid md:grid-cols-4">
                        <div className="flex items-center leading-6 md:col-span-3 gap-3">
                            <Link className="text-sm   break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${object.address}`}>{object.address}</Link>
                            <div className="bg-purple-800 bg-clip-border text-white px-2 rounded">{object.wallet_id}</div>
                        </div>
                        <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">{formatLovelace(object.value)}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
