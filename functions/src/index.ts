import {
  onDocumentCreatedWithAuthContext,
  onDocumentDeletedWithAuthContext,
  onDocumentUpdatedWithAuthContext,
  onDocumentWritten,
} from "firebase-functions/v2/firestore";
import { log, error } from "firebase-functions/logger";
// import { Speech } from "./speech";

export const test = onDocumentWritten("{collection}/{id}", (event) => {
  if (!event.data) return log("onDocumentWritten", "Немає тіла документу event.data");
  const { before, after } = event.data;
  const action = !before.exists ? "create" : !after.exists ? "delete" : "update";
  const data: any = action === "delete" ? before.data() : after.data();
  switch (action) {
    case "create":
      return log("CREATED", data.name);
    case "create":
      return log("CREATED", data.name);
    case "delete":
      return log("DELETED", data.name);
  }
});

export const onCourseCreated = onDocumentCreatedWithAuthContext("courses/{docId}", (event) => {
  try {
    log("onCourseCreated", event.id);
    // if (!event.data) return log(`Немає тіла документа для генерації аудіофайлу`);
    // const data = event.data.data();
    // const url = await Speech.toAudio(data.name, `audio/courses/names/${data.id}.wav`);
    // log("URL", url);
  } catch (err) {
    error("Помилка озвучування тексту", err);
  }
});

export const onCourseUpdated = onDocumentUpdatedWithAuthContext("courses/{docId}", (event) => {
  try {
    log("onCourseUpdated", event.id);
    // if (!event?.data) return log(`Немає тіла документа для генерації аудіофайлу`);
    // const before = event.data.before.data();
    // const after = event.data.after.data();
    // if (before.name == after.name) return log(`Текст не змінився після оновлення документу`);
    // const url = await Speech.toAudio(after.name, `audio/courses/names/${after.id}.wav`);
    // log("URL", url);
  } catch (err) {
    error("Помилка озвучування тексту", err);
  }
});

export const onCourseDeleted = onDocumentDeletedWithAuthContext("courses/{docId}", (event) => {
  try {
    log("onCourseDeleted", event.id);
    // if (!event?.data) return log(`Немає тіла документа для видалення озвучування`);
    // await Speech.delete(`audio/courses/names/${event.data.id}.wav`);
  } catch (err) {
    error("Помилка видалення озвучування", err);
  }
});

// /(.*?[\.\?\!\;]{1} *)/.test("");

// ("courses/{docId}", (event) => {

// });
