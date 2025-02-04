import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai'; 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { inputValue } = req.body; 
  if (!inputValue) {
    res.status(400).json({ error: 'Input value is required' });
    return;
  }

  try {
    const genPrompt = `Make an acrostic sentence for "${inputValue}".`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages: [
        { role: 'system', content: `I will give you a word. Write a sentence in which the first letter of each word sequentially spells out my word, like an acrostic sentence.
Your sentence should not contain my word. 
Your response should only contain the sentence you make.
Your sentence should have a semantic connection with my word.` },
        { role: 'user', content: genPrompt },
      ],
      store: false, 
    });

    res.status(200).json(response);  
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
