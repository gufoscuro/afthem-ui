import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from "framer-motion";
import { shuffle } from "lodash";

import './TestList.css';

function TestList (props) {
    const [ items, setItems ] = useState ([ '#FF008C', '#D309E1', '#9C1AFF', '#7700FF', '#000000'  ]);
    const [ sizes, setSizes ] = useState ([ '240px', '110px', '320px', '250px', '400px'  ]);


    // useEffect (() => {
    //     setTimeout (() => setItems (prevItems => shuffle (prevItems)), 1000)
    // }, [ items ]);

    const shuffleList = useCallback (() => {
        setItems (prevItems => shuffle (prevItems))
        setSizes (prevItems => shuffle (prevItems))
    }, []);

    const renderer = useMemo (() => {
        const spring = {
            type: "spring",
            damping: 20,
            stiffness: 300
        };
        
        return (
            <div className="p-10">
                <ul className="list">
                    {items.map ((background, j) => 
                        <motion.li key={background} 
                            drag="y" 
                            layoutTransition={spring} 
                            style={{ background, width: sizes[j] }} />
                    )}
                </ul>
                <button className="btn btn-sm btn-primary" onClick={shuffleList}>Shuffle</button>
            </div>
        )
    }, [ items, sizes, shuffleList ]);

    return renderer;
}

export default TestList;