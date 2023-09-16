


export const MultiplayerSelect = (props) => {



    return <div className="multiplayer-select">
        {props.players.map((player, index) => {
            return <div key={index} className={`player ${index + 1 === props.players.length ? "last-player" : ""}`}>
                <h2>{player.name}</h2>
                <button onClick={() => {
                    props.challengePlayer(player.playerId)
                }}> Challenge Player </button>
            </div>

        })}
    </div>
}