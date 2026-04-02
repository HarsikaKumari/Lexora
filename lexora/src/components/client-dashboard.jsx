function Dashboard() {
  return (
    <div className="client-dashboard">
      <h1>
        Client Dashboard <span className="alert">!</span>
      </h1>
      <div className="dashboard-content">
        <div className="cases">
          <h2>Active cases</h2>
          <ul>
            <li>
              <progress value="50" max="100" />
              Case 1
            </li>
            <li>
              <progress value="75" max="100" />
              Case 2
            </li>
            <li>
              <progress value="25" max="100" />
              Case 3
            </li>
          </ul>
        </div>
        <div className="documents">
          <h2>Documents needing signatures</h2>
          <ul>
            <li>Document 1</li>
            <li>Document 2</li>
            <li>Document 3</li>
          </ul>
        </div>
        <div className="upcoming-sessions">
          <h2>Upcoming sessions</h2>
          <ul>
            <li>
              <div className="session-card">
                <p>Session 1</p>
                <div className="actions">
                  <button>Join video</button>
                  <button>Reschedule</button>
                </div>
              </div>
            </li>
            <li>
              <div className="session-card">
                <p>Session 2</p>
                <div className="actions">
                  <button>Join video</button>
                  <button>Reschedule</button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>);
}

export default Dashboard;