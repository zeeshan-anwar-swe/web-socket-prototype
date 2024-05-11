import { useEffect, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function App() {
    const [chat, setChat] = useState([]);
    const inputRef = useRef(null);
    const roomRef = useRef(null);

    const sendMessage = async (e) => {
        e.preventDefault();
        setChat((prevChat) => [...prevChat, { data: inputRef.current.value }]);
        await socket.emit("message-socket", { data: inputRef.current.value , room: roomRef.current.value });
        inputRef.current.value = "";
    };

    const joinRoom = async (e) => {
      e.preventDefault();

        await socket.emit("join-room",roomRef.current.value);
    };

    useEffect(() => {
        socket.on("receive-message", (data) => {
            setChat((prevChat) => [...prevChat, data]);
        });
    }, [socket]);

    return (
        <div className="app">
            <form>
              <input ref={roomRef} type="text" />
              <button onClick={joinRoom}>Join Room</button>
                <input
                    ref={inputRef}
                    required
                    type="text"
                    name="message"
                    id="message"
                />
                <button onClick={sendMessage}>Send Message</button>
            </form>
            <div>
                {chat.map((data, index) => {
                    return <h3 key={index}>{data.data}</h3>;
                })}
            </div>
        </div>
    );
}

export default App;
