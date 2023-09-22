"use client";

import {useEffect, useState} from "react";

export default function Notes({reference}) {

    const [note, setNote] = useState('');

    useEffect(() => {
        setNote(localStorage.getItem(reference))
    }, [])

    function handleUpdate(e) {
        e.preventDefault()
        localStorage.setItem(reference, e.target.value)
        setNote(localStorage.getItem(reference))
    }

    return (
        <div className="bg-white p-6 mt-4 rounded-xl shadow-lg w-full">
            <div className="">
                <h2 className="text-xl mb-4">Notes</h2>
                <textarea rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your notes here..." onChange={handleUpdate} value={note}></textarea>
            </div>
        </div>

    )
}