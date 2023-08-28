import { useContext, useEffect, useState } from "react"
import '../App.css';
import './options.css';
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

export const Automaton = () => {
    const [collapse, setCollapse] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)

    const updateVisiblity = () => {
        if (!collapse) {
            document.getElementById('automatonOptionList')?.setAttribute('class', 'options close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('automatonOptionList')?.setAttribute('class', 'options')
            }, 1)
        }
        setCollapse(!collapse)
    }

    const handleForceDeterministic = () => {
        dispatch({
            type: 'set',
            id: 'forceDeterministic',
            value: !options['forceDeterministic'].value
        })
    }

    const handleEnableAlternating = () => {
        dispatch({
            type: 'set',
            id: 'enableAlternating',
            value: !options['enableAlternating'].value
        })
    }

    const handleForceVisibly = () => {
        dispatch({
            type: 'set',
            id: 'forceVisibly',
            value: !options['forceVisibly'].value
        })
    }

    const handleHaltCondition = () => {
        dispatch({
            type: 'set',
            id: 'haltCondition',
            value: !options['haltCondition'].value
        })
    }

    const handleStackCount = (value: number) => {
        let valueParam = value
        dispatch({
            type: 'set',
            id: 'stackCount',
            value: valueParam
        })
    }

    const resetStackCount = () => {
        dispatch({
            type: 'reset',
            id: 'stackCount',
            value: undefined
        })
    }

    return (
        <div id='automatonOptionWrapper'>
            <h1 className='optionHeader' onClick={() => {updateVisiblity()}}>{'Automaton' + (collapse ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='automatonOptionList' className='options close'>
                <div id='deterministicWrapper'>
                    Force Determinism <input type='checkbox' checked={options['forceDeterministic'].value} onClick={handleForceDeterministic} />
                </div>
                <div id='alternationWrapper'>
                    Enable Alternation <input type='checkbox' checked={options['enableAlternating'].value} onClick={handleEnableAlternating} />
                </div>
                <div id='visiblyWrapper'>
                    Force Visibly <input type='checkbox' checked={options['forceVisibly'].value} onClick={handleForceVisibly} />
                </div>
                <div id='haltCondWrapper'>
                    Halt Condition <input type='checkbox' checked={options['haltCondition'].value} onClick={handleHaltCondition} />
                </div>
                <div id='stackCountWrapper'>
                    Stack Count
                    <input type='range' min='0' max='2' step='1' value={options['stackCount'].value} onChange={(x) => {handleStackCount(Number(x.currentTarget.value))}} list='values'/>
                    <input type='submit' className='reset' value='↺' onClick={resetStackCount}/>
                </div>
                <datalist id="values">
                    <option value="0" label="0"></option>
                    <option value="1" label="1"></option>
                    <option value="2" label="2"></option>
                </datalist>
            </div>}
        </div>
    )
}