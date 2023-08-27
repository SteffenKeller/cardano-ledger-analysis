import Link from "next/link";
import {HomeIcon} from "@heroicons/react/24/solid";
import {getAddressInfo} from "@/utils/cardano";

export default async function AddressInfo({params}) {
    return (
        <>
            <div className="p-8">
                <h2 className="text-4xl mb-4">Address</h2>
            </div>
        </>
    );
}
