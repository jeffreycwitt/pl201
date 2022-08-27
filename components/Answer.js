import {useState} from 'react'

export default function Answer(props) {
  const [showAnswer, setShowAnswer] = useState(false)
  const indent = props.level ? (props.level + 1) * 10 : 10
  const mainClass = (!props.level || props.level === "1") && "main" 
  return (
    <div>
      <p className="answer-toggle" onClick={() => {setShowAnswer(!showAnswer)}}>{showAnswer ? "hide" : "show suggestion"}</p>
      {showAnswer && <div className={"answer " + props.type + " " + mainClass} style={{paddingLeft: indent + "px"}}>
      {props.date}
      {props.children}
      </div>
      }
      <style jsx>{`
        
        .answer{
          padding-right: 10px; 
          background-color: lightgreen;

        }
        .answer-toggle{
          font-size: 12px;
          cursor: pointer;
          margin: 0;
          padding: 0;
        }
        .answer-toggle:hover{
          text-decoration: underline;
        }

      `}</style>
    </div>
  )
}
