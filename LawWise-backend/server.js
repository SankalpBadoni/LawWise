// File: backend/server.js
const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const cors = require('cors');
const Groq = require('groq-sdk');
const axios = require('axios');
require('dotenv').config(); // Make sure this is at the top

const app = express();
const PORT = process.env.PORT || 5000;

// --- Initialize Groq ---
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Sarvam AI Configuration ---
const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_BASE_URL = 'https://api.sarvam.ai/v1';

app.use(cors());
app.use(express.json()); // To parse JSON bodies

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define supported languages
const LANGUAGES = {
  "English": "en-IN",
  "Hindi": "hi-IN",
  "Gujarati": "gu-IN",
  "Bengali": "bn-IN",
  "Kannada": "kn-IN",
  "Punjabi": "pa-IN"
};

// The prompt for our AI assistant
const systemPrompt = `
You are LawWise, a helpful legal assistant chatbot. Your purpose is to help normal, non-law people understand legal documents in plain and simple language. You will be given the text extracted from a user's document. Your instructions are:
1. Read and interpret the document text.
2. Identify what type of document it is (e.g., rental agreement, employment contract, NDA).
3. Provide a brief, easy-to-understand summary of the document's main purpose.
4. Highlight 2-3 of the most important clauses, rights, or obligations for the user.
5. Ask the user what specific questions they have about the document.
6. Dont include multiple special characters or bold letters in your response, but a few are fine.
7. IMPORTANT: Always include this disclaimer at the very end of your response: "Disclaimer: I am an AI assistant and this is not legal advice. Please consult with a qualified legal professional for your specific situation."
`;

