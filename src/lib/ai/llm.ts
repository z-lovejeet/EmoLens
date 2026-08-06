import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';

// Dynamic LLM Instantiators — ensures API keys are read from environment at runtime

export function getPrimaryLLM() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  return new ChatGoogleGenerativeAI({
    model: 'gemini-3.6-flash',
    temperature: 0.7,
    maxOutputTokens: 1024,
    apiKey,
  });
}

export function getFastLLM() {
  return new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    maxTokens: 1024,
    apiKey: process.env.GROQ_API_KEY,
  });
}

export function getCopingPrimaryLLM() {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
  return new ChatGoogleGenerativeAI({
    model: 'gemini-3.6-flash',
    temperature: 0.6,
    maxOutputTokens: 1024,
    apiKey,
  });
}

export function getCardLLM() {
  return new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    maxTokens: 512,
    apiKey: process.env.GROQ_API_KEY,
  });
}

// Proxies for direct invocation compatibility
export const primaryLLM = {
  invoke: (messages: unknown) => getPrimaryLLM().invoke(messages as any),
};

export const fastLLM = {
  invoke: (messages: unknown) => getFastLLM().invoke(messages as any),
};

export const copingPrimaryLLM = {
  invoke: (messages: unknown) => getCopingPrimaryLLM().invoke(messages as any),
};

export const cardLLM = {
  invoke: (messages: unknown) => getCardLLM().invoke(messages as any),
};
