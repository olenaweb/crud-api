# crud-api
https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md


#### Main Development 
npm run start:dev     #  no warnings, stable launch

#### Development Alternatives  

npm run dev:watch    # with auto-reload on changes (tsx watch)

npm run dev:nodemon  # with auto-reload via nodemon

#### Production
npm run start:prod   # Build and run

#### Code Checks
npm run lint         # Code style check
npm run type-check   # TypeScript type check
npm run fix          # Auto-fix errors

#### package.json:

#### Scripts:
```json
{
  "start:dev": "npx ts-node --esm ./src/index.ts",
  "dev:watch": "npx tsx watch ./src/index.ts",
  "dev:nodemon": "nodemon",
  "start:prod": "webpack && node ./dist/index.js",
  "start:multi": "npx tsx ./src/clusterServer.ts",
  "lint": "npx eslint src/**/*.ts",
  "type-check": "npx tsc --noEmit",
  "fix": "npx prettier '**/*.{ts,css,html}' --write && npx eslint src/**/*.ts --fix"
}
```

##  TSX vs Nodemon for Auto-reload:

**`npm run dev:watch` (tsx watch)** - recommended:
-  Faster startup and restart
-  Optimized for TypeScript
-  ES Modules out of the box
-  Smaller package size

**`npm run dev:nodemon` (nodemon)** - classic approach:
-  Industry standard
-  More settings (see `nodemon.json`)
-  More documentation and examples
-  500ms delay before restart
-  Watches only `src` folder

###  Nodemon Configuration:
File `nodemon.json` with settings:
- Watches for changes in `src/`
- Ignores test files
- Uses 500ms delay for stability
- Automatically sets `NODE_ENV=development`


##  Quick Start:

**To test the project run:**
```bash
git clone https://github.com/olenaweb/crud-api.git
git checkout -b develop origin/develop
npm install
npm run start:dev      # Main development (single process)
# or
npm run dev:watch      # Fast development with tsx
# or  
npm run dev:nodemon    # Classic approach with nodemon
```

**Production:**
```bash
npm run start:prod     # Build and run optimized version (single process)
```

**Multi-process with Load Balancer:**
```bash
npm run start:multi    # Cluster mode with load balancer on port 4000 and workers on ports 4001,4002 etc.
```

##  Horizontal Scaling:

The application supports horizontal scaling using Node.js Cluster API:

**Single Process Mode:**
- Uses in-memory database
- Runs on single port (default: 4000)
- Fast for development

**Multi-process Mode (`npm run start:multi`):**
- Uses shared file-based database (`users.json`)
- Load balancer on port 4000
- Workers on ports 4001, 4002, 4003, etc. (number of CPUs - 1)
- Round-robin load balancing
- Consistent database state across all workers

#### Check RUN

Browser URI : http://localhost:4000/api/users

###### Bash terminal , run "curl" with symbol for break to next line \ 
###### option -i  show status code ,headers,body
###### Note that in PowerShell you need to escape quotes within JSON using \".

###### GET api/users is used to get all persons
1. curl http://localhost:4000/api/users

2. curl -i http://localhost:4000/api/users
###### POST api/users is used to create record about new user and store it in database
3. curl -X POST http://localhost:4000/api/users -d '{"username":"Alice","age":28,"hobbies":["music","reading"]}'

4. curl -i -X POST http://localhost:4000/api/users -d '{"username":"Alice","age":28,"hobbies":["music","reading"]}'

###### GET api/users/userId
5. curl http://localhost:4000/api/users/791e4409-5d3a-44fd-8141-e6a436df9cb8

6. curl -i http://localhost:4000/api/users/791e4409-5d3a-44fd-8141-e6a436df9cb8
###### PUT api/users/userId is used to update existing user
###### replace id for user with the current one in the database
7. curl -X PUT http://localhost:4000/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d -d '{"username":"Alice","age":30,"hobbies":["writing","reading"]}'

8. curl -i -X PUT http://localhost:4000/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d -d '{"username":"Alice","age":30,"hobbies":["writing","reading"]}'
  
###### DELETE api/users/userId is used to delete existing user from database
9. curl -X DELETE http://localhost:4000/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d  

10. curl -i -X DELETE http://localhost:4000/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d 

####  Multi-process Mode (`npm run start:multi`):
##### creating 2 users in parallel in 2 workers

11. curl -i -X POST http://localhost:4000/api/users -d '{"username":"Alice","age":11,"hobbies":["music","reading"]}' & curl -i -X POST http://localhost:4000/api/users -d '{"username":"Kira","age":13,"hobbies":["traveling","reading"]}'

look result in Browser URI : http://localhost:4000/api/users 
or the same result in http://localhost:4001/api/users 
or the same result in http://localhost:4002/api/users etc.

### Bash/Linux curl: 
#### Show headers +status code+ body

12. curl -i http://localhost:4000/api/users

#### Only status code  

13. curl -o /dev/null -s -w "%{http_code}" http://localhost:4000/api/users

#### Details

14. curl -v http://localhost:4000/api/users

# Complete CRUD API Testing

⚠️ **IMPORTANT: Before running tests, start the server!**

## Testing Steps:

1. **Start the server first:**
```bash
npm run start:dev     # Single process mode
# OR
npm run start:multi   # Multi-process mode
```

2. **Run tests (in a separate terminal):**
```bash
npm test
```

## Alternative: Use the batch script
For Windows users, you can use the automated batch script:
```bash
./run-tests.bat
```
This script will automatically start the server, run tests, and stop the server.

For complete testing documentation, see TESTING.md file
