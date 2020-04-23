import firebase from 'firebase'

require('dotenv').config()

const config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
}

firebase.initializeApp(config)

export const auth = firebase.auth
export const db = firebase.database()