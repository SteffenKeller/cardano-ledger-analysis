import Link from "next/link";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";

export default function Layout({children}) {
    return (
        <main className="min-h-screen w-full p-5  items-baseline justify-center">
            <div className="py-5 lg:px-28 flex">
                <Link href="/"
                      className="p-2 hover:bg-gray-200 rounded-full">
                    <ArrowLeftIcon className="h-6 w-6" />
                </Link>
            </div>

            <div className="min-h-screen w-full lg:px-28 flex items-baseline justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full">

                    {children}

                </div>
            </div>

        </main>
    )
}