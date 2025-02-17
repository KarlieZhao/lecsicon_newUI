import Image from "next/image"
export default function Info() {
    return (
        <section className='about'>
            <div className='about-content'>
                <h3>Understanding Lecsicon</h3>
                <p><small>Linguists Enthusiastically Catalog Symbols, Interpreting Carefully Occurred Nuances.</small></p>
                <br /> <p>Lecsicon is a collection of over 24,000 acrostics generated by OpenAI&apos;s language model
                    GPT. Following a specific prompt, GPT
                    made a sentence with a series of words whose first letters
                    sequentially spelled out the given word. At a large scale, this
                    process gives rise to intriguing behavioral patterns in the
                    model. The resulting acrostics also elicit gripping reflections
                    on the nature of this literary device and its role in meaning
                    making.
                </p><br />
                <p>In response to my prompt, the model created acrostics in
                    the form of sentences to each of the words provided.
                    The accuracy of GPT&apos;s responses, as usual, was not
                    guaranteed. At times, one or two extra words slipped into
                    the sentence. In extreme cases, the model rambled on and
                    lost track of the initial instructions. Out of tens of
                    thousands of attempts, with GPT 3.5, 30% of the responses
                    strictly followed my rules; and with GPT 4, 60% of them.
                    When one visits the Lecsicon web page, the successful
                    word-sentence pairs are typed out letter-by-letter by a
                    program.
                </p><br />
                <p>In Lecsicon, the resulting sentences offer a broader context for the original words. Many of the sentences perform similarly to Chomsky&apos;s “colorless green ideas sleep furiously,” but others, such as “Music: Many unexpected sounds indicate creativity” and “Date: Dinner and theater experience,” seem to flesh out how the units of meaning (letter, word, sentence, paragraph) feed into each other and meaning bleeds through the edges–the fractal character of the English language.
                    Large Language model capture words based on their interrelations through computation processes, like a ghost hunting through a latent vector space. In such a space, words only exist in their associations with other words, sentences emerging from context.        <br /> <br />
                </p><br />
                <h4>Top Common Words</h4>
                <p>The generated content was then passed through a series of text analysis. The dataset contains 24,393 sentences/200,049 words and among which, these are GPT&apos;s favorite words in our acrostics game:</p>
            </div>
            <Image className="about-img" src='/wordcount.svg' alt="" loading="lazy" width={1200} height={1000} />

            <div className='about-content'>
                The most common word in Lecsicon, &quot;in&quot;, ranks the 6th in the most common words in American English <small>[<a href="https://en.wikipedia.org/wiki/Wikipedia:Language_learning_centre/5000_most_common_words" target="_blank">source</a>]</small>,
                while the 2nd and 3rd most common word in Lecsicon, &quot;often&quot; and &quot;every&quot;, ranks #271 and #170 respectively. The 4th most common word, &quot;cats&quot; (or &quot;cat&quot;) does not even enter the ranking above. Truly speaks about our cat-rich internet culture, huh?<br /><br />
                <br />

                <div className="word-tree-text"> <h4>The Word Tree</h4>
                    <p>Invented by Martin Wattenberg and Fernanda Viégas in 2007, the Word Tree visualization technique is a visual search tool for unstructured text.
                        It lets you pick a word or phrase and shows you all the different contexts in which it appears. The contexts are arranged in a tree-like branching structure to reveal recurrent themes and phrases.
                    </p><br />
                    <p>
                        Below, you can explore how the integrity of 24,393 entries in Lecsicon unfolds in a tree-structure.
                    </p>
                </div>
            </div>
            <iframe className="word-tree" loading="lazy" src='https://www.jasondavies.com/wordtree/?source=f3cd708f2a0755c08985e03844238070&prefix=every' ></iframe>

            <p className='about-content'>Acrostics involve the strategic placement of initial letters
                to a sentence to convey a message or word that is external
                to the sentence. Poets from Chaucer to Boccaccio, and
                from Edgar Allan Poe to Lewis Carroll have used this
                literary device to add depth, creativity, and intrigue to their
                work. This technique is particularly effective in shorter
                forms, such as sonnets or haikus, where each letter carries
                significant weight. Acrostics enhance the aesthetic appeal
                of poems, providing an additional layer of complexity
                through the arrangement of letters. Beyond their
                puzzle-like nature, acrostics serve as a unique form of
                self-expression for poets, allowing them to play with
                language and engage readers in an interactive exploration
                of the written word.</p>
            <p className='about-content'>
                But the use of acrostics is not limited to poetry. They are
                often used in the creation of mnemonic devices that help
                retain large lists of information. Examples include the
                popular acrostic “My Very Excellent Mom Just Served Us
                Noodles” used to recall the names of the planets (including
                Neptune) and “Every Good Boy Deserves Fruit (or Favour
                in some versions)” used to recall the names of the notes
                placed on the lines of the treble clef staff. Acrostics are
                effective as mnemonic devices because they help fix in our
                minds what psychologist George A. Miller called “the
                magic number,” the average amount of discrete items the
                human brain is normally capable of retaining in short-term
                memory.</p>
            <p className='about-content'>Linguistic devices like acrostics captivate me
                because there is a hidden layer behind putting words
                together following certain mechanisms. In Lecsicon, the
                resulting sentences provide a greater context for the
                original words and reveal new perspectives. It
                is not a coincidence that GPT makes sentences that relate
                to the original word&apos;s meaning. Instead, it is a deliberate
                calculation and balancing process to capture words based
                on their relations to each other. Any word in such a space is
                nothing but the linguistic associations around it, based on
                statistical computation of the patterns of the text humans
                have produced. And
                perhaps that&apos;s why some entries are intriguing and exciting,
                like this one: &quot;snob: Surely, no one believes&quot;.</p>
            <p className='about-content'>¡wénrán zhào!<br /><a href="https://theunthoughts.com/" target='_blank' style={{ textDecoration: 'underline' }}>theunthoughts.com</a>
                <br />      <small>Last Update: Jan 2025</small></p>
            <br /> <br /><br />  </section>
    )
}