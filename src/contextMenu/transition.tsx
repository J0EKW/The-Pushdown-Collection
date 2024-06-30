import { useContext, useEffect, useState } from "react";
import { Transition } from "../types";
import { OptionContext } from "../lib/OptionsContext";

type CMTransitionProps = {
    colour: String,
    top: number,
    left: number,
    transition: Transition,
    cState: string,
    nState: string,
    alphabet: {[id: string]: string[]},
    onRemove: Function,
    onCInputUpdate: Function,
    onCStateUpdate: Function,
    onNStateUpdate: Function,
    onCStackUpdate: Function,
    onNStackUpdate: Function,
    onNInputHeadUpdate: Function
}

export const CMTransition = (props: CMTransitionProps) => {

    const [cState, setCState] = useState<string>(props.cState)
    const [nState, setNState] = useState<string>(props.nState)
    const [cStack, setCStack] = useState<string[]>(props.transition.cStack)
    const [nStack, setNStack] = useState<string[]>(props.transition.nStack)
    const [cInput, setCInput] = useState<string>(props.transition.cInput)
    const options = useContext(OptionContext)

    const handleCInput= (e: any) => {
        if (e !== '') {
            props.onCInputUpdate(props.transition.id, e)
            setCInput(e)
        }
    }

    const handleCState = (e: any) => {
        if (e.key === 'Enter') {
            props.onCStateUpdate(props.transition.id, cState)
        }
    }

    const handleNState = (e: any) => {
        if (e.key === 'Enter') {
            props.onNStateUpdate(props.transition.id, nState)
        }
    }

    const handleCStack = (e: any, index: number) => {
        if (e.key === 'Enter') {
            props.onCStackUpdate(props.transition.id, cStack[index], index)
        }
    }

    const handleNStack = (e: any, index: number) => {
        if (e.key === 'Enter') {
            props.onNStackUpdate(props.transition.id, nStack[index], index)
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
        <div id='contextMenu' className={props.colour + ' contextMenu reveal'} style={{left: props.left, top: props.top}} >
            <div className={props.colour + ' contextMenuLabel'}>cState <input className={props.colour + ' contextMenuInput'} type='text' value={cState} onChange={(e) => setCState(e.currentTarget.value)} onKeyDown={(e) => handleCState(e)}/></div>
            <div className={props.colour + ' contextMenuLabel'}>
                cInput 
                <select className={props.colour + ' contextMenuInput'} value={cInput} onChange={(e) => handleCInput(e.currentTarget.value)} >
                    <option key={-1} value={''}></option>
                    {props.alphabet['allChar'].map((x, i) => {return(
                        <option key={i} value={x}>{x}</option>
                    )})}
                </select>
            </div>
            {props.transition.cStack.map((x, i) => {
                if (i < options['stackCount'].value) {
                    return(<div key={i} className={props.colour + ' contextMenuLabel'}>{'cStack ' + String(i + 1)} <input className='contextMenuInput' type='text' value={cStack[i]}  maxLength={1} onChange={(e) => updateCStack(e.currentTarget.value, i)} onKeyDown={(e) => handleCStack(e, i)}/></div>)
                }
            })}
            <div className='contextMenuLabel'>nState <input className={props.colour + ' contextMenuInput'} type='text' value={nState} onChange={(e) => setNState(e.currentTarget.value)} onKeyDown={(e) => handleNState(e)}/></div>
            {props.transition.nStack.map((x, i) => {
                if (i < options['stackCount'].value) {
                    return(<div key={i} className={props.colour + ' contextMenuLabel'}>{'nStack ' + String(i + 1)} <input className='contextMenuInput' type='text' value={nStack[i]}  maxLength={2} onChange={(e) => updateNStack(e.currentTarget.value, i)} onKeyDown={(e) => handleNStack(e, i)}/></div>)
                }
            })}
            <div className={props.colour + ' contextMenuLabel'}>nInputHead
            <select className={props.colour + ' contextMenuSelect'} value={props.transition.nInputHead} onChange={(e) => props.onNInputHeadUpdate(props.transition.id, Number(e.currentTarget.value))}>
                <option key={-1} value={-1}>-1</option>
                <option key={0} value={0}>0</option>
                <option key={1} value={1}>+1</option>
            </select></div>
            <input className={props.colour + ' contextMenuButton'} type='button' value='Remove' onClick={() => {props.onRemove(props.transition.id)}}/>
        </div>
    )
}