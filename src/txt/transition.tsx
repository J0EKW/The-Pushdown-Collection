import React, { useEffect, useState } from 'react'
import { Transition } from '../types'
import { useContext } from 'react'
import { OptionContext } from '../lib/OptionsContext'

type TransitionProps = {
    transition: Transition,
    index: number,
    cState: string,
    nState: string,
    colour: string,
    stackCount: number,
    alphabet: {[id: string]: string[]},
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
    const options = useContext(OptionContext)

    const handleCInput= (e: any) => {
        props.onCInputUpdate(transition.id, e)
        setCInput(e)
    }

    const handleCState = (e: any) => {
        if (e.key === 'Enter') {
            props.onCStateUpdate(transition.id, cState)
            setCState(props.cState)
        }
    }

    const handleNState = (e: any) => {
        if (e.key === 'Enter') {
            props.onNStateUpdate(transition.id, nState)
            setNState(props.nState)
        }
    }

    const handleCStack = (e: any, index: number) => {
        if (e.key === 'Enter') {
            props.onCStackUpdate(transition.id, cStack[index], index)
            setCStack(props.transition.cStack)
        }
    }

    const handleNStack = (e: any, index: number) => {
        if (e.key === 'Enter') {
            props.onNStackUpdate(transition.id, nStack[index], index)
            setNStack(props.transition.nStack)
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

    useEffect(() => {
        setCInput(props.transition.cInput)
        setCStack(props.transition.cStack)
        setNStack(props.transition.nStack)
    }, [props])

    return (
    <div id={'transition' + transition.id} className={props.colour + ' transition show'}>
        <input id='removeTransition' title={'Remove transition'} type= 'submit' className={props.colour + ' remove'} value='&times;' onClick={() => {props.onRemove(transition.id)}}/>
        <input id='currentState' title={'State at start of transition'} type='input' className={props.colour + ' boxInput'} value={cState} onChange={(e) => setCState(e.currentTarget.value)} onKeyDown={(e) => handleCState(e)}/>
        <select id='currentInput' title={'Input at start of transition'} className={props.colour + ' boxSelect'} value={cInput} onChange={(e) => handleCInput(e.currentTarget.value)} >
            {props.alphabet['allChar'].map((x, i) => {return(
                <option key={i} value={x}>{x}</option>
            )})}
        </select>
        {cStack.map((x, i) => {
            if (i < props.stackCount) {
                return (<input key={i} id={'currentStack' + i} title={'Popped Value of Stack ' + Number(i + 1) + ' at start of transition'} type='input' className={props.colour + ' boxInput'} value={x}  maxLength={1} onChange={(e) => updateCStack(e.currentTarget.value, i)} onKeyDown={(e) => handleCStack(e, i)}/>)
            }
        })}
        <input id='newState' title={'State at end of transition'} type='input' className={props.colour + ' boxInput'} value={nState} onChange={(e) => setNState(e.currentTarget.value)} onKeyDown={(e) => handleNState(e)}/>
        {nStack.map((x, i) => {
            if (i < props.stackCount) {
                return <input key={i} id={'newStack' + i} title={'Values to push to Stack ' + Number(i + 1) + ' at end of transition'} type='input' className={props.colour + ' boxInput'} value={x}  maxLength={2} onChange={(e) => updateNStack(e.currentTarget.value, i)} onKeyDown={(e) => handleNStack(e, i)}/>
            }
        })}
        <select id='newInputHead' title={'new input head at end of transition'} className={props.colour + ' boxSelect'} value={transition.nInputHead} onChange={(e) => props.onNInputHeadUpdate(transition.id, Number(e.currentTarget.value))}>
            <option key={-1} value={-1}>-1</option>
            <option key={0} value={0}>0</option>
            <option key={1} value={1}>+1</option>
        </select>
    </div>
  )
}
