import { useState, useEffect } from "react";
 
const Timer = ({ onTimerFinish }) => { 
    const [seconds, setSeconds] = useState(0);

    // Every second and every canRun switch calls the useEffect thingy, and then checks if the parameters fit. 
    useEffect(() => {
        let intval = setInterval(() => {
            setSeconds((prev) => prev + 1);
          }, 1000);


        if (seconds >= 4) {
            clearInterval(intval)
            onTimerFinish()
        }

        return () => clearInterval(intval)
    }, [seconds, onTimerFinish]); 

    return null
}

export default Timer;