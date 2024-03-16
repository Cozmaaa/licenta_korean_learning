'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
    const [inputText, setInputText] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    // This effect will only run on the client after the component has mounted.
    // Any code that relies on the window or other browser-specific APIs should go here.
    useEffect(() => {
        // Here you can do any client-specific initialization
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(inputText);
            const response = await axios.post('http://localhost:5000/api/generate-response', { text: inputText });
            const responseData = response.data.response;
            setChatHistory((currentChatHistory) => [
                ...currentChatHistory,
                { text: inputText, isUser: true },
                { text: responseData, isUser: false },
            ]);
            setInputText('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // No need to check for window being undefined, React will handle this
    return (
        <div>
            <h1>Chat Page</h1>
            <div>
                {chatHistory.map((message, index) => (
                    <div key={index} style={{ textAlign: message.isUser ? 'right' : 'left' }}>
                        <p>{message.text}</p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatPage;
