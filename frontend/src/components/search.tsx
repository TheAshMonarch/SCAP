import { BiSearchAlt } from 'react-icons/bi';
import { useState } from "react";


const Search = () => {

    const [ssearch, setSearch] = useState("");
    const [result, setResult] = useState([]);
    const handleSubmit = () => {
        
    }
    return(
        <div className="flex w-full justify-end">
        <div className=" relative justify-end">
            <form className="">
            <input
                name="search"
                type="text"
                placeholder="Search...             "
                value={ssearch}
                onChange={((e) => setSearch(e.target.value))}
                onSubmit={handleSubmit}
                className="border border-gray-500 rounded-3xl p-2
                        placeholder:text-gray-400 placeholder:italic placeholder:text-right placeholder:text-sm"
            />
            </form>
        </div>
            <div className="">
                <button className="p-2 text-white bg-accent-color rounded-md shadow-lg mt-1 ml-1 shadow-slate-300 hover:cursor-pointer "> {<BiSearchAlt/>}</button>
            </div>
        </div>
    )
}
export default Search