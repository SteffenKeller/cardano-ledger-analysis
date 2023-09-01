"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import {validateByronAddress, validateShellyAddress} from "@/utils/cardano";

export default function SearchBar() {
    const router = useRouter()
    const [searchInput, setSearchInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function handleTextFieldChange(e) {
        setSearchInput(e.target.value);
        setErrorMessage('');
    }

    function handleSearchClick() {

        if (validateShellyAddress(searchInput) || validateByronAddress(searchInput)) {
            router.push(`/address/${searchInput}`)
        } else if (searchInput.length === 64) {
            router.push(`/transaction/${searchInput}`)
        } else {
            setErrorMessage('Invalid input')
        }
    }

    return (
    <div className="relative flex w-full">
        <input
            type="text"
            id="address"
            className={`flex-grow border ${errorMessage !== '' ? 'border-red-500' : 'border-gray-300 focus:border-blue-600'} p-2 rounded-l-lg focus:outline-none transition-colors`}
            placeholder="Enter address or transaction..."
            value={searchInput}
            onChange={handleTextFieldChange}
        />

        <a
            className="px-5 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none transition-colors hover:cursor-pointer"
            onClick={handleSearchClick}
        >
            Search
        </a>
    </div>

)

}