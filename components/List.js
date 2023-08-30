export default function List({ rows }) {
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