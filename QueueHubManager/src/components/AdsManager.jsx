import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CLOUD_NAME = "drtl0ono7";
const UPLOAD_PRESET = "queue_ads";

export default function AdsManager() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadAd = async () => {
    if (!file) return alert("Select a file");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("Upload failed");
      }

      await addDoc(collection(db, "ads"), {
        url: data.secure_url,
        type: data.resource_type, // image | video | raw (ppt)
        createdAt: serverTimestamp(),
        active: true,
      });

      alert("Ad uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Ads Manager</h1>

      <input
        type="file"
        accept="image/*,video/*,.ppt,.pptx"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        onClick={uploadAd}
        disabled={loading}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Uploading..." : "Upload Ad"}
      </button>
    </div>
  );
}
