import Link from "next/link";
import {getTransactionInfo} from "@/utils/cardano";
import {formatDate, formatLovelace} from "@/utils/ui";

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
                        <Link className="text-sm  leading-6 md:col-span-3 break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${object.address}`}>{object.address}</Link>
                        <Link className="text-xs  leading-6 md:col-span-3 break-all font-light text-blue-600 hover:text-blue-500 hover:underline" href={`/transaction/${object.tx_hash}`}>{object.tx_hash}</Link>
                        <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">{formatLovelace(object.value)}</div>
                    </div>
                ))}
                <div className="text-xl mb-2 pt-4">Outputs</div>
                {transactionInfo.outputs.map((object, i) => (
                    <div className="grid md:grid-cols-4">
                        <Link className="text-sm  leading-6 md:col-span-3 break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${object.address}`}>{object.address}</Link>
                        <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">{formatLovelace(object.value)}</div>
                    </div>
                ))}
            </div>
        </>
    );
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