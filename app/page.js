'use client';

import Image from "next/image";
import { useState } from 'react';
import OpenAI from 'openai';

export default function Home() {
  const [steve, setSteve] = useState("This is Steve Jobs.")
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  async function handlePromptEnter(e) {
    if (e.key === "Enter" && !isLoading) {
      getRespond();
    }
  }

  async function getRespond() {
    // If already loading, don't process another request
    if (isLoading) return;

    console.log('Running getRespond');
    setIsLoading(true);
    let steveStream = "(thinking)";
    setSteve(steveStream);

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "Act as Steve Jobs, Apple Computer co-founder. You are speaking with his tone. You are speaking with confidence and chrismatic as you are Steve Jobs. Also add humor to your answer."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        stream: true
      });

      let fullResponse = '';
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        fullResponse += content;
        setSteve(fullResponse);
      }

      // Reset the input box after completion
      setPrompt("");
    } catch (error) {
      console.error('Error:', error);
      setSteve("Sorry, there was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='w-full h-screen bg-black'>
      <div className="w-[2560px] h-[1440px] bg-cover bg-no-repeat mx-auto" style={{ backgroundImage: `url('images/mac_bg.jpg')` }}>
        <div className="pt-[382px]">
          <div className="block overflow-auto w-[560px] h-[330px] mx-auto p-4 text-black rounded-2xl">
            <div className='flex'>
              <div className='flex-none w-10 h-10 mr-2 rounded-full bg-cover' style={{ backgroundImage: `url('images/jobs_icon.jpg')` }}></div>
              <div className='bg-gray-300 p-3 rounded-xl'>{steve}</div>
            </div>
          </div>
        </div>

        <div className='flex items-center mt-36 w-[600px] rounded-full mx-auto bg-black bg-opacity-50'>
          <input
            type="text"
            id="message"
            className="text-xl block w-full px-6 py-4 bg-transparent placeholder-gray-400 focus:outline-none"
            placeholder={isLoading ? "Please wait..." : "Ask Steve"}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => handlePromptEnter(e)}
            value={prompt}
            disabled={isLoading}
          />

          <SteveButton getRespond={getRespond} disabled={isLoading} />

        </div>
        <Footer />
      </div>
    </div>
  );
}

const SteveButton = (props) => {
  return (
    <button
      onClick={props.getRespond}
      disabled={props.disabled}
      className={props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    >
      <div className='w-10 h-10 mr-2 rounded-full bg-cover' style={{ backgroundImage: `url('images/jobs_icon.jpg')` }}></div>
    </button>
  )
}

const Footer = () => {
  return (
    <div className='w-[600px] mx-auto pt-[44px]'>
      <div className='text-right text-gray-400 text-sm'>
      Copyright© 2024, Piyorod
      </div>
    </div>
  )
}