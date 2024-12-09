import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
  QuerySnapshot,
  DocumentData,
  Query,
  query,
  where,
  orderBy,
  QueryConstraint,
  onSnapshot,
} from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useFirebase, User } from "./firebase";

type Course = {
  id: string;
  user_id: string;
  name: string;
  group: string;
  audio: string;
};

type Topic = {
  id: string;
  user_id: string;
  course_id: string;
  position: number;
  name: string;
  text: string;
  audio_name?: string;
  audio_text?: string;
  audio_progress?: number;
  exercises?: string[];
};

type Exercise = {
  id: string;
  user_id: string;
  course_id: string;
  topic_id: string;
  position: number;
  text: string;
  audio: string;
  all_answers?: number;
  new_answers?: number;
};

type FirestoreContextType = {
  courses: Course[] | null;
  saveCourse: (data: Course) => Promise<any>;
  deleteCourse: (data: Course) => Promise<any>;

  topics: Topic[] | null;
  saveTopic: (data: Topic) => Promise<any>;
  deleteTopic: (data: Topic) => Promise<any>;

  exercises: Exercise[] | null;
  saveExercise: (data: Exercise) => Promise<any>;
  deleteExercise: (data: Exercise) => Promise<any>;
};

export const FirestoreContext = createContext<FirestoreContextType>({} as any);

function prepare(data: { [key: string]: any }, profile?: User | null) {
  const result: any = { ...data, user_id: profile?.uid };
  for (let key of Object.keys(result)) {
    if (result[key] === undefined) delete result[key];
  }
  return result;
}

export function FirestoreProvider({ children }: any) {
  const { app, profile } = useFirebase();

  const firestore = useMemo(() => getFirestore(app, "audioclass"), []);

  const [courses, setCourses] = useState<Course[] | null>(null);
  const [topics, setTopics] = useState<Topic[] | null>(null);
  const [exercises, setExercises] = useState<Exercise[] | null>(null);

  const coursesCol = useCallback(() => collection(firestore, `courses`), [firestore]);
  const coursesDoc = useCallback((id: string) => doc(firestore, `courses`, id), [firestore]);

  const topicsCol = useCallback(() => collection(firestore, `topics`), [firestore]);
  const topicsDoc = useCallback((id: string) => doc(firestore, `topics`, id), [firestore]);

  const exercisesCol = useCallback(() => collection(firestore, `exercise`), [firestore]);
  const exercisesDoc = useCallback((id: string) => doc(firestore, `exercise`, id), [firestore]);

  useEffect(() => {
    const unsubscribeFromCoures = !profile
      ? () => {}
      : onSnapshot(query(coursesCol(), where("user_id", "==", profile?.uid)), ({ docs }) => setCourses(docs.map((doc) => doc.data()) as any));

    const unsubscribeFromTopics = !profile
      ? () => {}
      : onSnapshot(query(topicsCol(), where("user_id", "==", profile?.uid)), ({ docs }) => setTopics(docs.map((doc) => doc.data()) as any));

    const unsubscribeFromExercises = !profile
      ? () => {}
      : onSnapshot(query(exercisesCol(), where("user_id", "==", profile?.uid)), ({ docs }) => setExercises(docs.map((doc) => doc.data()) as any));

    return () => {
      unsubscribeFromCoures();
      unsubscribeFromTopics();
      unsubscribeFromExercises();
    };
  }, [profile]);

  const saveCourse = useCallback((data: Course) => setDoc(coursesDoc(data.id), prepare(data, profile), { merge: true }), [firestore, profile]);
  const deleteCourse = useCallback((data: Course) => deleteDoc(coursesDoc(data.id)), [firestore]);

  const saveTopic = useCallback((data: Topic) => setDoc(topicsDoc(data.id), prepare(data, profile), { merge: true }), [firestore, profile]);
  const deleteTopic = useCallback((data: Topic) => deleteDoc(topicsDoc(data.id)), [firestore]);

  const saveExercise = useCallback((data: Exercise) => setDoc(exercisesDoc(data.id), prepare(data, profile), { merge: true }), [firestore, profile]);
  const deleteExercise = useCallback((data: Exercise) => deleteDoc(exercisesDoc(data.id)), [firestore]);

  const value = {
    courses,
    saveCourse,
    deleteCourse,

    topics,
    saveTopic,
    deleteTopic,

    exercises,
    saveExercise,
    deleteExercise,
  };

  return <FirestoreContext.Provider value={value} children={children} />;
}

export function useFirestore(): FirestoreContextType {
  return useContext(FirestoreContext);
}
