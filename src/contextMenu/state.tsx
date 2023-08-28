import { useState } from "react";
import { State } from "../types";

type CMStateProps = {
    top: number,
    left: number,
    state: State,
    onRemove: Function,
    onNameUpdate: Function,
    onInitUpdate: Function,
    onAcceptUpdate: Function,
    onAlternateUpdate: Function
}

export const CMState = (props: CMStateProps) => {
    const [name, setName] = useState<string>(props.state.name)

    let state: State = props.state
    const handleName = (e: any) => {
        if (e.key === 'Enter') {
          
          props.onNameUpdate(props.state?.id, name)
        }
      }
    
      const toggleInit = () => {
        props.onInitUpdate(state.id, !state.initial)
      }
    
      const toggleAccept = () => {
        props.onAcceptUpdate(state.id, !state.accepting)
      }
    
      const toggleAlternating = () => {
        props.onAlternateUpdate(state.id, !state.alternating)
      }
    
    return (
        <div id='stateContextMenu' className='contextMenu reveal' style={{left: props.left, top: props.top}} >
            <div className='contextMenuLabel'>name <input className='contextMenuInput' type='text' value={name} onChange={(e) => setName(e.currentTarget.value)} onKeyDown={(e) => handleName(e)} /></div>
            <div className='contextMenuLabel'>Initial? <input className='contextMenuCheckBox' type='checkBox' checked={props.state.initial} onChange={() => {toggleInit()}}/></div>
            <div className='contextMenuLabel'>Accepting? <input className='contextMenuCheckBox' type='checkBox' checked={props.state.accepting} onChange={() => {toggleAccept()}}/></div>
            <div className='contextMenuLabel'>Alternating? <input className='contextMenuCheckBox' type='checkBox' checked={props.state.alternating} onChange={() => {toggleAlternating()}}/></div>
            <input className='contextMenuButton' type='button' value='Remove' onClick={() => {props.onRemove(props.state.id)}} />
        </div>
    )
}