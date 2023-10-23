# Forum API <small>v2.0</small>

Created By Joseph Dedy Irawan

## Installation

Since already listed in ```package.json```, run command using ```npm```, ```--verbose``` here indicate for npm to print, detailing each of the process.

```bash
  npm install --verbose
``` 

Copy manually or using these command below from every configuration example files then manually set necessary variables and settings.
Both file ```config/database/test.json``` and ```.env```

- Windows
 
  For file test.json
  ```bash
  copy config/database/test.example.json config/database/test.json
  ```
  For file .env
  ```bash
  copy .env.example .env
  ```

- Linux

  For file test.json
  ```bash
  cp config/database/test.example.json config/database/test.json
  ```
  For file .env
  ```bash
  cp .env.example .env
  ```

### History

```bash
npm install @hapi/hapi @hapi/jwt bcrypt dotenv nanoid@3.x.x pg
```

For dev dependencies:

```bash
npm install @types/jest eslint jest node-pg-migrate nodemon --save-dev
```

## Service Locator

May use one of providers one of them is Instance Container,
```bash
npm install instances-container
```

or if preferable using  [Awilix](https://github.com/jeffijoe/awilix),

```bash
npm install awilix
```

or [Bottlejs](https://github.com/young-steveo/bottlejs)

```bash
npm install bottlejs
```

## Eslint Initiation

```bash
npx eslint --init
```

Then may follow these answer

- How would you like to use ESLint?
  > To check, find problems, and enforce code style
- What type of modules does your project use?
  > CommonJS (require/exports)
- Which framework did you use?
  > None of these
- Does your project use TypeScript?
  > N
- Where does your code run?
  > Node (pilih menggunakan spasi, perhatikan centang di sisi kiri pilihan).
- How would you like to define a style for your project?
  > Use a popular style guide.
- Which style guide do you want to follow?
  > (Anda bebas memilih, sebagai contoh pilih AirBnB)
- What format do you want your config file to be in?
  > JSON
- Would you like to …… (seluruh pertanyaan selanjutnya)
  > Yes
- Which package manager do you want to use? (depends on your package manager availibility)
  > npm

Run command below to check code validity and integrity

```bash
npx eslint
```

Other command associate with eslint

```bash
eslint --fix
```
or targeting by file
```bash
eslint --fix yourfile.js
```
or targeting by folder
```bash
eslint --fix your-directory/
```
or
```bash
eslint --fix --quiet
```

## Create migration

```bash
npm run migrate create "create table <table_name>"
```

## PostgreSQL Database

1. Create User
    ```bash
    CREATE USER <new_username> WITH ENCRYPTED PASSWORD '<new_username_password>';
    ```
2. Create Database
    ```bash
    CREATE DATABASE <new_database>
    ```
3. Privileges
    ```bash
    GRANT ALL ON DATABASE <new_databases> TO <new_username>;
    ```
   OR
    ```bash
    GRANT ALL PRIVILEGES ON DATABASE <new_databases> TO <new_username>;
    ```
4. Database Owner
    ```bash
    ALTER DATABASE <new_databases> OWNER TO <new_username>;
    ```
5. Grant ```public``` schema if needed

   First select database by these command
    ```bash
    \c <new_databases> <root_username>;
    ```
   Then allow user schema ```public``` on selected database
    ```bash
    GRANT ALL ON SCHEMA public TO <new_username>;
    ```
   OR secondary if above unsuccessful
    ```bash
    GRANT USAGE ON SCHEMA public TO <new_username>;
    ```
6. Run migration
   
   Before run migration make sure both database for both test and release are created. 
   ```bash
   npm run migrate up
   ```
   for development (test) create similarly like steps above but with different database and migration command
    ```bash
   npm run migrate:test up
    ```

## JWT (JSON Web Token)

1. Since using Hapi Framework and JWT (JSON Web Token), may install JWT third party library through this command.

   Do not run this if already installed!
    ```bash
    npm install @hapi/jwt
    ```

2. Generate random token using Node RPL, first command
    ```bash 
    node
    ``` 
   then write and run by click enter,
    ```bash
    require('crypto').randomBytes(64).toString('hex');
    ```

3. Do it twice for **ACCESS_TOKEN_KEY** and **REFRESH_TOKEN_KEY** of JWT in environment file ```.env```

## Restore 'Immaculate' Project State

- For UNIX based system
  ```bash
  find . -type f -name '*.log' -o -type d -name 'node_modules' | xargs git clean -ff
  ```  
- For Windows
  
  Run Batch script ```ForumApiReset.bat``` by double-click on it.
  
  Caution: will permanently delete everything mentioned in .gitignore
