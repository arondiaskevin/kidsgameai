import React, { useState, useEffect, useRef } from 'react';

const App = () => {
    // Word Game States
    const [currentWord, setCurrentWord] = useState('');
    const [guessedLetters, setGuessedLetters] = useState([]);
    const [attemptsLeft, setAttemptsLeft] = useState(6);
    const [gameStatus, setGameStatus] = useState('playing');
    const [message, setMessage] = useState('');
    const [wordLoading, setWordLoading] = useState(false);

    // AI Chat States
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const chatContainerRef = useRef(null);
    const [aiChatLoading, setAiChatLoading] = useState(false);

    // Fetch new word function
    const fetchWord = () => {
        setWordLoading(true);
        setMessage('Loading a word...');
        
        setTimeout(() => {
            const predefinedWords = [
                { word: "sun", hint: "Shines in the sky during the day." },
                { word: "flower", hint: "Has petals and smells good." },
                { word: "cat", hint: "A cute animal that meows." },
                { word: "house", hint: "Where we live." },
                { word: "duck", hint: "A bird that walks and swims." },
                { word: "ball", hint: "Round and bounces a lot." },
                { word: "moon", hint: "Appears in the sky at night." },
                { word: "sea", hint: "Very blue and has waves." },
                { word: "dad", hint: "Who takes care of the family." },
                { word: "mom", hint: "Who gives us lots of love." }
            ];
            
            const randomWordObj = predefinedWords[Math.floor(Math.random() * predefinedWords.length)];
            setCurrentWord(randomWordObj.word);
            setGuessedLetters([]);
            setAttemptsLeft(6);
            setGameStatus('playing');
            setMessage(`Guess the word! Hint: ${randomWordObj.hint}`);
            setWordLoading(false);
        }, 500);
    };

    // Start game on component mount
    useEffect(() => {
        fetchWord();
    }, []);

    // Handle letter guess
    const handleGuess = (letter) => {
        if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
            return;
        }

        const newGuessedLetters = [...guessedLetters, letter];
        setGuessedLetters(newGuessedLetters);

        if (!currentWord.includes(letter)) {
            setAttemptsLeft(attemptsLeft - 1);
        }
    };

    // Check game status
    useEffect(() => {
        if (!currentWord) return;

        const displayedWord = currentWord
            .split('')
            .map((char) => (guessedLetters.includes(char) ? char : '_'))
            .join('');

        if (displayedWord === currentWord) {
            setGameStatus('won');
            setMessage('Congratulations! You guessed the word!');
        }
        else if (attemptsLeft === 0) {
            setGameStatus('lost');
            setMessage(`You lost! The word was: ${currentWord.toUpperCase()}`);
        }
    }, [guessedLetters, attemptsLeft, currentWord]);

    // Render word display
    const renderWord = () => {
        return currentWord
            .split('')
            .map((char, index) => (
                <span key={index} className="mx-1 text-4xl font-bold text-indigo-700">
                    {guessedLetters.includes(char) ? char.toUpperCase() : '_'}
                </span>
            ));
    };

    // Render keyboard
    const renderKeyboard = () => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        return (
            <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-9 gap-2 mt-6">
                {alphabet.map((letter) => (
                    <button
                        key={letter}
                        onClick={() => handleGuess(letter)}
                        disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
                        className={`
                            px-4 py-2 rounded-lg font-semibold
                            ${guessedLetters.includes(letter)
                                ? currentWord.includes(letter)
                                    ? 'bg-green-500 text-white cursor-not-allowed'
                                    : 'bg-red-500 text-white cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                            }
                            ${gameStatus !== 'playing' ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                    >
                        {letter.toUpperCase()}
                    </button>
                ))}
            </div>
        );
    };

    // Chat input change handler
    const handleChatInputChange = (e) => {
        setChatInput(e.target.value);
    };

    // Chat submit handler
    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMessage = { role: 'user', text: chatInput };
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        setChatInput('');
        setAiChatLoading(true);

        setTimeout(() => {
            const mockResponses = [
                "Hello! How are you today? 😊",
                "That's cool! Tell me more about it!",
                "Hmm, interesting! 🤔",
                "You're very smart!",
                "What a great question! Let me think...",
                "I love talking with you! 💕",
                "You know you're amazing, right?",
                "That's an excellent question!",
                "You make me laugh! 😄",
                "Keep it up, you're doing great!",
                "What a creative idea! 🎨",
                "You're very special!",
                "I learn a lot from you!",
                "What a fun conversation! 🎉",
                "You have a brilliant mind!"
            ];
            
            const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
            setChatMessages((prevMessages) => [...prevMessages, { role: 'ai', text: randomResponse }]);
            setAiChatLoading(false);
        }, 1000);
    };

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 font-inter text-gray-800">
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

            <style>{`
                body {
                    font-family: 'Inter', sans-serif;
                }
                button {
                    transition: all 0.2s ease-in-out;
                }
                button:hover:enabled {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .chat-message.user {
                    background-color: #e0f2fe;
                    align-self: flex-end;
                    border-bottom-right-radius: 0;
                }
                .chat-message.ai {
                    background-color: #fce4ec;
                    align-self: flex-start;
                    border-bottom-left-radius: 0;
                }
                .rounded-t-xl { border-top-left-radius: 1rem; border-top-right-radius: 1rem; }
                .rounded-b-xl { border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem; }
            `}</style>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                {/* Word Game Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-6 drop-shadow-md">
                        Word Game for Kids
                    </h1>

                    <div className="text-center mb-6">
                        <p className="text-xl text-gray-700 font-semibold mb-2">{message}</p>
                        {wordLoading && (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                <span className="ml-3 text-lg text-gray-600">Loading word...</span>
                            </div>
                        )}
                        <p className="text-lg text-gray-600">Attempts left: <span className="font-bold text-red-500">{attemptsLeft}</span></p>
                    </div>

                    <div className="flex justify-center mb-8 bg-purple-50 p-4 rounded-lg shadow-inner">
                        {renderWord()}
                    </div>

                    {renderKeyboard()}

                    {(gameStatus === 'won' || gameStatus === 'lost') && (
                        <div className="mt-8 text-center">
                            <button
                                onClick={fetchWord} 
                                className="bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            >
                                Play Again
                            </button>
                        </div>
                    )}
                </div>

                {/* AI Chat Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col transform hover:scale-105 transition-transform duration-300 ease-in-out">
                    <h2 className="text-4xl font-extrabold text-center text-blue-700 mb-6 drop-shadow-md">
                        My AI Friend Chat
                    </h2>

                    <div ref={chatContainerRef} className="flex-grow bg-gray-50 p-4 rounded-lg overflow-y-auto h-80 border border-gray-200 shadow-inner mb-4 custom-scrollbar">
                        {chatMessages.length === 0 && (
                            <p className="text-center text-gray-500 italic mt-4">Say 'Hello' to your AI friend!</p>
                        )}
                        {chatMessages.map((msg, index) => (
                            <div
                                key={index}
                                className={`
                                    p-3 mb-2 max-w-[80%] rounded-xl shadow-sm
                                    ${msg.role === 'user'
                                        ? 'bg-blue-200 ml-auto chat-message user'
                                        : 'bg-pink-200 mr-auto chat-message ai'
                                    }
                                `}
                            >
                                <p className="text-sm sm:text-base">{msg.text}</p>
                            </div>
                        ))}
                        {aiChatLoading && (
                            <div className="p-3 mb-2 max-w-[80%] rounded-xl bg-pink-100 mr-auto shadow-sm animate-pulse">
                                <p className="text-sm sm:text-base text-gray-600 italic">Typing...</p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={handleChatInputChange}
                            placeholder="Type your message..."
                            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 px-5 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                            disabled={aiChatLoading}
                        >
                            {aiChatLoading ? 'Sending...' : 'Send'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default App;
