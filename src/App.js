import { useState } from "react";

const App = () => {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOption = [
    "Who won the latest Novel Peace Prize?",
    "Where does pizza come from?",
    "Who do you make a BLT sandwich?",
    "What is the today date?",
  ];

  const surprise = () => {
    setValue(surpriseOption[Math.floor(Math.random() * surpriseOption.length)]);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error:- Please ask a question!");
      return;
    }

    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: value,
        },
        {
          role: "model",
          parts: data,
        },
      ]);
      setValue("");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const getClear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };
  return (
    <div className="app">
      <p>
        What do you want to know?
        <button className="surprise" onClick={surprise} disabled={!chatHistory}>
          Surprise me!
        </button>
      </p>
      <div className="input-container">
        <input
          value={value}
          placeholder="Ask me something..."
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask Me!</button>}
        {error && <button onClick={getClear}>Clear</button>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory?.map((chatItem, index) => (
          <div key={index}>
            <p className="answer">
              {chatItem.role} : {chatItem.parts}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
