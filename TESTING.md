# Complete CRUD API Testing

This project contains comprehensive automated tests for the users CRUD API, meeting all assignment requirements.

##  Test Scenarios (3+ as required by assignment)

###  Scenario 1: Complete CRUD cycle (all 6 steps from assignment)
1. **Step 1**: GET /api/users - Get all records (empty array expected)
2. **Step 2**: POST /api/users - Create new object (response with newly created record expected)
3. **Step 3**: GET /api/users/{userId} - Get created record by ID (created record expected)
4. **Step 4**: PUT /api/users/{userId} - Update created record (response with updated object with same ID expected)
5. **Step 5**: DELETE /api/users/{userId} - Delete created object by ID (successful deletion confirmation expected)
6. **Step 6**: GET /api/users/{userId} - Try to get deleted object by ID (response that no such object exists expected)

###  Scenario 2: Data validation testing
- Checking invalid data types in POST requests
- Checking missing required fields
- Checking invalid UUID format

###  Scenario 3: Non-existent resources testing
- Getting non-existent user (404)
- Updating non-existent user (404)
- Deleting non-existent user (404)
- Accessing invalid endpoints (404)

##  How to run tests

### 1. Start server in one terminal:
```bash
npm run start:dev
```

### 2. Run tests in another terminal:
```bash
npm run test
```

##  Testing structure

- `tests/crud-api.test.ts` - Complete API tests (3 scenarios, 13 tests)
- `jest.config.cjs` - Jest configuration

##  Test results

**13 tests passed successfully**:

**Scenario 1: Complete CRUD cycle** (6 tests):
-  Step 1: Get all records with GET api/users request
-  Step 2: New object created with POST api/users request 
-  Step 3: Get created record by id with GET api/users/{userId} request
-  Step 4: Update created record with PUT api/users/{userId} request
-  Step 5: Delete created object with DELETE api/users/{userId} request
-  Step 6: Try to get deleted object with GET api/users/{userId} request

**Scenario 2: Data validation** (3 tests):
-  Should return 400 for invalid user data in POST request
-  Should return 400 for missing required fields
-  Should return 400 for invalid UUID format

**Scenario 3: Non-existent resources** (4 tests):
-  Should return 404 for non-existent user ID
-  Should return 404 when trying to update non-existent user
-  Should return 404 when trying to delete non-existent user
-  Should return 404 for invalid endpoints

##  Requirements compliance

 **not less than 3 scenarios** - 3 complete scenarios implemented  
 **All 6 steps from example** - fully covered in Scenario 1  
 **HTTP testing** - works with real server on port 4000
