const firebaseAdmin = require("firebase-admin");
const serviceAccount = {
  
};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

export default firebaseAdmin;
