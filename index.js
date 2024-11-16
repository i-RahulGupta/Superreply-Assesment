const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase setup
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Multer setup for file uploads
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

app.post("/process", upload.single("file"), async (req, res) => {
  const { file } = req;
  const { text } = req.body;

  if (!file || !text) {
    return res.status(400).json({ error: "Invalid file or text" });
  }

  try {
    // Upload file to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("voice-files")
      .upload(`input/${file.originalname}`, file.buffer, { contentType: file.mimetype });

    if (uploadError) throw uploadError;

    // Generate new audio using a Text-to-Speech API (replace this with actual API call)
    const generatedAudioURL = `https://dummy.audio/${text}.mp3`;

    // Return download URL
    return res.status(200).json({ url: generatedAudioURL });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
