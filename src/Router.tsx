import { Navigate, Route, Routes } from "react-router-dom";
import { ReactElement } from "react";
import Layout from "./pages/Layout";
import { Loading, Courses, Course, Settings, Signin, Signup, Forgot, Topic, Answers, Exercises } from "./pages";
import { useFirebase } from "./libs/firebase";

export default function Router(): ReactElement {
  const { profile } = useFirebase();

  console.log("profile", profile);

  switch (profile) {
    case undefined:
      return (
        <Routes>
          <Route path="*" element={<Loading />} />
        </Routes>
      );
    case null:
      return (
        <Routes>
          <Route path="/">
            <Route path="" element={<Navigate to="/signin" />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="forgot" element={<Forgot />} />
            <Route path="*" element={<Navigate to="/signin" />} />
          </Route>
        </Routes>
      );
    default:
      return (
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Navigate to="/courses" />} />

            <Route path="courses">
              <Route path="" element={<Courses />} />
              <Route path=":id" element={<Course />} />
            </Route>
            <Route path="topics">
              <Route path="" element={<Course />} />
              <Route path=":id" element={<Topic />} />
            </Route>
            <Route path="exercises" element={<Exercises />} />
            <Route path="answers" element={<Answers />} />

            <Route path="settings" element={<Settings />} />

            <Route path="*" element={<Navigate to="/courses" />} />
          </Route>
        </Routes>
      );
  }
}
