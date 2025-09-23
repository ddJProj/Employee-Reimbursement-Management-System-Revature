import React from "react";


function Login() {

	return (
	// FIXME: use actual endpoints/route to login api
	<form action="http://localhost:8080/api/login">
		<p>Email:
		<input type="text" name="email" size="15"
		maxLength="30" />
		</p>
		<p>Password:
		<input type="password" name="password" size="15" maxLength="30" />
		</p>
	</form>
	);
}


export default Login;
