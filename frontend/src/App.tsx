import { useEffect, useState } from "react";
import api from "./api";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/")
            .then((res) => {
                setMessage(res.data.message);
            })
            .catch(console.error);
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
}

export default App;