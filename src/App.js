import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure your App.css has relevant styles

const App = () => {
    // State to manage user input and chat history
    const [userMessage, setUserMessage] = useState("");
    const [chat, setChat] = useState([]);

    // Function to handle sending a message
    const sendMessage = async () => {
        if (!userMessage.trim()) return; // Ensure message is not empty

        // Add the user's message to the chat
        setChat([...chat, { sender: "user", text: userMessage }]);

        try {
            // Send the user message to the backend
            const response = await axios.post("http://localhost:8000/api/chat/", {
                message: userMessage,
            });

            // Add the bot's response to the chat
            setChat((prevChat) => [
                ...prevChat,
                { sender: "bot", text: response.data.bot_message },
            ]);
        } catch (error) {
            console.error("Error sending message:", error);
            setChat((prevChat) => [
                ...prevChat,
                { sender: "bot", text: "Error: Unable to connect to the server." },
            ]);
        }

        // Clear the input field
        setUserMessage("");
    };

    return (
        <div className="App">
            <div className="chat-container">
                <div className="chat-header">
                    <h2>Chatbot</h2>
                </div>
                <div className="chat-body">
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            className={`chat-message ${
                                msg.sender === "user" ? "user-message" : "bot-message"
                            }`}
                        >
                            <strong>{msg.sender === "user" ? "You" : "Bot"}: </strong>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-footer">
                    <input
                        type="text"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)} // Update userMessage state
                        placeholder="Type a message..."
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()} // Send on Enter
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default App;
