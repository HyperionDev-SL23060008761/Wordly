//Internal Imports
import { expect, describe, it, beforeAll, afterEach, afterAll } from "vitest";
import fetchWordData from "../../src/api/fetchWordData";
import { server } from "../server";

//Start the server before running any test
beforeAll(() => server.listen());

//Reset the handlers after each test
afterEach(() => server.resetHandlers());

//Close the server after all the tests are completed
afterAll(() => server.close());

//Start testing the fetchWordData function
describe("fetchWordData", () => {
	//Test the API to fetch data successfully
	it("fetches data successfully", async () => {
		//Fetch data for the Word Junior
		const data = await fetchWordData("junior");

		//Check if the Data is an instance of error and fail the test
		if (data instanceof Error) throw new Error(`Error fetching data: ${data.message}`);

		//Test to see if the data has a correct id
		expect(data.metadata.id).toContain("junior");
	});

	//Test the API on handline errors
	it("handles API errors", async () => {
		//Get the Data for a Non-Existent Word
		const data = await fetchWordData("jksdnwersk;ljfc");

		//Test to see if the data is an instance of Error
		expect(data).toBeInstanceOf(Error);
	});
});
