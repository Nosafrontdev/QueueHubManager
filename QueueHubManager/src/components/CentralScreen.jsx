import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function CentralScreen() {
  const [queue, setQueue] = useState([]);
  const [lastId, setLastId] = useState("");

  // -----------------------------------
  // Firestore listener
  // -----------------------------------
  useEffect(() => {
    const q = query(collection(db, "queue"), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueue(list);
      },
      (error) => console.error("CentralScreen Firestore error:", error)
    );

    return () => unsubscribe();
  }, []);

  const activePatients = queue.filter(
    (p) => p.served === true && p.servedBy
  );

  const waitingPatients = queue.filter((p) => p.served === false);

  // -----------------------------------
  // Announcement speaker
  // -----------------------------------
  const announce = (number, desk) => {
    const msg = `Patient number ${number}. Please proceed to front desk ${desk}.`;
    const speech = new SpeechSynthesisUtterance(msg);
    window.speechSynthesis.speak(speech);
  };

  // Trigger announcement when new patient is served
  useEffect(() => {
    if (activePatients.length === 0) return;

    const latest = activePatients[activePatients.length - 1];

    if (latest.id !== lastId) {
      setLastId(latest.id);
      announce(latest.number, latest.servedBy.replace("frontdesk", ""));
    }
  }, [activePatients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-8 text-white select-none">

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-center mb-10 tracking-wider drop-shadow-lg animate-pulse">
        QUEUE HUB DISPLAY
      </h1>

      {/* ------------------------- */}
      {/* ACTIVE PATIENTS SECTION  */}
      {/* ------------------------- */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-yellow-300 tracking-wide">
          Currently Being Served
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((desk) => {
            const role = `frontdesk${desk}`;

            const deskPatients = activePatients
              .filter((p) => p.servedBy === role)
              .sort((a, b) => b?.servedAt?.seconds - a?.servedAt?.seconds);

            const patient = deskPatients[0];

            return (
              <div
                key={desk}
                className={`
                  p-6 rounded-2xl shadow-xl 
                  bg-white/10 backdrop-blur-xl 
                  border border-white/20 
                  transform hover:scale-105 transition-all 
                  ${patient ? "animate-[flash_1s_ease-in-out]" : ""}
                `}
              >
                <h3 className="text-xl font-bold text-blue-300">
                  FRONT DESK {desk}
                </h3>

                <p className="text-6xl font-extrabold text-center mt-4 mb-2 text-green-300 drop-shadow-xl">
                  {patient ? patient.number : "---"}
                </p>

                <p className="text-center text-gray-300 text-lg">
                  {patient?.servedAt?.seconds
                    ? new Date(patient.servedAt.seconds * 1000).toLocaleTimeString()
                    : "---"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ------------------------- */}
      {/* WAITING PATIENTS SECTION */}
      {/* ------------------------- */}
      <h2 className="text-3xl font-bold mb-4 text-blue-300 tracking-wide">
        Waiting Patients
      </h2>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg">
        {waitingPatients.length === 0 ? (
          <p className="text-center text-yellow-200 text-xl py-6">
            No patients waiting
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-lg text-gray-300 border-b border-white/20">
                <th className="py-3">Patient Number</th>
                <th>Time Created</th>
              </tr>
            </thead>

            <tbody>
              {waitingPatients.map((p) => (
                <tr
                  key={p.id}
                  className="text-xl border-b border-white/10 hover:bg-white/10 transition"
                >
                  <td className="py-3 font-bold text-yellow-300">{p.number}</td>
                  <td className="text-gray-300">
                    {p.createdAt?.seconds
                      ? new Date(p.createdAt.seconds * 1000).toLocaleTimeString()
                      : "---"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Keyframe for flash animation */}
      <style>{`
        @keyframes flash {
          0% { background-color: rgba(34,197,94,0.4); }
          50% { background-color: rgba(34,197,94,0.8); }
          100% { background-color: rgba(34,197,94,0.4); }
        }
      `}</style>
    </div>
  );
}
