# KBP

To test out the project:
 1. Make sure MongoDB is running on mongodb://localhost:27017

 2. Start the server
  ```
  cd server
  node server.js
  ```
 3. Start the client
 ```
  cd client
  npm run start
  ```
 4. Open http://localhost:3000

  Use the reset / increment buttons to set a number, then click on "Submit". Refresh the browser and verify that the number is still the same. The value is stored in MongoDB (kbp - counter).
