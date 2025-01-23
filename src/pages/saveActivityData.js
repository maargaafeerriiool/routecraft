import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const saveActivityData = async (activityId, data) => {
  try {
    const activityRef = doc(db, "activities", activityId); // Referència al document
    await setDoc(activityRef, data, { merge: true }); // Guarda o actualitza les dades
    console.log("Dades desades correctament!");
  } catch (error) {
    console.error("Error desant les dades:", error);
  }
};