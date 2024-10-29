//External Imports
import { Fragment, useState } from "react";

//Internal Imports
import SearchBar from "../components/SearchBar";
import fetchWordData from "../api/fetchWordData";
import { DictionaryData } from "../types/types";
import { RiSpeakFill } from "react-icons/ri";
import { PropagateLoader } from "react-spinners";

//Setup the Page
export default function Home() {
	//Setup the State
	const [wordData, setWordData] = useState<DictionaryData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	//Handle Search Events
	async function handleSearch(searchTerm: string) {
		//Update the Loading State
		setIsLoading(true);

		//Reset the Word Data
		setWordData(null);

		//Reset the Error State
		setError(null);

		//Get the Word's Data
		const data = await fetchWordData(searchTerm);

		//Check if the Word Data is a type of Error and save the Error in the State
		if (data instanceof Error) setError(data);

		//Check if the Word Data is not a type of Error and save the Data in the State
		if (!(data instanceof Error)) setWordData(data);

		//Mark the Loading as Complete
		return setIsLoading(false);
	}

	//Handles Playing the Pronounciation Audio
	function playAudio() {
		//Get the Audio Element
		const audioElement = document.querySelector(`#pronounciation-audio`);

		//Check if the Audio Element is invalid
		if (!audioElement || !(audioElement instanceof HTMLAudioElement)) return;

		//Update the volume of the Audio Element
		audioElement.volume = 0.5;

		//Play the Audio
		audioElement.play();
	}

	//Return the Page's Content
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-20">
			<header className="text-center mb-10">
				<h1 className="text-6xl font-bold text-blue-600">Wordly</h1>
			</header>
			<main className="">
				<SearchBar onSearch={handleSearch} />

				{isLoading && (
					<div className="p-6 border bg-[#161616] border-gray-200 rounded-lg shadow-lg w-[75vw] h-[50vh] flex justify-center items-center">
						<PropagateLoader color="#2563eb" id="loader" />
					</div>
				)}
				{error && <p>Error fetching data: {error.message}</p>}
				{wordData && (
					<div className="p-6 border bg-[#161616] border-gray-200 rounded-lg shadow-lg flex flex-col w-[75vw]">
						{/*Setup the Main Word Details (Name, Pronounciation, and Audio)*/}
						<div className="flex items-center justify-between mb-6">
							<div className="flex flex-col">
								<h3 className="text-md font-medium text-gray-100/50">{wordData.pronounciation}</h3>
								<h2 className="text-2xl font-medium">
									{wordData.word} ({wordData.type})
								</h2>
							</div>
							{wordData.soundID && (
								<Fragment>
									<RiSpeakFill
										className="text-3xl hover:text-blue-400 cursor-pointer transition-colors"
										onClick={() => playAudio()}
									/>
									<audio id="pronounciation-audio" src={wordData.audioURL} hidden={true}></audio>
								</Fragment>
							)}
						</div>

						{/*Setup the Word's Content*/}
						<div className="max-h-[50vh] overflow-y-auto">
							{/*Setup the Word's Description*/}
							<div className="mb-4">
								<h3 className="text-lg font-medium ">Definition</h3>
								<h4 className="mb-1">{wordData.definition.title}</h4>
								<ul className="list-disc pl-6 space-y-2">
									{wordData.definition.examples.map((def, index) => (
										<li key={index}>{def}</li>
									))}
								</ul>
							</div>

							{/*Setup the Word's Use Examples*/}
							{wordData.usage.length > 0 && (
								<div className="space-y-4">
									<h3 className="text-lg font-medium">Example Usage</h3>
									<ul className="list-disc pl-6 space-y-2">
										{wordData.usage.map((def, index) => (
											<li key={index}>{def}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
