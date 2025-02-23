import { useEffect, useRef, useState } from "react";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";

function App() {
  const [chatHistory, setChatHistory] = useState([]);

  const chatBodyRef = useRef();

  const updateHistory = (text)=>{
    setChatHistory((prev)=> [...prev.filter(msg=> msg.text !== "Thinking...."), {role: "model", text}])
  }

  const generateBotResponse = async(history)=>{
    console.log(history);
    history = history.map(({role, text})=> ({role, parts: [{text}]}));
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    }

    try{
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);

      const data = await response.json();

      if(!response.ok) throw new Error(data.error.message || "something went wrong");

      const apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();

      updateHistory(apiResponse);
      console.log(apiResponse)
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
  },[chatHistory]);

  return (
    <>
      <div className="container">
        <div className="chatbot-popup">

          {/* ChatBot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">ChatBot</h2>
            </div>
            <button className="material-symbols-rounded">keyboard_arrow_down</button>
          </div>

          {/* ChatBot body */}
          <div ref={chatBodyRef} className="chat-body">
            <div className="message bot-message">
              <ChatbotIcon />
              <p className="message-text">
                Hey There! <br /> how can i help you
              </p>
            </div>


            {
              chatHistory.map((chat, index)=>(
                <ChatMessage key={index} chat={chat}/>
              ))
            }
          </div>


          {/* ChatBot footer */}
          <div className="chat-footer">
            <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse}/>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
