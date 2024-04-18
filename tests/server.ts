//External Imports
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

//Internal Imports
import juniorMockData from "./mock_data/junior.json";

//Set up Mock Handlers
const handlers = [
	http.get("https://www.dictionaryapi.com/api/v3/references/collegiate/json/*", () => {
		//Wait for a few seconds (to simulate slow responses) then respond with a successful response with Mock Data
		setTimeout(() => {
			return HttpResponse.json(juniorMockData);
		}, 500);
	}),
];

//Setup and Export the Server
export const server = setupServer(...handlers);

//Start Server when starting Tests
export function startTest() {
	server.listen(); // Start the server
}

//Stop Server when Stopping Tests
export function stopTest() {
	server.close(); // Close the server
}
