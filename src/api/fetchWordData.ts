/* eslint-disable @typescript-eslint/no-explicit-any */

//Internal Imports
import { DictionaryData } from "../types/types";

//Setup the API URL
const apiURL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";

//Setup the API Key
const apiKey = import.meta.env.VITE_Webster_API_KEY;

//Fetches Data for a specified word from the API
export default async function fetchWordData(word: string): Promise<DictionaryData | Error> {
	//Setup the Full URL
	const url = `${apiURL}${word}?key=${apiKey}`;
	console.log(url);

	//Fetch the Data from the API
	const response = await fetch(url);

	//Check if the Data Fetch Failed
	if (!response.ok) return new Error(response.status.toString());

	//Get the Data from the Response
	const data = await response.json();

	//Get the Dictionary Data from the Data
	const dictionaryData = transformWordData(data[0]);

	//Return the Dictionary Data
	return dictionaryData;
}

//Transforms the Word Data into something more easily accessable
function transformWordData(rawData: any): DictionaryData {
	//Setup the Transformed Data
	const transformedData: DictionaryData = {
		metadata: rawData.meta,
		word: rawData.meta.id.replace(/:.*/, ""),
		pronounciation: rawData.hwi.hw,
		type: rawData.fl,
		definition: { title: rawData.shortdef.shift(), examples: rawData.shortdef },
		usage: [],
		soundID: rawData.hwi.prs[0].sound.audio,
	};
	//Setup the Base Audio URL
	const baseAudioURL = `https://media.merriam-webster.com/audio/prons/en/us/mp3`;

	//Setup the Audio Folder
	const audioFolder = transformedData.soundID?.slice(0, 1);

	//Setup the full Audio URL if the soundID is valid
	if (transformedData.soundID)
		transformedData.audioURL = `${baseAudioURL}/${audioFolder}/${transformedData.soundID}.mp3`;

	//Loop through the Definition Groups
	for (const defGroup of rawData.def) {
		//Loop through the Sense Sequences
		for (const senseSequence of defGroup.sseq) {
			//Loop through the items in the Sense Sequence
			for (const item of senseSequence) {
				//Get the Item Type
				const itemType = item[0];

				//Check if the Item Type is invalid
				if (itemType !== "sense") continue;

				//Get the Sense Data (as a Map)
				const senseData = new Map(item[1].dt);

				//get the Vis from the Sense Data
				const visData = senseData.get("vis") as Array<{ t: string }> | null;

				//Check if the Vis Data is Invalid
				if (!visData) continue;

				//Loop through the Vis data
				visData.forEach(usage => {
					//Check if the Usage Text does not include the searched word and continue to the next usage
					if (!usage.t.includes(transformedData.word)) return;

					//Get the Usage Text (Removing any styling templates)
					const usageText = usage.t.replace(/\{[^}]*\}/g, "").trim();

					//Add the Usage Text to the Usage Array
					transformedData.usage.push(usageText);
				});
			}
		}
	}

	//Return the Transformed Data
	return transformedData;
}
