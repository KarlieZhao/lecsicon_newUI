"use client"
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface WordData {
    word: string;
    sentence: string;
}
// TypeWriter Entry Component
interface TypewriterEntryProps {
    word: string;
    sentence: string;
    onComplete: () => void;
}

const TypewriterEntry = React.memo<TypewriterEntryProps>(({ word, sentence, onComplete }) => {
    const [displayText, setDisplayText] = useState('');
    const fullText = `${word}: ${sentence}`;
    const charIndex = useRef(0);
    const typewriterSpeed = 90;

    useEffect(() => {
        const typeNextChar = () => {
            if (charIndex.current < fullText.length) {
                setDisplayText(fullText.slice(0, charIndex.current + 1));
                charIndex.current += 1;
            } else {
                onComplete();
            }
        };

        const typingInterval = setInterval(typeNextChar, typewriterSpeed);
        return () => clearInterval(typingInterval);
    }, [fullText, onComplete]);

    const renderColoredText = (text: string): React.ReactNode => {
        const parts = text.split(':');

        if (parts.length === 1) {
            return parts[0].split(' ').map((word, index) => (
                <span key={index}>
                    {index > 0 && ' '}
                    {word && (
                        <>
                            <span className="text-red">{word[0]}</span>
                            <span>{word.slice(1)}</span>
                        </>
                    )}
                </span>
            ));
        }

        return (
            <>
                <span className="text-red">{parts[0]}</span>:<br />
                {parts[1] && (
                    <>
                        {parts[1].split(' ').map((word, index) => (
                            <span key={index}>
                                {index === 0 && ' '}
                                {word && (
                                    <>
                                        <span className="text-red">{word[0]}</span>
                                        <span>{word.slice(1)}</span>
                                        {index < parts[1].split(' ').length - 1 && ' '}
                                    </>
                                )}
                            </span>
                        ))}
                    </>
                )}
            </>
        );
    };

    return <p className="mb-4">{renderColoredText(displayText)}</p>;
});

TypewriterEntry.displayName = 'TypewriterEntry';

// Data fetching hook
const useWordData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const wordData = useRef<WordData[]>([]);
    useEffect(() => {
        const loadJSON = async () => {
            try {
                const response = await fetch('words.json');
                if (!response.ok) throw new Error('Failed to load JSON');
                const data: WordData[] = await response.json();
                wordData.current = data;
            } catch (error) {
                setError(error instanceof Error ? error : new Error('Unknown error'));
            } finally {
                setIsLoading(false);
            }
        };
        loadJSON();
    }, []);

    return { wordData, isLoading, error };
};

// Display logic hook
const useWordDisplay = (
    wordData: React.RefObject<WordData[]>,
    maxHeight: number,
    displayRef: React.RefObject<HTMLDivElement | null>,
    newEntryDelay: number
) => {
    const [displayedWords, setDisplayedWords] = useState<WordData[]>([]);
    const isTypingRef = useRef(true);
    const shouldAddNewEntryRef = useRef(true);
    const timeoutRefs = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

    const cleanupTimeouts = useCallback(() => {
        timeoutRefs.current.forEach(clearTimeout);
        timeoutRefs.current.clear();
    }, []);

    const setManagedTimeout = useCallback((callback: () => void, delay: number) => {
        const timeoutId = setTimeout(() => {
            callback();
            timeoutRefs.current.delete(timeoutId);
        }, delay);
        timeoutRefs.current.add(timeoutId);
        return timeoutId;
    }, []);

    const findSentenceByWord = useCallback((word: string) => {
        const found = wordData.current?.find(
            (item) => item.word.toLowerCase() === word.toLowerCase()
        );
        return found?.sentence || '';
    }, [wordData]);

    const addEntry = useCallback(() => {
        if (!wordData.current?.length || isTypingRef.current) return;

        const currentHeight = displayRef.current?.getBoundingClientRect().height || 0;

        if (currentHeight * 2 + 24 >= maxHeight) {
            setManagedTimeout(() => {
                shouldAddNewEntryRef.current = true;
                isTypingRef.current = false;
                setDisplayedWords([]);
            }, newEntryDelay);
            return;
        }

        isTypingRef.current = true;
        const randomWord = wordData.current[Math.floor(Math.random() * wordData.current.length)].word;
        const capWord = randomWord.charAt(0).toUpperCase() + randomWord.slice(1);

        setDisplayedWords(prev => [...prev, {
            word: capWord,
            sentence: findSentenceByWord(randomWord)
        }]);
    }, [maxHeight, findSentenceByWord, newEntryDelay, displayRef, wordData, setManagedTimeout]);

    const handleTypewriterComplete = useCallback(() => {
        isTypingRef.current = false;
        setManagedTimeout(addEntry, newEntryDelay);
    }, [addEntry, newEntryDelay, setManagedTimeout]);

    useEffect(() => {
        if (!displayRef.current || maxHeight <= 0) return;

        const currentHeight = displayRef.current.getBoundingClientRect().height;

        if (currentHeight * 2 + 24 >= maxHeight) {
            setManagedTimeout(() => {
                shouldAddNewEntryRef.current = true;
                isTypingRef.current = false;
                setDisplayedWords([]);
            }, newEntryDelay);
        } else if (displayedWords.length === 0 && shouldAddNewEntryRef.current) {
            shouldAddNewEntryRef.current = false;
            isTypingRef.current = false;
            addEntry();
        }
    });

    useEffect(() => cleanupTimeouts, [cleanupTimeouts]);

    return {
        displayedWords,
        handleTypewriterComplete
    };
};

// Main component
interface WordDisplayProps {
    maxHeight?: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ maxHeight = 900 }) => {
    const displayRef = useRef<HTMLDivElement>(null);
    const { wordData, isLoading, error } = useWordData();
    const { displayedWords, handleTypewriterComplete } = useWordDisplay(
        wordData,
        maxHeight,
        displayRef,
        2000
    );

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full">
            <div
                ref={displayRef}
                className="relative h-fit"
            >
                {displayedWords.map((entry, index) => (
                    <TypewriterEntry
                        key={`${entry.word}-${index}`}
                        word={entry.word}
                        sentence={entry.sentence}
                        onComplete={
                            index === displayedWords.length - 1
                                ? handleTypewriterComplete
                                : () => { }
                        }
                    />
                ))}
            </div>
        </div>
    );
};

export default React.memo(WordDisplay);