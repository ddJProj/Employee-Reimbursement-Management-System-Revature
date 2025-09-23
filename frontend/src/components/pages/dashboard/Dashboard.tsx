import React from "react";
import Login from '../auth/Login';


function Dashboard() {
  /* TODO:
   * FIXME:
   * Add logic to check auth state. 
   * if logged in, redirect to dashboard view/page that corresponds to user's role 
   * else, send user to / load login screen
   *
   */
  // temporary dashboard before role specific implementations added
  return (
    <div>
      <h1> Base Dashboard Component </h1>
      <Login />
    </div>
  );

}

export default Dashboard;
