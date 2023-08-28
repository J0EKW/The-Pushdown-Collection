import React, { useEffect, useState } from 'react'
import { Transition } from '../types'

type TransitionProps = {
    transition: Transition,
    index: number,
    cState: string,
    nState: string,
    stackCount: number,
    onRemove: Function,
    onCInputUpdate: Function,
    onCStateUpdate: Function,
    onNStateUpdate: Function,
    onCStackUpdate: Function,
    onNStackUpdate: Function,
    onNInputHeadUpdate: Function
}
export default function TransitionComponent(props: TransitionProps) {
    let transition = props.transition
    let index = props.index
    const [cState, setCState] = useState<string>(props.cState)
    const [nState, setNState] = useState<string>(props.nState)
    const [cStack, setCStack] = useState<string[]>(transition.cStack)
    const [nStack, setNStack] = useState<string[]>(transition.nStack)
    const [cInput, setCInput] = useState<string>(transition.cInput)

    const handleCInput= (e: any) => {
        if (e.key === 'Enter') {
            props.onCInputUpdate(transition.id, cInput)
        }
    }

    const handleCState = (e: any) => {
        if (e.key === 'Enter') {
            props.onCStateUpdate(transition.id, cState)
        }
    }

    const handleNState = (e: any) => {
        if (e.key === 'Enter') {
            props.onNStateUpdate(transition.id, nState)
        }
    }

    const handleCStack = (e: any, index: number) => {
        if (e.key === 'Enter') {
            props.onCStackUpdate(transition.id, cStack[index], index)
        }
    }

    const handleNStack = (e: any, index: number) => {
        if (e.key === 'Enter') {
            props.onNStackUpdate(transition.id, nStack[index], index)
        }
    }

    const updateCStack = (value: string, index: number) => {
        let newCStack = [...cStack]
        newCStack[index] = value
        setCStack(newCStack)
    }

    const updateNStack = (value: string, index: number) => {
        let newNStack = [...nStack]
        newNStack[index] = value
        setNStack(newNStack)
    }

    useEffect(() => {
        setCState(props.cState)
    }, [props.cState])

    useEffect(() => {
        setNState(props.nState)
    }, [props.nState])

    return (
    <div id={'transition' + transition.id} className='transition show'>
        <input id='removeTransition' title={'Remove transition'} type= 'submit' className='remove' value='&times;' onClick={() => {props.onRemove(transition.id)}}/>
        <input id='currentState' title={'State at start of transition'} type='input' className='boxInput' value={cState} onChange={(e) => setCState(e.currentTarget.value)} onKeyDown={(e) => handleCState(e)}/>
        <input id='currentInput' title={'Input at start of transition'} type='input' className='boxInput' value={cInput} maxLength={1} onChange={(e) => setCInput(e.currentTarget.value)} onKeyDown={(e) => handleCInput(e)}/>
        {cStack.map((x, i) => {
            if (i < props.stackCount) {
                return (<input key={i} id={'currentStack' + i} title={'Popped Value of Stack ' + Number(i + 1) + ' at start of transition'} type='input' className='boxInput' value={x}  maxLength={1} onChange={(e) => updateCStack(e.currentTarget.value, i)} onKeyDown={(e) => handleCStack(e, i)}/>)
            }
        })}
        <input id='newState' title={'State at end of transition'} type='input' className='boxInput' value={nState} onChange={(e) => setNState(e.currentTarget.value)} onKeyDown={(e) => handleNState(e)}/>
        {nStack.map((x, i) => {
            if (i < props.stackCount) {
                return <input key={i} id={'newStack' + i} title={'Values to push to Stack ' + Number(i + 1) + ' at end of transition'} type='input' className='boxInput' value={x}  maxLength={2} onChange={(e) => updateNStack(e.currentTarget.value, i)} onKeyDown={(e) => handleNStack(e, i)}/>
            }
        })}
        <select id='newInputHead' title={'new input head at end of transition'} className='boxSelect' value={transition.nInputHead} onChange={(e) => props.onNInputHeadUpdate(transition.id, Number(e.currentTarget.value))}>
            <option key={-1} value={-1}>-1</option>
            <option key={0} value={0}>0</option>
            <option key={1} value={1}>+1</option>
        </select>
    </div>
  )
}
