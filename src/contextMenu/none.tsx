type CMNoneProps = {
    colour: String,
    top: number,
    left: number,
    onAddState: Function
}

export const CMNone = (props: CMNoneProps) => {
    return (
        <div id='noneContextMenu' className={props.colour + ' contextMenu reveal'} style={{left: props.left, top: props.top}} >
            <input className={props.colour + ' contextMenuButton'} type='button' value='Add State' onClick={() => {props.onAddState(props.left, props.top)}}/>
        </div> 
    )
}