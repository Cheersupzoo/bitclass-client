import { useAppContext, useDispatchContext } from "../state/auth";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
export default function Home() {
  const { accessToken } = useAppContext();

  return (
    <>
      {accessToken === undefined || accessToken === null ? (
        <WoLogin />
      ) : (
        <WLogin />
      )}
    </>
  );
}

function WoLogin() {
  return (
    <section class="jumbotron text-center bg-white">
      <div class="container">
        <h1 class="jumbotron-heading">Welcome to BitClass™</h1>
        <p class="lead text-muted">
          Something short and leading about the collection below—its contents,
          the creator, etc. Make it short and sweet, but not too short so folks
          don't simply skip over it entirely.
        </p>
      </div>
    </section>
  );
}

function WLogin() {
  return (
    <div className="container pt-4">
      <div className="row">
        <h2>Your Class</h2>
      </div>
      <div className="row">
        {["Class 1", "Class 2", "Class 3", "Class 4"].map((e) => (
          <div class="col-md-4">
            <Link to={`/class/${e}`}>
              <div class="card mb-4 box-shadow">
                <img
                  class="card-img-top"
                  data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail"
                  alt="Thumbnail [100%x225]"
                  style={{ height: "225px", width: "100%", display: "block" }}
                  src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22348%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20348%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_178d62ad0ec%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A17pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_178d62ad0ec%22%3E%3Crect%20width%3D%22348%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22116.71875%22%20y%3D%22120.3%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                  data-holder-rendered="true"
                />
                <div class="card-body">
                  <p class="card-text">{e}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}