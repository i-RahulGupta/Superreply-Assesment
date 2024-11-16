import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.size > 5 * 1024 * 1024) {
      toast.error("Oops, this file is too big! Please try again.");
    } else {
      setFile(uploadedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file || !text) {
      toast.error("Please upload a valid file and enter text.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);

    try {
      const response = await axios.post("http://localhost:5000/process", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = response.data.url;
      const link = document.createElement("a");
      link.href = url;
      link.download = "output_audio.mp3";
      link.click();
      toast.success("Audio processed successfully!");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>SuperReply Voice Processor</h1>
      <input type="file" accept=".wav,.mp3" onChange={handleFileUpload} />
      <textarea
        placeholder="Enter text here (max 500 characters)"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={500}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Generate Voice"}
      </button>
      <ToastContainer />
    </div>
  );
}

export default App;
