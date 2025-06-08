

describe('Test cases to automate the sending of requests to API endpoints (for eSIM order) and verify response (eSIMs created)', () => {
    let authToken;
    let orderId;

// Define constatnts as a variable for this Airalo API test
// In actual scenario, these values should be stored in a secure vault or environment variables
const clientId = "7e29e2facf83359855f746fc490443e6";
const clientSecret = "e5NNajm6jNAzrWsKoAdr41WfDiMeS1l6IcGdhmbb";
const quantity = "6";
const packageId = "merhaba-7days-1gb";
const type = "sim";
const description = "Kunal_test";
const brandSettingsName = "";  // brand_settings_name was giving error, so left it null as per API documentation

    
    it('Test-1: Obtain OAuth2 token to access the Airalo Partner API, using the provided credentials', () => {
               
              cy.request({
                method: 'POST',
                url: 'https://sandbox-partners-api.airalo.com/v2/token',
                body: {
                  client_id: clientId,
                  client_secret: clientSecret,
                  grant_type: "client_credentials",
                },
              }).then((response) => {
                // Verify the successful response status 
                expect(response.status).to.eq(200);
                 
          
                // Verify that response body conains the access_token property
                // save the token to a variable for use in subsequent POST and GET request
                expect(response.body.data).to.have.property('access_token');
                authToken = response.body.data.access_token;
                cy.log('Successfully obtained OAuth2 token to access the Airalo Partner API'); 
                cy.wrap(authToken).as('authToken');
            });
        });

  
    it('Test-2: Submit eSIM Order by using POST request with desired properties', () => {
    cy.request({
        method: 'POST',
        url: 'https://sandbox-partners-api.airalo.com/v2/orders',
        headers: {
          Authorization: `Bearer ${authToken}`, // Use the token from the variable
        },
        body: {
            "quantity" : quantity,
            "package_id" : packageId,
            "type" : type,
            "description" : description,
            "brand_settings_name" : brandSettingsName
            }
      }).then((response) => {
        // Verify the response and different output parameters
        expect(response.status).to.eq(200);  
        expect(response.body.data).to.have.property('id');
        expect(response.body.data).to.have.property('package_id');
        expect(response.body.data).to.have.property('sims');
        expect(response.body.data).to.have.property('quantity');

        cy.log('POST CALL of ordering 6 SIMS successful- Recieved 200 OK');

        // Save the order id to further verification of ordered SIMS status via GET request
        orderId = response.body.data.id;
        cy.log (`Saved Order ID: ${orderId}`);     
            });
        });
    


    it('Test-3: GET eSIM Order status for POST order ID to ensure all the eSIMs are configured with correct package', () => {
            cy.request({
                method: 'GET',
                url: 'https://sandbox-partners-api.airalo.com/v2/sims?include=order',
                headers: {
                  Authorization: `Bearer ${authToken}`, // Using the token from the previous variable
                },
               
              }).then((response) => {
                // Verify the successful response of the GET request
                expect(response.status).to.eq(200);
                cy.log('GET CALL of ordering 6 SIMS successful- Recieved 200 OK');
                
                //cy.log('Full Response Body:', JSON.stringify(response.body, null, 2));
                expect(response.body).to.have.property('data');
                expect(response.body.data).to.be.an('array');
                
                // Step 1: Filter objects where simable.id matches the order ID extracted from the POST call
                const matchingObjects = response.body.data.filter((item) => item.simable && item.simable.id === orderId);
         

                  // Count occurrences of simable.id equal to orderId- There should be 6 eSIMs ordered match
                  const count = matchingObjects.length;
                  cy.log(`Count of Total eSIMS simable.id = ${orderId}: ${count}`);
                  expect(count).to.eq(6);
                  
                         
                  // Log the matching objects for debugging purpose and check there are 6 of them
                  cy.log('Matching Objects Count:', matchingObjects.length);
                  cy.log('Matching Objects:', JSON.stringify(matchingObjects, null, 2));

                // Step 2: Verify package_id and quantity for the matching objects in the iteam extracted by matching the order ID
                // Ensure the list contains 6 eSIMs, and that all of them have the "merhaba-7days-1gb" package slug.

                   matchingObjects.forEach((item) => {
                    expect(item).to.have.property('simable');
                    expect(item.simable).to.have.property('package_id');
                    expect(item.simable.package_id).to.eq(packageId);
                });                
         });
      });
    });

 


