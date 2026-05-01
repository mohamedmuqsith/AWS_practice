import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const testToken = async () => {
  const token = process.env.HUGGINGFACE_TOKEN;
  console.log('Testing Token:', token ? `${token.substring(0, 8)}...${token.substring(token.length - 4)}` : 'MISSING');
  
  const hf = new HfInference(token);
  try {
    const res = await hf.chatCompletion({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10
    });
    console.log('Success:', res.choices[0].message.content);
  } catch (err) {
    console.error('Test Failed:', err.message);
    if (err.httpResponse) {
      console.error('Status:', err.httpResponse.status);
      console.error('Body:', await err.httpResponse.json());
    }
  }
};

testToken();
