import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
export default function Class() {
  let { classId } = useParams();
  return (
    <div className="container">
      <h2>Class {classId}</h2>
    </div>
  );
}
