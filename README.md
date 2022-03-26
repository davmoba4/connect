# connect
A real-time chat application.

# Demo the App
- Follow the following link to try out the app: https://davmoba4-connect.netlify.app/
- The app works best on a Google Chrome browser

# How to Run Locally
### Backend
- Navigate to the **server** folder on the terminal and run the following command to install the dependencies:
``` 
npm install
```
- Create a .env file inside your **server** folder and store the following variables inside:  
 PORT = <port number for your server (e.g. 5000)>  
 CORS_URL = <your frontend's URL (e.g. http://localhost:3000)>  
 MONGO_URI = <the URI connecting to your MongoDB database>  
 JWT_SECRET = <the secret string used to create and verify your tokens (can be anything)>  
- Navigate to the **server** folder on the terminal and run the following command to start the backend:
```
npm start
```

### Frontend
- Navigate to the **client** folder on the terminal and run the following command to install the dependencies:
``` 
npm install
```
- Navigate to client/src/components/Chats/ChatBox.js. Then, on line 261, change the ENDPOINT variable to your server's URL.
- Navigate to client/package.json and change the "proxy" value to your server's URL.
- Navigate to the **client** folder on the terminal and run the following command to start the frontend:
```
npm start
```
