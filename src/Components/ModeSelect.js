

export const ModeSelect = (props) => {



    return <div className={`mode-select ${props.modeName}`} onClick={() => {
        props.funct(props.modeName)
    }}>
        <div className="line"></div>
        <h3> {props.modeName} </h3>
        <div className="line"></div>
    </div>
}