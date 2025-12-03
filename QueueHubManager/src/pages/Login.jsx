import { useState } from 'react';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";

import { db } from '../firebase';

import { setDoc, doc, getDoc } from 'firebase/firestore';


function Login () {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const[email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

    const handleMethodChange = () => {
        setIsSignUpActive(!isSignUpActive);
    };

    const handleSignup = async () => {
        if (!email || !password || !role) {
            alert('please fill all the field including selecting a role.');
            return;
        }
           try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth, email, password
                );
          const user = userCredential.user;

          await setDoc(doc(db, 'users', user.uid), {
            email, role, createdAt:new Date(),
          });

           alert('Account created successfully! You may proceed to log in.');
           setIsSignUpActive(false);
           } 
           catch (error){
            console.log(error.code, error.message)
            alert(error.message);
           }
        };
  /*  const handleEmailChange = (e) =>{
        setEmail(e.target.value)
    };

    const handlePasswordChange =(e) =>{
        setPassword(e.target.value)
    };*/

    const handleSignIn = async () => {
        if (!email || !password)
      
         return;

        try { const userCredentials = await signInWithEmailAndPassword(auth, email, password);
         const user = userCredentials.user;
         const userDoc = await getDoc(doc(db, 'users', user.uid));

         if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User Role:', userData.role);
         }
          else{
            console.log('No User Data Found in Firestore');
          }
        } catch (error) {
            console.log(error.code, error.message);
            alert(error.message);
        }

    };

   return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">QueueHub</h1>

        <form className="space-y-5">
          <fieldset>
            <legend className="text-xl font-semibold mb-4">
              {isSignUpActive ? "Sign Up" : "Sign In"}
            </legend>

            <ul className="space-y-4">
              <li className="flex flex-col">
                <label className="font-medium text-gray-700 mb-1" htmlFor="email">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </li>

              <li className="flex flex-col">
                <label
                  className="font-medium text-gray-700 mb-1"
                  htmlFor="password"
                >
                  Password:
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  required
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$"
                  title="Password must be at least 8 characters and include uppercase, lowercase, and a symbol"
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </li>

              
              {isSignUpActive && (
                <li className="flex flex-col">
                  <label className="font-medium text-gray-700 mb-1">
                    Select Role:
                  </label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Choose role</option>
                    <option value="cardGiver">Card Giver</option>
                    <option value="frontdesk1">Front Desk 1</option>
                    <option value="frontdesk2">Front Desk 2</option>
                    <option value="frontdesk3">Front Desk 3</option>
                    <option value="frontdesk4">Front Desk 4</option>
                    <option value="frontdesk5">Front Desk 5</option>
                    {/* <option value="Admin"> Admin </option> */}
            
                  </select>
                </li>
              )}
            </ul>

            <button
              type="button"
              onClick={isSignUpActive ? handleSignup : handleSignIn}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
            >
              {isSignUpActive ? "Sign Up" : "Sign In"}
            </button>
          </fieldset>

          <button
            type="button"
            onClick={handleMethodChange}
            className="w-full text-blue-600 hover:underline mt-3"
          >
            {isSignUpActive
              ? "Already have an account? Log in"
              : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;