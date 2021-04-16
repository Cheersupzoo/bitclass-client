import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
export default function Class() {
  let { classId } = useParams();
  const [loading, setLoading] = useState(true);
  const [classroom, setClassroom] = useState({});
  const [tab, setTab] = useState(0); // 0 = Feed; 1 = File; 2 = Detail
  useEffect(() => {
    init();
    return () => {};
  }, []);
  async function init() {
    console.log(classId);
    var classesInfo = await API.getClassDetail(classId);
    console.log(classesInfo);
    setClassroom(classesInfo);
    setLoading(false);
  }
  return (
    <div className="container pt-2">
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          <h2>Class {classroom.name}</h2>
          <h6>{classroom.code}</h6>
          <ButtonGroup aria-label="Basic example">
            <Button
              variant={tab === 0 ? "secondary" : "primary"}
              onClick={() => setTab(0)}
            >
              Feed
            </Button>
            <Button
              variant={tab === 1 ? "secondary" : "primary"}
              onClick={() => setTab(1)}
            >
              File
            </Button>
            <Button
              variant={tab === 2 ? "secondary" : "primary"}
              onClick={() => setTab(2)}
            >
              Detail
            </Button>
          </ButtonGroup>
        </>
      )}
      {buildTab(tab, classroom)}
    </div>
  );
}

function Feed() {
  return <div>Feed</div>;
}

function File() {
  return <div>File</div>;
}

function Detail({ classroom }) {
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState({});
  const [students, setStudents] = useState([]);
  useEffect(() => {
    init();
    return () => {};
  }, []);
  async function init() {
    var ownerInfo = await API.getUserDetail(classroom.owner);
    setOwner(ownerInfo);
    var studentInfos = [];
    await Promise.all(
      classroom.student.map(async (sid) => {
        var studentInfo = await API.getUserDetail(sid);
        studentInfos.push(studentInfo);
      })
    );
    setStudents(studentInfos)
    setLoading(false);
  }
  return (
    <div>
      {loading ? (
        <div>loading</div>
      ) : (
        <>
          <div>Owner</div>
          <div>{owner.name}</div>
          <div>Student</div>
          {students.map((student) => {
            return <div key={student.id}>{student.name}</div>;
          })}
        </>
      )}
    </div>
  );
}

function buildTab(tab, classroom) {
  switch (tab) {
    case 0:
      return <Feed />;
    case 1:
      return <File />;
    case 2:
      return <Detail classroom={classroom} />;
    default:
      return <Feed />;
  }
}
