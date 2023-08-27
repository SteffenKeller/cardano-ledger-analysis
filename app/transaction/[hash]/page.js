import {getTransactionInfo} from "@/utils/cardano";

export default async function TransactionInfo({params}) {
    const transactionInfo = await getTransactionInfo(params.hash)

    return (
        <>
            <div className="">
                <h2 className="text-3xl mb-4">Transaction</h2>
                <div className="text-gray-600 break-all">
                    {transactionInfo.hash}
                </div>
            </div>
            <div className="mt-4">
                <List rows={[
                    ["Last Activity", "hi"],
                ]}>
                </List>
            </div>
            <div className="button">

            </div>

        </>
    );
}

function List({ rows }) {
    return (
        <div className="px-4 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
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