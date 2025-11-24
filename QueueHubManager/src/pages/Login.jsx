import { useState } from 'react';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../firebase";


function Login () {
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const[email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleMethodChange = () => {
        setIsSignUpActive(!isSignUpActive);
    };

    const handleSignup = () => {
        if (!email || !password) return;
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage= error.message;
            console.log(errorCode, errorMessage);
        }

        );
    };

    const handleEmailChange = (e) =>{
        setEmail(e.target.value)
    };

    const handlePasswordChange =(e) =>{
        setPassword(e.target.value)
    };

    const handleSignIn =() => {
        if (!email || !password) return;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            const user = userCredentials.user; 
            console.log (user)
        })
         .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);

         }

         );

    };

    return ( 
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
         <h1 className= 'text-3xl font-bold text-center mb-6'>
            QueueHub
         </h1>
        
          <form className='space-y-5'>
            <fieldset>
               <legend className="text-xl font-semibold mb-4">
              {isSignUpActive ? "Sign Up" : "Sign In"}
            </legend>

            <ul className="space-y-4">
                <li className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1" htmlFor = 'email'>Email: </label>
                    <input type = "text" id = 'email' value={email} required onChange={handleEmailChange} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                </li>

                <li className="flex flex-col">
                    <label className="font-medium text-gray-700 mb-1" htmlFor = 'password'> Password: </label>
                    <input type ="password" id = 'password' value ={password} required  onChange= {handlePasswordChange} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
                </li>
            </ul>
             <button type='button'  onClick ={ isSignUpActive ? handleSignup : handleSignIn} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition" > {isSignUpActive ? "Sign Up" : "Sign In"}</button> 
             
        </fieldset>
    
       <button type ='button' onClick = {handleMethodChange} className="w-full text-blue-600 hover:underline mt-3"> {isSignUpActive ? "Already have an account? Log in" : "Don't have an account? Sign up"}
       </button>

       </form>
       </div>
       </div>


     );
}

export default Login;