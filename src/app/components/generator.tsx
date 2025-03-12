"use client"
import { RiTa } from "rita";
import { useState, useRef, ChangeEvent, useEffect } from "react";
import { meetRules } from "./processResponse";

interface TokenizedWordData {
    word: string;
    sentence: string[];
}

export default function GeneratorSection() {
    const [inputValue, setInputValue] = useState<string>(""); // State to store the input value
    const [DisplayedWords, setDisplayedWords] = useState<TokenizedWordData[]>([]);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [sendRequstFlag, setSendRequstFlag] = useState(false);
    const genContainerRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const isWord = (input: string): boolean => {
        const wordRegex = /^[a-zA-Z]+$/; // Only alphabetic characters
        return wordRegex.test(input);
    };

    const handleClick = (word: string) => {
        // console.log('Clicked word:', word);
        setInputValue(word);
        setSendRequstFlag(true);
    };

    useEffect(() => {
        if (sendRequstFlag) {
            sendRequest();
        };
    }, [sendRequstFlag])

    const sendRequest = async () => {
        setUserPrompt("");

        if (inputValue.trim() && isWord(inputValue.trim())) {
            try {
                const response = await fetch('/api/openai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ inputValue }) // Send inputValue to API route
                });
                const data = await response.json();
                if (response.ok) {
                    const acrosticSentence = data.choices?.[0]?.message?.content;
                    if (acrosticSentence) {
                        const capWord = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                        const words = RiTa.tokenize(acrosticSentence);
                        const newEntry = { word: capWord, sentence: words };
                        setDisplayedWords((prevWords) => [...prevWords, newEntry]);
                        setTimeout(() => {
                            if (genContainerRef.current) {
                                genContainerRef.current.scrollTo({
                                    // scroll to section bottom
                                    top: genContainerRef.current.scrollHeight, // Scroll to the bottom
                                    behavior: 'smooth',
                                });
                            }
                        }, 500);

                    } else {
                        setUserPrompt("Some error has occurred. Please try again.");
                    }
                } else {
                    setUserPrompt("Error from backend: " + data.error || "Something went wrong.");
                }
            } catch (error) {
                console.error(error);
                setUserPrompt("An error occurred while generating the acrostic sentence. Please try again.");
            }
        } else {
            setUserPrompt('"' + inputValue + '"' + " is not a valid word. Please type a word with no numbers, spaces, or punctuation.");
        }
        setSendRequstFlag(false);
    }

    const renderTokens = (entry: TokenizedWordData, token: string, index: number) => {
        const isValid = meetRules(entry.word, entry.sentence);

        return (
            <span key={index} className={`${isValid ? null : "text-gray"}`}>
                {RiTa.isPunct(token) ? (
                    <>{token}&nbsp;&nbsp;</>
                ) : (
                    <> <a onClick={(e) => {
                        e.preventDefault();
                        handleClick(token);
                    }}>{token}</a>
                        {index < entry.sentence.length - 1 && <>&nbsp;&nbsp;</>}
                    </>
                )}
            </span>
        )
    }

    return (<div className="gen-bookmark" >
        <div ref={genContainerRef}>
            <section className="sticky-section">
                <div>
                    <h3>Acrostics Playground <span className="small">Running on GPT 4o.</span></h3>
                    <small> Type or click on a word in the section below to generate. </small>
                </div>
                <input name="myInput" className="word-input"
                    value={inputValue} onChange={handleInputChange} />
                <button
                    onClick={() => { setSendRequstFlag(true) }}
                    disabled={sendRequstFlag}>
                    {sendRequstFlag ? "Generating..." : "Look Up!"}</button>
                <button className="clear-button"
                    onClick={() => { setDisplayedWords([]) }}>Clear</button>
                <div className="gen-userPrompt">{userPrompt}</div>
            </section>

            <section className="generator" >
                {DisplayedWords && DisplayedWords.map((entry, index) => {
                    return (
                        <p key={index}
                            //check rules, if meet rules: render text blue; else render it gray.
                            style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                            <span className="text-red">{entry.word}</span>:<>&nbsp;&nbsp;</>
                            {entry.sentence?.map((token, index) => renderTokens(entry, token, index))}</p>)
                })}
            </section>
        </div>
    </div>)
}