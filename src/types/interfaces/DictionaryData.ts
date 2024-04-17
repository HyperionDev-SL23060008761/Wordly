//Export the Interface
export interface DictionaryData {
	metadata: Metadata;
	word: string;
	pronounciation: string;
	type: "verb" | "noun" | "adjective" | "adverb";
	definition: Definition;
	usage: Array<string>;
	soundID?: string;
	audioURL?: string;
}

//Setup the Meta Data Interface
interface Metadata {
	id: string;
	uuid: string;
	sort: string;
	src: string;
	section: Section;
	stems: Array<string>;
	offensive: boolean;
}

//Setup the Definition Interface
interface Definition {
	title: string;
	examples: Array<string>;
}

//Setup the Section Type
type Section = "alpha" | "biog" | "geog" | "fw&p";
