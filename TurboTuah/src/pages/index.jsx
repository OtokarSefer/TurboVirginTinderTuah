import React from "react";

const Home = ({ setIsLoggedIns }) => {
    return (
        <div>
            <h1>Welcome to TwinderTuah home page, it's filled with desperate people!</h1>
        <button onClick={() => setIsLoggedIns(false)}>Click me for crack</button>
        </div>

    );
};

export default Home;
