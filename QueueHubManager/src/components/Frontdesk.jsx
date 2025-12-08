import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

function Frontdesk() {
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNext = async () => {
    setLoading(true);

    try {
      const q = query(
        collection(db, "queue"),
        where("served", "==", false),
        orderBy("number", "asc"),
        limit(1)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        alert("No patient waiting.");
        setCurrentPatient(null);
        setLoading(false);
        return;
      }

      const docData = snap.docs[0];
      const patient = { id: docData.id, ...docData.data() };

      // Mark as served
      await updateDoc(doc(db, "queue", patient.id), {
        served: true,
        servedAt: serverTimestamp(),
      });

      setCurrentPatient(patient);

      // Optional sound:
      playVoice(patient.number);

    } catch (error) {
      console.error(error);
      alert("Error fetching next patient.");
    }

    setLoading(false);
  };

  // Simple text-to-speech function
  const playVoice = (number) => {
    const msg = new SpeechSynthesisUtterance(
      `Patient number ${number}, please proceed to the front desk.`
    );
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Front Desk Panel</h1>

      <div className="bg-white p-6 w-80 rounded-xl shadow-md">
        <button
          onClick={fetchNext}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
        >
          {loading ? "Loading..." : "Next Patient"}
        </button>

        {currentPatient && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
            <p className="text-xl font-bold">
              Now Serving: {currentPatient.number}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Frontdesk;
