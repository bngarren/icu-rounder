import { useState } from "react";
import { useAuthStateContext } from "../../context/AuthState";

const LoginPage = () => {
  const { authState, userIsLoggedIn, signInWithEmailAndPassword, signOut } =
    useAuthStateContext();
  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = () => {
    if (inputEmail && inputPassword) {
      setError(null);
      signInWithEmailAndPassword(
        inputEmail,
        inputPassword,
        (user) => {
          // success
        },
        (error) => {
          console.log(error);
          setError(error.message);
        }
      );
    }
  };

  const handleSignOut = () => {
    setInputEmail("");
    setInputPassword("");
    signOut();
  };

  return (
    <div>
      {!userIsLoggedIn ? (
        <div>
          {error && error}
          <label>
            Email
            <input
              type="text"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
            />
          </label>
          <label>
            Password
            <input
              type="text"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
            />
          </label>
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <button onClick={handleSignOut}>
          Log out {authState?.user?.displayName}
        </button>
      )}
    </div>
  );
};

export default LoginPage;
