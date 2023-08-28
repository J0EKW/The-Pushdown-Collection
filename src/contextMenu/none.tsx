import { State } from "../types";

type CMNoneProps = {
    top: number,
    left: number,
    onAddState: Function
}

export const CMNone = (props: CMNoneProps) => {
    return (
        <div id='noneContextMenu' className='contextMenu reveal' style={{left: props.left, top: props.top}} >
            <input className='contextMenuButton' type='button' value='Add State' onClick={() => {props.onAddState(props.left, props.top)}}/>
        </div> 
    )
}