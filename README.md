# TestAuto
## Automate API transactions

**Instructions to setup and run the test using Cypress/JavaScript:**

1. Setup
   
Install Node.js: Cypress requires Node.js. Download and install it from the official website - https://node.js.org/download/release/v16.13.2/

Create a Project: Create a new directory for your project and navigate into it using the command line. 

Initialize npm: Run "npm init" 

Install Cypress: Run "npm install cypress --save-dev"


2. Open Cypress
Open Cypress: Execute "npx cypress open" to launch the Cypress Test Runner.

3. Create the Test File
Inside the cypress/e2e/ folder, create a new test file. Here I have automated and written TEST_FILE.spec.js

4. Run the Test
You can run the test in the Cypress Test Runner UI or headlessly


**Overview of approach to implement the test case**

Objective: Automate requests to the Airalo Partner API and validate the responses.

Choice of Framework/Language: Cypress/JavaScript

Reason: Cypress is an excellent choice for automating API testing in most scenarios due to its ease of use, real-time debugging, and integration capabilities.

**Automation Approach**
1)	Define variables and constants
2)	Automate POST API for obtaining OAuth2 tokens to access the Airalo Partner API, using the provided credentials and save the token to be used in subsequent AIRALO APIs
3)	Automate POST API to order 6 "merhaba-7days-1gb" eSIMs. Save the order ID to verify configured eSIMS through the GET API.
4)	Automate GET API to list eSIMs related to your specific order Oobtained through step-3. Ensure the list contains 6 eSIMs, and that all of them have the "merhaba-7days-1gb" package slug.

**Few Considerations**
- We can add more log statements to print full API response or a particular API response object for debugging purpose for error scenarios.
- We can add negative scenarios by playing around the configs and passing wrong tokens, header or body parameters.
- Constants and Variables should be stored in an environment variable or test data file.
- In real scenario, Ids and secrets should be stored in a Vault. As this is a test sandbox environemt, I am calling these parameters directly in the test file. 

**For test cases steps, automation technique/strategy, test output and artefacts, kindly refer the other attached file- Task-1.docs**



