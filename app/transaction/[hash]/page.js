import Link from "next/link";
import {getTransactionInfo} from "@/utils/cardano";
import {formatDate, formatLovelace} from "@/utils/ui";
import List from "@/components/List";
import Notes from "@/components/Notes";
import {CodeBracketSquareIcon} from "@heroicons/react/20/solid";
import {metadata} from "@/app/layout";

export default async function Transaction({params}) {
    const transactionInfo = await getTransactionInfo(params.hash)

    return (
        <>
            <TransactionInfo transactionInfo={transactionInfo}></TransactionInfo>
            <InputsAndOutputs transactionInfo={transactionInfo}></InputsAndOutputs>
            {transactionInfo.metadata &&
                <Metadata transactionInfo={transactionInfo}></Metadata>
            }
            <Notes reference={transactionInfo.hash}></Notes>
        </>
    );
}

function TransactionInfo({transactionInfo}) {
    return (
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
    )
}

function InputsAndOutputs({transactionInfo}) {

    function colorForWalletId(id) {
        switch (id) {
            case 1: return 'bg-blue-500'
            case 2: return 'bg-green-600'
            case 3: return 'bg-yellow-500'
            case 4: return 'bg-pink-600'
            case 5: return 'bg-violet-700'
            case 6: return 'bg-sky-900'
            default: return 'bg-black'
        }
    }

    return (
        <div className="bg-white p-6 mt-4 rounded-xl shadow-lg w-full divide-y divide-gray-100">
            <div className="text-xl mb-2">Inputs</div>
            {transactionInfo.inputs.map((object, i) => (
                <div className="grid md:grid-cols-4 py-1">
                    <div className="flex items-center leading-6 md:col-span-3 gap-3">
                        <div className={`${colorForWalletId(object.wallet_id)} text-white px-2 rounded-xl flex align-middle`}>{object.wallet_id}</div>
                        <Link className="text-sm   break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${object.address}`}>{object.address}</Link>
                        {object.address_has_script &&
                            <CodeBracketSquareIcon className="w-7 h-7 fill-blue-600" />
                        }
                    </div>
                    <Link className="text-xs  leading-6 md:col-span-3 break-all font-light text-blue-600 hover:text-blue-500 hover:underline" href={`/transaction/${object.tx_hash}`}>{object.tx_hash}</Link>
                    <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">
                        <div>{formatLovelace(object.value)}</div>
                        <div className="flex flex-wrap gap-2 justify-end">
                            {object.tokens.map((token) => (
                                <div className="bg-blue-600 px-2 rounded text-white"><b>{token.quantity}</b> {/^[\u0000-\u007f]*$/.test(token.assetName) ? token.assetName : token.fingerprint.slice(0,9)+'...'+token.fingerprint.slice(40)}</div>
                            ))}
                        </div>
                    </div>
                </div>

            ))}
            <div className="text-xl mb-2 pt-4">Outputs</div>
            {transactionInfo.outputs.map((object, i) => (
                <div className="grid md:grid-cols-4 py-1">
                    <div className="flex items-center leading-6 md:col-span-3 gap-3">
                        <div className={`${colorForWalletId(object.wallet_id)} text-white px-2 rounded-xl flex align-middle`}>{object.wallet_id}</div>
                        <Link className="text-sm   break-all font-medium text-blue-600 hover:text-blue-500 hover:underline" href={`/address/${object.address}`}>{object.address}</Link>
                        {object.address_has_script &&
                            <CodeBracketSquareIcon className="w-7 h-7 fill-blue-600" />
                        }
                    </div>
                    <div className="mt-1 text-sm leading-6 text-right mb-3 md:mb-0">
                        <div>{formatLovelace(object.value)}</div>
                        <div className="flex flex-wrap gap-2 justify-end">
                            {object.tokens.map((token) => (
                                <div className="bg-blue-600 px-2 rounded text-white"><b>{token.quantity}</b> {/^[\u0000-\u007f]*$/.test(token.assetName) ? token.assetName : token.fingerprint.slice(0,9)+'...'+token.fingerprint.slice(40)}</div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function Metadata({transactionInfo}) {
    return (
        <div className="bg-white p-6 mt-4 rounded-xl shadow-lg w-full divide-y divide-gray-100">
            <h2 className="text-xl mb-4">Metadata</h2>
            <div className="mt-2">
                {transactionInfo.metadata.map((metadata) => (
                    <div className="grid grid-cols-12 mt-2">
                        <div className="col-span-1 text-sm font-medium leading-6 text-gray-900">
                            {metadata.key}
                        </div>
                        <div className="col-span-11 font-mono break-all">
                            {JSON.stringify(metadata.json, null, 3)}
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}