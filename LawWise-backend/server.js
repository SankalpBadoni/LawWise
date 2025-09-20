// File: backend/server.js

const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const Groq = require('groq-sdk');
const { v4: uuidv4 } = require('uuid'); // --- NEW: For generating unique session IDs ---
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- NEW: In-memory store to hold the text of uploaded documents for follow-up questions ---
// In a production app, you'd use a database like Redis for this.
const documentContextStore = {}; // Example: { "session-id-123": "The full text of the PDF..." }

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- AI Prompts ---

const initialAnalysisSystemPrompt = `
You are LawWise, a helpful legal assistant chatbot. Your purpose is to help non-lawyers understand legal documents.
You will be given the text extracted from a user's document.
Your instructions are:
1. Identify what type of document it is (e.g., rental agreement, employment contract, NDA).
2. Provide a brief, easy-to-understand summary of the document's main purpose.
3. Highlight 2-3 of the most important clauses, rights, or obligations for the user in a bulleted list.
4. Ask the user what specific questions they have about the document.
5. IMPORTANT: Always include this disclaimer at the very end: "Disclaimer: I am an AI assistant and this is not legal advice. Please consult with a qualified legal professional."
`;

const followUpSystemPrompt = `
You are LawWise, a helpful legal assistant. The user has already uploaded a document, and you have its full text. Now, the user is asking a follow-up question about it.
Your task is to answer the user's question based *only* on the provided document context.
Do not make up information. If the answer is not in the document, say so.
Keep your answers concise and easy to understand.
`;

async function getInitialAIAnalysis(documentText) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: initialAnalysisSystemPrompt },
      { 
        role: "user", 
        content: `Here is the legal document I need help understanding. Please provide a summary based on your instructions. Document Text: """${documentText}"""`
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
  return completion.choices[0]?.message?.content || "I was unable to analyze the document.";
}

// --- NEW: AI function for follow-up questions ---
async function getFollowUpAIResponse(documentText, question) {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: followUpSystemPrompt },
      {
        role: "user",
        content: `Here is the full document text for context: """${documentText}"""\n\nNow, please answer my specific question: "${question}"`
      }
    ],
    model: "llama-3.3-70b-versatile",
  });
  return completion.choices[0]?.message?.content || "Sorry, I couldn't find an answer to that question.";
}


// --- MODIFIED: /api/upload endpoint now creates a session ---
app.post('/api/upload', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded.' });
  }

  try {
    const data = await pdf(req.file.buffer);
    const documentText = data.text;
    
    // --- NEW: Create a session and store the document context ---
    const sessionId = uuidv4();
    documentContextStore[sessionId] = documentText;
    console.log(`Created session ${sessionId} and stored document text.`);

    // Purge old sessions after a while to prevent memory leaks (optional but good practice)
    setTimeout(() => {
        delete documentContextStore[sessionId];
        console.log(`Cleared session ${sessionId} from memory.`);
    }, 1000 * 60 * 30); // Clear after 30 minutes

    const aiSummary = await getInitialAIAnalysis(documentText);
    
    // --- NEW: Return the sessionId along with the message ---
    res.json({
      message: aiSummary, 
      sessionId: sessionId, // Send the new session ID to the client
    });

  } catch (error) {
    if (error.message && error.message.toLowerCase().includes('xref')) {
        return res.status(400).json({ error: 'The uploaded PDF appears to be corrupted. Please re-save it and try again.' });
    }
    console.error('Error processing file:', error);
    res.status(500).json({ error: 'Failed to process the PDF file.' });
  }
});


// --- NEW: /api/chat endpoint for follow-up questions ---
app.post('/api/chat', async (req, res) => {
    const { sessionId, question } = req.body;

    if (!sessionId || !question) {
        return res.status(400).json({ error: 'Session ID and question are required.' });
    }
    
    const documentText = documentContextStore[sessionId];

    if (!documentText) {
        return res.status(404).json({ error: 'Your document session has expired or is invalid. Please upload the document again.' });
    }

    try {
        const aiResponse = await getFollowUpAIResponse(documentText, question);
        res.json({ message: aiResponse });
    } catch (error) {
        console.error('Error getting follow-up response:', error);
        res.status(500).json({ error: 'Failed to get a response from the AI.' });
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});