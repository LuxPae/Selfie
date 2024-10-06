// TODO decisamente da togliere
// https://medium.com/@aaqil.ruzzan/how-to-implement-jwt-authentication-with-the-mern-stack-4948d4423c64

import React from "react"

export const AuthContext = React.createContext({
  user: {},
  dispatchUser: ({ type, payload }) => {} 
});

export default AuthContext;
