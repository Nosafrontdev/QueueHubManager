import {BrowserRouter, Routes, Route,Navigate} from "react-router-dom"
import Login from './pages/Login';
import Homepage from "./pages/Homepage";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged  (auth, async (currentUser) => {
      if (currentUser){
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDoc.exists()){
          setRole(userDoc.data().role);
        }
      
     setUser(currentUser);
    } else{
      setUser(null);
      setRole(null);
    }
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
      <Route path = "/Homepage" element = {<ProtectedRoute user = {user}> <Homepage role = {role} /> </ProtectedRoute>  } />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