// --- Sarvam AI Translation Function ---
async function translateText(text, targetLanguageCode, sourceLanguageCode = "en-IN") {
  try {
    if (targetLanguageCode === "en-IN") {
      return text; // No translation needed for English
    }

    const response = await axios.post(`${SARVAM_BASE_URL}/translate`, {
      input: text,
      source_language_code: sourceLanguageCode,
      target_language_code: targetLanguageCode,
      speaker_gender: "Male"
    }, {
      headers: {
        'Authorization': `Bearer ${SARVAM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.translated_text || text;
  } catch (error) {
    console.error("Error translating text:", error.response?.data || error.message);
    return text; // Return original text if translation fails
  }
}

// --- Sarvam AI Chat Function ---
async function getSarvamChatResponse(messages) {
  try {
    const response = await axios.post(`${SARVAM_BASE_URL}/chat/completions`, {
      model: "sarvam-m",
      messages: messages
    }, {
      headers: {
        'Authorization': `Bearer ${SARVAM_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0]?.message?.content || "I was unable to process your request.";
  } catch (error) {
    console.error("Error with Sarvam chat:", error.response?.data || error.message);
    // Fallback to Groq if Sarvam fails
    console.log("Sarvam AI failed. Falling back to Groq for analysis.");
    return await getGroqAnalysis(messages);
  }
}

// --- Fallback Groq Analysis Function ---
async function getGroqAnalysis(messages) {
  try {
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama3-8b-8192",
    });
    return completion.choices[0]?.message?.content || "I was unable to analyze the document.";
  } catch (error) {
    console.error("Error contacting Groq API:", error);
    return "Sorry, I encountered an error while analyzing the document with the AI service.";
  }
}

// --- PDF Upload and Analysis Route ---
app.post('/api/upload', upload.single('pdfFile'), async (req, res) => {
  const { language = 'English', userQuestion = '' } = req.body;
  const targetLanguageCode = LANGUAGES[language] || LANGUAGES['English'];

  if (!req.file) {
    const errorMsg = await translateText('No PDF file uploaded.', targetLanguageCode);
    return res.status(400).json({ error: errorMsg });
  }

  try {
    // 1. Parse the PDF to get text
    const data = await pdf(req.file.buffer);
    const documentText = data.text;
    console.log(`PDF parsed successfully. Extracted ${documentText.length} characters.`);

    // 2. If user provided a question in their language, translate it to English first
    let englishUserQuestion = '';
    if (userQuestion.trim()) {
      console.log(`Translating user question from ${language} to English...`);
      englishUserQuestion = await translateText(userQuestion, "en-IN", targetLanguageCode);
    }

    // 3. Prepare messages for AI analysis (always in English)
    let userPrompt = `Here is the legal document I need help understanding. Please provide a summary based on your instructions, dont include bold letters or multiple special characters but few are fine. Document Text: """${documentText}"""`;
    
    if (englishUserQuestion) {
      userPrompt += `\n\nAdditional question from user: ${englishUserQuestion}`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    // 4. Get AI analysis in English (try Sarvam first, fallback to Groq)
    console.log("Sending text to AI for analysis...");
    const aiSummary = await getSarvamChatResponse(messages);

    // 5. Translate the AI response back to user's language
    console.log(`Translating AI response from English to ${language}...`);
    const translatedSummary = await translateText(aiSummary, targetLanguageCode, "en-IN");

    // 6. Send response back to frontend
    res.json({
      message: translatedSummary,
      pages: data.numpages,
      fileName: req.file.originalname,
      language: language,
      originalUserQuestion: userQuestion,
      translatedUserQuestion: englishUserQuestion
    });

  } catch (error) {
    console.error('Error processing file:', error);
    const errorMsg = await translateText('Failed to process the PDF file.', targetLanguageCode);
    res.status(500).json({ error: errorMsg });
  }
});

// --- Chat Route for Follow-up Questions ---
app.post('/api/chat', async (req, res) => {
  const { message, chatHistory = [], language = 'English' } = req.body;
  const targetLanguageCode = LANGUAGES[language] || LANGUAGES['English'];

  if (!message || !message.trim()) {
    const errorMsg = await translateText('No message provided.', targetLanguageCode);
    return res.status(400).json({ error: errorMsg });
  }

  try {
    // 1. Translate user message from their language to English
    console.log(`Translating user message from ${language} to English...`);
    const englishMessage = await translateText(message, "en-IN", targetLanguageCode);
    
    // 2. Prepare chat messages (all in English for AI processing)
    const englishChatHistory = [];
    for (const chat of chatHistory) {
      // We assume the history sent from the frontend is already in the user's language.
      // We need to translate both user and assistant messages to English for the AI context.
      const sourceLangForHistory = chat.language ? (LANGUAGES[chat.language] || LANGUAGES['English']) : targetLanguageCode;
      const translatedContent = await translateText(chat.content, "en-IN", sourceLangForHistory);
      englishChatHistory.push({ role: chat.role, content: translatedContent });
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...englishChatHistory,
      { role: "user", content: englishMessage }
    ];

    // 3. Get AI response in English
    console.log("Processing chat message with AI...");
    const aiResponse = await getSarvamChatResponse(messages);

    // 4. Translate AI response back to user's language
    console.log(`Translating AI response from English to ${language}...`);
    const translatedResponse = await translateText(aiResponse, targetLanguageCode, "en-IN");

    res.json({
      message: translatedResponse,
      language: language,
      originalUserMessage: message,
      translatedUserMessage: englishMessage,
      englishAIResponse: aiResponse
    });

  } catch (error) {
    console.error('Error processing chat:', error);
    const errorMsg = await translateText('Failed to process your message.', targetLanguageCode);
    res.status(500).json({ error: errorMsg });
  }
});

// --- New Route: Text-only Analysis (without PDF) ---
app.post('/api/analyze-text', async (req, res) => {
  const { userText, language = 'English' } = req.body;
  const targetLanguageCode = LANGUAGES[language] || LANGUAGES['English'];

  if (!userText || !userText.trim()) {
    const errorMsg = await translateText('No text provided for analysis.', targetLanguageCode);
    return res.status(400).json({ error: errorMsg });
  }

  try {
    // 1. Translate user text from their language to English
    console.log(`Translating user text from ${language} to English...`);
    const englishText = await translateText(userText, "en-IN", targetLanguageCode);

    // 2. Prepare messages for AI analysis (in English)
    const messages = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Here is the text/question I need help understanding: "${englishText}". Please provide analysis and guidance based on your instructions.`
      }
    ];

    // 3. Get AI analysis in English
    console.log("Sending text to AI for analysis...");
    const aiResponse = await getSarvamChatResponse(messages);

    // 4. Translate AI response back to user's language
    console.log(`Translating AI response from English to ${language}...`);
    const translatedResponse = await translateText(aiResponse, targetLanguageCode, "en-IN");

    // 5. Send response back to frontend
    res.json({
      message: translatedResponse,
      language: language,
      originalUserText: userText,
      translatedUserText: englishText,
      englishAIResponse: aiResponse
    });

  } catch (error) {
    console.error('Error processing text:', error);
    const errorMsg = await translateText('Failed to analyze the provided text.', targetLanguageCode);
    res.status(500).json({ error: errorMsg });
  }
});

// --- Translation Test Route ---
app.post('/api/translate', async (req, res) => {
  const { text, targetLanguage = 'English', sourceLanguage = 'English' } = req.body;
  const targetLangCode = LANGUAGES[targetLanguage] || LANGUAGES['English'];
  const sourceLangCode = LANGUAGES[sourceLanguage] || LANGUAGES['English'];

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'No text provided for translation.' });
  }

  try {
    const translatedText = await translateText(text, targetLangCode, sourceLangCode);
    
    res.json({
      originalText: text,
      translatedText: translatedText,
      sourceLanguage: sourceLanguage,
      targetLanguage: targetLanguage
    });

  } catch (error) {
    console.error('Error translating text:', error);
    res.status(500).json({ error: 'Failed to translate the text.' });
  }
});

// --- Language Support Route ---
app.get('/api/languages', (req, res) => {
  res.json({
    languages: Object.keys(LANGUAGES),
    languageCodes: LANGUAGES
  });
});

// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      groq: !!process.env.GROQ_API_KEY,
      sarvam: !!process.env.SARVAM_API_KEY
    },
    translationFlow: 'User Language → English → AI Processing → User Language'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Supported languages: ${Object.keys(LANGUAGES).join(', ')}`);
});