const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();
const uploadRouter = require('./routes/upload');
const {
  fileContextPromptWithContext,
  fileContextPromptWithoutContext
} = require('./prompt');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function isVagueQuestion(question) {
  if (!question) return true;
  const q = question.trim().toLowerCase();
  if (q.length < 10) return true;
  
  // Vague pronouns or phrases
  const vaguePhrases = [
    "this", "that", "these", "those",
    "explain", "explain this",
    "what about this", "please",
    "solve", "summarize", "summary",
    "help", "details", "info",
    "?" // just a question mark alone is vague
  ];
  return vaguePhrases.some(phrase => q === phrase || q.startsWith(phrase));
}

app.post('/ask', async (req, res) => {
  const { question = "", history = [], context = "" } = req.body;

  let finalQuestion = question;

  if (context && isVagueQuestion(question)) {
    // Rewrite question dynamically to include context
    finalQuestion = `Using the following document content, please answer the query:\n---\n${context}\n---`;
  }

 const fileContextPrompt = context
  ? fileContextPromptWithContext
  : fileContextPromptWithoutContext;
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: fileContextPrompt },
        ...history,
        { role: 'user', content: finalQuestion }
      ],
      model: 'llama3-8b-8192',
    });

    res.json({ answer: chatCompletion.choices[0].message.content });
  } catch (error) {
    console.error('Groq API error:', error);
    res.status(500).json({ error: 'Something went wrong with Groq API' });
  }
});



app.use('/api', uploadRouter);

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
