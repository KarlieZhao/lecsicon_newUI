"use client"
import { useRef, useEffect, useState } from 'react'
import banner from '../../public/banner.png'
import './globals.css'
import GeneratorSection from './components/generator'
import WordDisplay from './components/wordDisplay'
import Image from 'next/image'
import SyntaxHighlighter from 'react-syntax-highlighter';
import Info from './components/readMore';
export default function Home() {
  const bannerRef = useRef<HTMLImageElement>(null);
  const collectionRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(500);
  const [windowHeight, setWindowHeight] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [maxHeight, setMaxHeight] = useState(windowHeight - bannerHeight - 25);
  const [logoHover, setLogoHover] = useState(false);
  const [readMore, setReadMore] = useState("Read More");
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    setWindowWidth(window.innerWidth);
    if (bannerRef.current) setBannerHeight(bannerRef.current.getBoundingClientRect().height);
    if (collectionRef.current) {
      const calculatedMaxHeight = windowHeight - bannerHeight - 110;
      setMaxHeight(calculatedMaxHeight);
      // console.log(calculatedMaxHeight)
      collectionRef.current.style.height = `${calculatedMaxHeight}px`
    }
  }, [bannerHeight])

  const openReadMore = () => {
    // Shift the page down
    if (typeof window != 'undefined' && !isPromptOpen) {
      setReadMore("Back")
      window.scrollTo({
        top: windowHeight - 25,
        behavior: 'smooth',
      });
    }
  }
  const closeReadMore = () => {
    setReadMore("Read More")
    // Shift the page up
    if (typeof window != 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }
  const handlePromptnCode = () => {
    setIsPromptOpen(!isPromptOpen);
    if (typeof window != 'undefined' && readMore != "Back") {
      window.scrollTo({
        left: isPromptOpen ? 0 : windowWidth - 25,
        behavior: 'smooth',
      });
    }
  }
  const customStyle = {
    backgroundColor: "#00000000",
    width: "100%",
    color: "#000",
    fontSize: "13px",
    fontFamily: "Fira Code, monospace",
    padding: "10px"
  }

  return (
    <>
      <div className='background'>
        <div
          onMouseOver={() => { setLogoHover(true) }}
          onMouseOut={() => { setLogoHover(false) }} >
          <Image src={banner} ref={bannerRef} className={`banner ${logoHover ? "blur" : null}`} alt="" />
          <div className={`acrostic ${logoHover ? "visible" : "invisible"}`}>
            <span className='text-highlight'>An acrostic is a poem or other word composition in which the first letter of each new line spells out a word, message or the alphabet.
            </span> </div>
        </div>

        <div className='top-box'>Lecsicon by ¡wénrán zhào!</div>
        <div className='bottom-box' style={{ cursor: "pointer" }} onClick={() => { return readMore === "Back" ? closeReadMore() : openReadMore() }}>
          <div className='bottom-text'>Lecsicon is a growing collection of over 24,000 acrostic lines. </div>
          <div className='read-more'
            onClick={() => { return readMore === "Back" ? closeReadMore() : openReadMore() }}>{readMore}</div>
        </div>
        <div className='left-box'></div>
        <div className='right-box' onClick={() => {
          handlePromptnCode();
        }}><div className={`${windowWidth < 700 ? "invisible" : "visible"}`}>Prompt & Code</div></div>
      </div >

      <div className='collection' ref={collectionRef}>
        <h1>From the Collection</h1>
        <WordDisplay maxHeight={maxHeight} />
      </div>
      <GeneratorSection />

      {/* read more  */}
      <Info />

      <section className='prompt-code'>
        <div className='prompt'>
          <h3>Prompt 3.0</h3><br />
          System:<br /> Let&apos;s play the Acrostic game.
          <br />   I will give you a word.<br />
          Write a sentence with a series of words whose first letters sequentially spell out my word.
          Your sentence doesn&apos;t need to have a semantic connection with the word I give you.<br />
          Your response should only contain the sentence you made.
          <br /><br />
          User: $inputValue
          <div className='code'>
            <h3>Code</h3>

            Upon generation, each sentence is passed through a rule-checking function:
            <SyntaxHighlighter language="javascript" customStyle={customStyle}>
              {
                ` function meetRules(word: string, tokens: string[]): boolean {
                  if (!word || !tokens.length) {
                    return false;
                  }
                  // filter punctuations
                  const filteredTokens = tokens.filter(token => !RiTa.isPunct(token));
                  // first, check if the lengths match after filtering
                  if (filteredTokens.length !== word.length) {
                    return false;
                  }
                  // compare each letter in the word with 
                  // the initals of each word in the sentence
                  return word.split('').every((char, index) =>
                    char === filteredTokens[index][0]
                  );
                }`
              }
            </SyntaxHighlighter>
          </div>

        </div>

      </section >
    </>
  )
}
