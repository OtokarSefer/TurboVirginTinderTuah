import React from "react";
import Card from "../components/UI/Card";

const Home = ({ setIsLoggedIns}) => {

    return (
        <div>
            <h1>Welcome to TwinderTuah home page, it's filled with desperate people!</h1>
        <button onClick={() => setIsLoggedIns(false)}>Click me for crack</button>
        <Card className='bio'>
            Bio
        </Card>
        </div>

    );
};

export default Home;
