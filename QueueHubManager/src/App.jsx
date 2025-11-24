import {BrowserRouter, Routes, Route,Navigate} from "react-router-dom"
import Login from './pages/Login';
import Homepage from "./pages/Homepage";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged( auth,(currentUser) => {
     setUser(currentUser);
     setLoading(false);
    });
    return () => unsubscribe();
  } ,[]);
  
  if (loading){
    return <div> Loading, please wait .......</div>
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route  path ='/' element = { user ? <Navigate to = '/Homepage' /> : <Login /> } />
      <Route path = "/Homepage" element = {<ProtectedRoute user = {user}> <Homepage /> </ProtectedRoute>  } />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
