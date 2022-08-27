import {useState} from 'react'

export default function Answer(props) {
  const [showAnswer, setShowAnswer] = useState(false)
  
  return (
    <>
      <span className="answer-toggle" onClick={() => {setShowAnswer(!showAnswer)}}>{showAnswer ? "hide suggestion" : "show suggestion"}</span>
      {showAnswer && <div className={"answer"}>
      {props.children}
      </div>
      }
      <style jsx>{`
        
        .answer{
          padding: 20px; 
          background-color: #e6ffe6;
          font-size: 20px;

        }
        .answer-toggle{
          font-size: 12px;
          cursor: pointer;
          margin: 0;
          padding: 0;
          padding-left: 10px;
        }
        .answer-toggle:hover{
          text-decoration: underline;
        }

      `}</style>
    </>
  )
}
