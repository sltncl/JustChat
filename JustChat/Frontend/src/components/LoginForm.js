import React from "react";
import "../App.css"
import { Link } from "react-router-dom";

const LoginForm = ({
   username,
   password,
   handleUsernameChange,
   handlePasswordChange,
   handleSubmit,
   error,
}) => {
   return (
      <div className="container">
         <h2>Login</h2>
         {error && <p className="error-message">{error}</p>}
         <form onSubmit={handleSubmit}>
            <div className="form-group">
               <label>Username:</label>
               <input type="text" value={username} onChange={handleUsernameChange} />
            </div>
            <div className="form-group">
               <label>Password:</label>
               <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
               />
            </div>
            <div className="button-container">
               <button type="submit">Login</button>
            </div>
         </form>

         <p className="signup-link">
            Non sei ancora registrato?
         </p>
         <Link className="link-button" to="/signup">Registrati</Link>
      </div>
   );
};

export default LoginForm;
