# Slidely Ai Backend

## Description

This project implements a backend server using ***Express and TypeScript*** to manage form submissions. It provides endpoints for ***submitting, reading, updating, deleting submissions, and searching by email***. Submissions are stored in a JSON file (`db.json`) on the server.
### Api EndPoints

 - GET **/ping**: Health check endpoint to confirm the server is running, ***returning { success: true }.***
 - POST **/submit**: Accepts new form submissions with fields ***name, email,
   phone, github_link, and stopwatch_time***. These submissions are stored
   in the ***db.json*** file.
   
 - GET ****/read?index=<index>****: ***Retrieves a specific submission*** based on its
   ***0-indexed position***. 
	
 - DELETE **/delete?index=<index>:** ***Deletes a       submission*** by its
   index.

   

 - PUT **/update/:index:** ***Updates*** a submission at a specified index with   
   new values for ***name, email, phone, github_link, and stopwatch_time***.

   
  

 - GET **/search?email=<email>:** ***Searches for a submission by email*** and   
   returns the submission object along with its index.

#### Installation Process

**1.** **Clone the project**

```bash
  git clone https://github.com/akkulsecond213/Slidely_ai_backend.git
```

**2. Go to the project directory**

```bash
  cd Slidely_ai_backend
```

**3. Install dependencies**

```bash
  npm install
```

**4 . Start the server**

```bash
  npm run start
```
5. We can also use ***nodemon*** as it helps in ***automatically restarting the node application*** when file changes in the directory are detected.
```bash
  npm run dev
```
