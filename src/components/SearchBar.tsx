//External Imports
import React, { useState } from "react";

//Internal Imports
import { SearchBarProps } from "../types/types";

//Setup the Component
export default function SearchBar({ onSearch }: SearchBarProps) {
	//Setup the Search Term State
	const [searchTerm, setSearchTerm] = useState("");

	//Handles Submit Event for the Search Form
	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		//Prevent Default events (like submitting the form and causing a refresh)
		event.preventDefault();

		//Run the On Search Handler
		onSearch(searchTerm);

		//Clear the Search Term
		setSearchTerm("");
	};

	//Return the Component's Content
	return (
		<form
			onSubmit={handleSubmit}
			className="flex items-center rounded-md bg-gray-800 rounded-full overflow-hidden border-gray-900/30 border-2"
		>
			<input
				type="text"
				placeholder="Search for a word..."
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value)}
				className="w-full bg-transparent border-none text-white focus:ring-0 focus:outline-none mx-4"
			/>
			<button
				type="submit"
				className="bg-blue-500 hover:bg-blue-600 focus:ring-blue-300 text-white font-medium px-3 py-2"
			>
				Search
			</button>
		</form>
	);
}
