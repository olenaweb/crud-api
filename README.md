# crud-api
https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md


#### Main Development 
npm run start:dev     # - no warnings, stable launch

#### Development Alternatives  
npm run dev          # fast launch with tsx
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
  "start:dev": "cross-env NODE_NO_WARNINGS=1 npx ts-node --esm ./src/index.ts",
  "dev": "npx tsx ./src/index.ts",
  "dev:watch": "npx tsx watch ./src/index.ts",
  "dev:nodemon": "nodemon",
  "start:prod": "webpack && node ./dist/index.js",
  "lint": "npx eslint src/**/*.ts",
  "type-check": "npx tsc --noEmit",
  "fix": "npx prettier '**/*.{ts,css,html}' --write && npx eslint src/**/*.ts --fix"
}
```

#### New Dependencies:
- `tsx` - fast alternative to ts-node for development
- `cross-env` - cross-platform environment variables

## 🔧 Cross-env Explanation:

`cross-env` solves the problem of differences in setting environment variables between operating systems:

**Without cross-env:**
- Linux/Mac: ✅ `NODE_NO_WARNINGS=1 command`
- Windows: ❌ `'NODE_NO_WARNINGS' is not a command`

**With cross-env:**  
- All OS: ✅ `cross-env NODE_NO_WARNINGS=1 command`

`NODE_NO_WARNINGS=1` disables Node.js warnings for clean output.

## 🔄 TSX vs Nodemon for Auto-reload:

**`npm run dev:watch` (tsx watch)** - recommended:
- ⚡ Faster startup and restart
- 🎯 Optimized for TypeScript
- ✅ ES Modules out of the box
- 📦 Smaller package size

**`npm run dev:nodemon` (nodemon)** - classic approach:
- 👑 Industry standard
- 🔧 More settings (see `nodemon.json`)
- 📚 More documentation and examples
- ⏱️ 500ms delay before restart
- 📁 Watches only `src` folder

### 📁 Nodemon Configuration:
File `nodemon.json` with settings:
- Watches for changes in `src/`
- Ignores test files
- Uses 500ms delay for stability
- Automatically sets `NODE_ENV=development`


## 🚀 Quick Start:

**To test the project run:**
```bash
git clone https://github.com/olenaweb/crud-api.git
git checkout -b develop origin/develop
npm install
npm run start:dev      # Main development
# or
npm run dev:watch      # Fast development with tsx
# or  
npm run dev:nodemon    # Classic approach with nodemon
```

**Production:**
```bash
npm run start:prod     # Build and run optimized version
```

#### Check RUN

Browser URI : http://localhost:3500/api/users

#### Bash terminal , run "curl" with symbol for break to next line \ 
#### option -i  show status code ,headers,body
###### GET api/users is used to get all persons
curl http://localhost:3500/api/users

curl -i http://localhost:3500/api/users
###### POST api/users is used to create record about new user and store it in database
curl -X POST http://localhost:3500/api/users \
  -d '{"username":"Alice","age":28,"hobbies":["music","reading"]}'

curl -i -X POST http://localhost:3500/api/users \
  -d '{"username":"Alice","age":28,"hobbies":["music","reading"]}'

###### GET api/users/userId
curl http://localhost:3500/api/users/791e4409-5d3a-44fd-8141-e6a436df9cb8

curl -i http://localhost:3500/api/users/791e4409-5d3a-44fd-8141-e6a436df9cb8
###### PUT api/users/userId is used to update existing user
###### replace id for user with the current one in the database
curl -X PUT http://localhost:3500/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d \
  -d '{"username":"Alice","age":30,"hobbies":["writing","reading"]}'

curl -i -X PUT http://localhost:3500/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d \
  -d '{"username":"Alice","age":30,"hobbies":["writing","reading"]}'
  
###### DELETE api/users/userId is used to delete existing user from database
curl -X DELETE http://localhost:3500/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d  

curl -i -X DELETE http://localhost:3500/api/users/528e9190-bba2-43f7-8e4a-ed8785a1437d 

### Bash/Linux curl: 
#### Show headers +status code+ body

curl -i http://localhost:3500/api/users

#### Only status code  

curl -o /dev/null -s -w "%{http_code}" http://localhost:3500/api/users

#### Details

curl -v http://localhost:3500/api/users
