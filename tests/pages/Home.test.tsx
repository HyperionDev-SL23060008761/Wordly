//External Imports
import { expect, describe, it, beforeAll, afterEach, afterAll } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

//Internal Imports
import Home from "../../src/pages/Home";
import { server } from "../server";

//Start the server before running any test
beforeAll(() => server.listen());

//Reset the handlers after each test
afterEach(() => {
	server.resetHandlers();
	cleanup();
});

//Close the server after all the tests are completed
afterAll(() => server.close());

//Setup the Test
describe("Component", () => {
	//Check if the Component Renders Correctly
	it("renders correctly", () => {
		//Render the Component
		render(<Home />);

		//Get the Heading Element
		const headingElement = screen.getByRole("heading", { name: /Wordly/i });

		//Get the Search Bar Element
		const searchBarElement = screen.getByPlaceholderText("Search for a word...");

		//Get the Submit Button Element
		const submitButtonElement = screen.getByRole("button", { name: /Search/i });

		//Check if the Heading Element is in the Document
		expect(headingElement).to.exist;

		//Check if the Search Bar is in the Document
		expect(searchBarElement).to.exist;

		//Check if the Submit Button is in the Document
		expect(submitButtonElement).to.exist;
	});

	//Check if the Loading State Works Correctly
	it("handles loading state", async () => {
		//Render the Home Page
		render(<Home />);

		//Get the Search Bar Element
		const searchBarElement = screen.getByPlaceholderText("Search for a word...");

		//Get the Submit Button Element
		const submitButtonElement = screen.getByRole("button", { name: /Search/i });

		//Input a Test Search Term into the Search Bar
		await userEvent.type(searchBarElement, "hello");

		//Search the Test Search Term
		await userEvent.click(submitButtonElement);

		//Get the Loading Indicator
		const loadingIndicator = screen.findByRole("progressbar", { name: "loader" });

		//Check if the Loading Indicator is in the Document
		expect(loadingIndicator).to.exist;

		//Wait to see if the Loading finishes
		await waitFor(() => {
			const loadingIndicator = screen.queryByRole("progressbar", { name: "loader" });
			expect(loadingIndicator).toBeNull();
		});
	});
});
