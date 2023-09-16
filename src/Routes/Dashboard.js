import { NavBar } from "../Components/NavBar"
import "../Styles/Dashboard.css"
import { ModeSelect } from "../Components/ModeSelect"
import { useEffect, useRef, useState, useTransition } from "react"
import { MultiplayerSelect } from "../Components/MultiplayerSelect"
import { io } from "socket.io-client"
import { auth } from "../Config/firebase"

const socket = io.connect("https://chem-quiz-server.onrender.com")

export const Dashboard = () => {


    const [mode, setMode] = useState("No Mode");
    const [player, setPlayer] = useState("No Player")
    const [activePlayers, setActivePlayers] = useState([]);
    const [challenges, setChallenges] = useState([]);
    const [gameOn, setGameOn] = useState(false);
    const [displayCompound, setDisplayCompound] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [timer, setTimer] = useState(10)
    const [userAnswer, setUserAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [userName, setuserName] = useState("You");
    const intervalRef = useRef();
    const indexRef = useRef(0);
    const answeredRef = useRef(1);
    const oppNameRef = useRef("");
    const oppId = useRef("");
    const screenRef = useRef();
    const userNameRef = useRef("")
    const displayCompoundLengthRef = useRef(null)

    const user = auth.currentUser? auth.currentUser : null;

    useEffect(() => {
        const time = setTimeout(() => {
            if (auth.currentUser?.displayName) {
                userNameRef.current = auth.currentUser.displayName
                setuserName(auth.currentUser.displayName)
            }
        }, 2000)
        
    }, [auth.currentUser])

    
    const changeMode = (mode) => {
        setMode(mode)
    }

    const changePlayer = (player) => {
        setPlayer(player)
    }

    const challengePlayer = (PlayerId) => {
        socket.emit("challenge", {name: userName !== "You"? userName : "Anonymous", playerId: PlayerId});
        console.log('challenging')
    }

    useEffect(() => {
        socket.on("message", (message) => {
            console.log(message.message)
        });

        socket.on("sending_players", (playerInfo) => {
            let array = playerInfo.filter(player => player.playerId != socket.id)
            setActivePlayers(array)
        })

        socket.on("challenge", (message) => {
            // Check if the challenge already exists in the challenges array
        
            for (const challenge of challenges) {
                if (challenge.playerId == message.playerId) {
                    
                    return;
                }
            }
            
            setChallenges((prevChallenges) => [...prevChallenges, message]);
            document.querySelector(".screen-cover").setAttribute("id", "screen-out");
            document.querySelector(".screen-box").removeAttribute("id");
        });

        socket.on("give_hydrocarbons", (message) => {
            let urls = [];
            let names = [];
            for (const HC of message) {
                urls.push(HC.imageUrl);
                names.push(HC.name)
            }
            urls.push("https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif")

            setAnswer(names);
            setDisplayCompound(urls);
        })

        socket.on("multiplayer-game-start", (message) => {
            oppNameRef.current = message.oppName;
            oppId.current = message.oppId;

            let urls = [];
            let names = [];
            for (const HC of message.hydroCarbs) {
                urls.push(HC.imageUrl);
                names.push(HC.name)
            }
            urls.push("https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif")

            setAnswer(names);
            setDisplayCompound(urls);

            setChallenges([])
            setPlayer("Multi Player")
            setGameOn(true);
        })

        socket.on("got_question_right", () => {
            const picture = document.querySelector(".picture-container");
            picture.setAttribute("id", "correct");
            const answerStatus = document.querySelector(".self-dots");
            answerStatus.src = require("../images/green-check.png")
            setScore(prevScore => prevScore + 100);
            const timeOut = setTimeout(() => {
                setQuestionIndex(prevIndex => prevIndex + 1);
                answerStatus.src = require("../images/dots-loading.gif")
                if (questionIndex + 1 >= displayCompound.length - 1) {
                    endGameMulti();
                }
                picture.removeAttribute("id");
            }, 2000)
        })

        socket.on("got_question_wrong", () => {
            try {
                const picture = document.querySelector(".picture-container");
                picture.setAttribute("id", "incorrect");
                const answerStatus = document.querySelector(".opp-dots");
                answerStatus.src = require("../images/green-check.png")
                const displayName = document.querySelector(".answer-display-multi");
                displayName.removeAttribute("id")
                const timeOut = setTimeout(() => {
                    setQuestionIndex(prevIndex => prevIndex + 1);
                    answerStatus.src = require("../images/dots-loading.gif")
                    displayName.setAttribute("id", "invisible")
                    if (questionIndex + 1 >= displayCompound.length - 1) {
                        // The game is already at the last question, no need to reset again
                        endGameMulti()
                    }
                    picture.removeAttribute("id");
                }, 2000)
            }
            catch(erorr) {
                console.log(erorr)
            }
        })

        return () => {
            socket.off("message");
            socket.off("sending_players");
            socket.off("challenge");
            socket.off("got_question_right");
            socket.off("got_question_wrong");
            socket.off("multiplayer-game-start");
            socket.off("give_hydrocarbons")
        };

    },[challenges, displayCompound, questionIndex])

    useEffect(() => {
        
    }, [challenges])

    const avaliableForMulti = () => {
        console.log(userName)
        let name = "";
        if (userName && userName != "You") {
            name = userName;
        }
        else {
            name="Anonymous"
        }
        socket.emit("avaliable_for_multi", {name: name})
    }

    const playerLeaving = () => {
        socket.emit("player_leaving")
    }

    const closeInvitations = () => {
        document.querySelector(".screen-cover").removeAttribute("id");
        document.querySelector(".screen-box").setAttribute("id", "invisible");
        setChallenges([]); // Set challenges state to a new empty array
    };

    const gameStarted = () => {
        clearInterval(intervalRef.current)
        setTimer(10);
        intervalRef.current = setInterval(() => {
            setTimer(prevTimer => {

                if (prevTimer === 1) {
                    const displayName = document.querySelector(".answer-display-single");
                    displayName.removeAttribute("id")
                    setQuestionIndex(prevQuestionIndex => prevQuestionIndex + 1);
                    const timeOut = setTimeout(() => {
                        displayName.setAttribute("id", "invisible")
                    }, 1000)
                    checkIfCorrect(prevTimer);
                    
                    return 10;
                } else {
                    return prevTimer - 1;
                }
            })
        }, 1000)
        
    }

    const retrieveHydroCarbs = () => {
        socket.emit("get_hydrocarbons")
    }

    useEffect(() => {
        indexRef.current = questionIndex;
        answeredRef.current += 1;
    }, [questionIndex])

    const checkIfCorrect = (prevTimer) => {
        const userAnswerL = userAnswer.toLowerCase();
        if (userAnswerL == answer[questionIndex]) {
            
            setTimer(12);
            const picture = document.querySelector(".picture-container");
            picture.setAttribute("id", "correct");
            setScore(prevScore => prevScore + 100);
            setQuestionIndex(prevIndex => prevIndex + 1);
            document.querySelector("#answer").value = "";
            const timeOut = setTimeout(() => {
                if (indexRef.current + 1 >= displayCompound.length) {
                    endGame();
                }
                picture.removeAttribute("id");
            }, 2000)
        }
        else {
            const picture = document.querySelector(".picture-container");
            picture.setAttribute("id", "incorrect");
            const timeOut = setTimeout(() => {
                if (indexRef.current + 1 >= displayCompoundLengthRef.current) {
                    endGame();
                }
                picture.removeAttribute("id");
                return;
            }, 1000)
            
        } 

    }

    useEffect(() => {
        console.log("changed display")
        console.log(displayCompound.length)
        displayCompoundLengthRef.current = displayCompound.length
    }, [displayCompound])

    const endGame = () => {
        setGameOn(false);
        setQuestionIndex(0);
        clearInterval(intervalRef.current)
        setTimer(10); // Reset the timer
        setUserAnswer(""); // Reset the user's answer
        answeredRef.current = 0;

        
        const timeOut = setTimeout(() => {
            document.querySelector(".screen-cover").setAttribute("id", "screen-out");
            document.querySelector(".results-screen").removeAttribute("id");
        }, 0)
        
    }

    const endGameMulti = () => {
        setGameOn(false);
        setQuestionIndex(0);
        clearInterval(intervalRef.current)
        setTimer(10); // Reset the timer
        setUserAnswer(""); // Reset the user's answer
        answeredRef.current = 0;

        
        const timeOut = setTimeout(() => {
            document.querySelector(".screen-cover").setAttribute("id", "screen-out");
            document.querySelector(".results-screen").removeAttribute("id");
        }, 0)
        
    }

    useEffect(() => {
        console.log(screenRef)
    }, [])

    const startMultiPlayerGame = (oppId, selfName, oppName) => {
        socket.emit("start_game", {
            oppId: oppId,
            selfName: selfName? selfName : "Anonymous",
            oppName: oppName? oppName: "Anonymous"
        })
        
    }

    const checkIfCorrectMulti = () => {
        
        const userAnswerL = userAnswer.toLowerCase();
        if (userAnswerL == answer[questionIndex]) {
            document.querySelector("#answer-multi").value = "";
            socket.emit("answer", ({
                selfId: socket.id,
                oppId: oppId,
            }))
        }
        else {
            const picture = document.querySelector(".picture-container");
            picture.setAttribute("id", "incorrect");
            const timeOut = setTimeout(() => {
                picture.removeAttribute("id");
            }, 1000)
            
        }
    }
    
    const closeResults = () => {
        document.querySelector(".screen-cover").removeAttribute("id");
        document.querySelector(".results-screen").setAttribute("id", "invisible");
        avaliableForMulti();
        setScore(0);
    }

    return <div className="dashboard">
        {gameOn? <div className="game">
            <NavBar/>
            <div className="main-section2">
                {player == "Single Player"? <div>
                    <h4> Score: {score} {`(${indexRef.current} / ${displayCompound.length - 1})`}</h4>
                    <h2> Name this Compound: </h2>
                    <h3> {timer > 10? 10 : timer}</h3>
                    <div className="picture-container">
                        <img src={displayCompound[questionIndex]} alt="compound" className="displaying-image"/>
                        <h1 className="answer-display-single" id="invisible"> {answer[questionIndex-1]? answer[questionIndex-1] : "null"} </h1>
                    </div>
                    <div className="input">
                        <label htmlFor="answer">Answer: </label>
                        <input type="text" id="answer" name="answer" 
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {if (e.key == "Enter") {
                            checkIfCorrect();
                        }}}/>
                    </div>
                    <button onClick={()=>{ checkIfCorrect()}}> Submit </button>
                </div>: <div className="multi-player-">
                    <div className="multi-display">
                        <div className="avatar-display">
                            <img className="avatar" src={require("../images/1946429.png")} alt="avatar"/>
                            <h2> {oppNameRef.current}</h2>
                            <img className="loading-dots opp-dots" src={require("../images/dots-loading.gif")} alt="answer status"/>
                        </div>
                        <div className="picture-container">
                            <img src={displayCompound[questionIndex]} alt="compound" className="displaying-image"/>
                            <h1 className="answer-display-multi" id="invisible"> {answer[questionIndex]} </h1>
                        </div>
                        <div className="avatar-display">
                            <img className="avatar" src={require("../images/1946429.png")} alt="avatar"/>
                            <h2> {userName}</h2>
                            <img className="loading-dots self-dots" src={require("../images/dots-loading.gif")} alt="answer status"/>
                        </div>
                    </div>
                    <div className="input">
                        <label htmlFor="answer-multi">Answer: </label>
                        <input type="text" id="answer-multi" name="answer" 
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {if (e.key == "Enter") {
                            checkIfCorrectMulti();
                        }}}/>
                    </div>
                    <button onClick={()=>{ checkIfCorrectMulti()}}> Submit </button>
                    </div>}
                
                <button onClick={() => {endGame()} }> Cancel Game: </button>
            </div>
        </div> : 
        <div>
            <div className="screen-cover" ref={screenRef}>
                <div className="screen-box" id="invisible">
                    <div className="top">
                        <h2> Invitation </h2>
                        <button onClick={() => {
                            closeInvitations()
                            }}> X </button>
                    </div>
                    {challenges.map((player, index) => {
                        return <div key={index}className={`challenge ${index + 1 === challenges.length ? "last-player" : ""}`}>
                            <h3> {player.name}</h3>
                            <button onClick={() => {
                                startMultiPlayerGame(player.playerId);
                            }}> Accept Challenge</button>
                        </div>

                    })}
                </div>
                <div className="results-screen" id="invisible">
                <div className="top">
                        <h2> Score </h2>
                        <button onClick={() => {
                            closeResults();
                            }}> X </button>
                    </div>
                    <h2>Score: {score} {`(${score/100} / ${displayCompound.length - 1})`}</h2>
                </div>
            </div>
            <NavBar />
            <div className="main-section">
                
                <h1> {mode == "No Mode" ? "Select Mode" : mode} </h1>
                <h2> {player == "No Player" ? "" : player}</h2>
                { mode == "No Mode" ? 
                <div className="select-things">
                    <ModeSelect modeName={`Nomenclature`} funct={changeMode}/>
                    <ModeSelect modeName="General Knowledge" funct={changeMode}/>
                </div>
                :   <div> {mode=="Nomenclature"? <div className="further">{ player == "No Player" ? <div className="select-player">
                        <div className="select-buttons">
                            <button onClick={() => { changePlayer("Single Player")}}> Single Player </button>
                            <button onClick={() => { changePlayer("Multiplayer"); avaliableForMulti(); }}> Multiplayer </button>
                        </div>
                        <button onClick={ () => { changeMode("No Mode")}}> Go Back </button>
                    </div> : <div>
                            {player == "Single Player" ? <div className="single-player">
                                <button onClick={() => {setGameOn(true); gameStarted(); retrieveHydroCarbs();}}> Start Game </button>
                                <button onClick={() => {changePlayer("No Player");}}> Go Back </button>
                            </div> : <div className="multi-player">
                                    <MultiplayerSelect players={activePlayers} challengePlayer={challengePlayer} />
                                    <button onClick={() => {changePlayer("No Player"); playerLeaving();}}> Go Back </button>
                                </div>}
                        </div>} </div> : <div className="coming-soon"> <h1> Coming Soon </h1> 
                        <button onClick={() => {setMode("No Mode")}}> Go Back </button></div> } </div> } 
            </div>
        </div>
        }
    </div>
}