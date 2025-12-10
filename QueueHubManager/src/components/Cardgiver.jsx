import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";

function Cardgiver() {
  const [nextNumber, setNextNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  // -----------------------------
  // Load last queue number
  // -----------------------------
  useEffect(() => {
    const fetchLastQueueNumber = async () => {
      const q = query(collection(db, "queue"), orderBy("number", "desc"));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const highest = snap.docs[0].data().number;
        setNextNumber(highest + 1);
      }
      setLoading(false);
    };

    fetchLastQueueNumber();
  }, []);

  // -----------------------------
  // Issue new patient number
  // -----------------------------
  const issueNumber = async () => {
    try {
      await addDoc(collection(db, "queue"), {
        number: nextNumber,
        createdAt: serverTimestamp(),
        served: false,
      });

      alert(`Patient number ${nextNumber} issued!`);
      setNextNumber(nextNumber + 1);
    } catch (error) {
      console.error(error);
      alert("Error issuing number");
    }
  };

  // -----------------------------
  // DAILY RESET FUNCTION
  // -----------------------------
  const resetQueue = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to RESET today’s queue? All numbers will be cleared and restart from 1."
    );

    if (!confirmReset) return;

    setResetLoading(true);

    try {
      const snap = await getDocs(collection(db, "queue"));
      const batch = writeBatch(db);

      snap.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();

      // Reset UI
      setNextNumber(1);

      alert("Queue has been reset for the day!");
    } catch (error) {
      console.error(error);
      alert("Error resetting queue.");
    }

    setResetLoading(false);
  };

  if (loading) return <div>Loading Queue...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Card Giver Panel</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-xl font-semibold">Next Number: {nextNumber}</h2>

        <button
          onClick={issueNumber}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Issue Number
        </button>

        {/* Daily Reset Button */}
        <button
          onClick={resetQueue}
          disabled={resetLoading}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
        >
          {resetLoading ? "Resetting..." : "Reset Queue for Today"}
        </button>
      </div>
    </div>
  );
}

export default Cardgiver;
