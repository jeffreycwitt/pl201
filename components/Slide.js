

export default function Slide(props) {
  const indent = props.level * 20
  const listStyle = props.level === 1 ? "disc" : "circle"
  return (
    <div className={"slide " + props.number}>
      {props.children}
      <style jsx>{`
        .slide { width: 80%; height: 98vh; align-items: center; justify-content: center; font-size: 1.5em; border-bottom: .5px dotted black; padding: 0 10% }
      `}</style>
    </div>
  )
}
