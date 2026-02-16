import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

export const db = firestore();
export const cloudFunctions = functions();
export const firebaseAuth = auth();
export const firebaseMessaging = messaging();

