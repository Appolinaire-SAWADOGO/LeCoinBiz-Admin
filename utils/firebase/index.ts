import firebase from "@react-native-firebase/app";
import { getFunctions } from "@react-native-firebase/functions";

export const firebasyeFunctions = getFunctions(firebase.app(), "europe-southwest1");
