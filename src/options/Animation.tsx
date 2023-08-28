import { useContext, useEffect, useState } from "react"
import '../App.css';
import './options.css';
import { OptionsType } from "../types";
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

export const Animation = () => {
    const [collapse, setCollapse] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)

    const updateVisiblity = () => {
        if (!collapse) {
            document.getElementById('animOptionList')?.setAttribute('class', 'options close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('animOptionList')?.setAttribute('class', 'options')
            }, 1)
        }
        setCollapse(!collapse)
    }

    const handleAnimationOn = () => {
        dispatch({
            type: 'set',
            id: 'animationOn',
            value: !options['animationOn'].value
        })
    }

    const handleAnimationSpeed = (value: number) => {
        let valueParam = value
        dispatch({
            type: 'set',
            id: 'animationSpeed',
            value: valueParam
        })
    }

    const resetAnimationSpeed = () => {
        dispatch({
            type: 'reset',
            id: 'animationSpeed',
            value: undefined
        })
    }

    return (
        <div className='optionAnimationWrapper'>
            <h1 className='optionHeader' onClick={() => {updateVisiblity()}}>{'Animation' + (collapse ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='animOptionList' className='options close'>
                <div className='enableWrapper'>
                    Enabled <input type='checkbox' checked={options['animationOn'].value} onClick={handleAnimationOn}/>
                </div>
                <div className='speedWrapper'>
                    Speed 
                    <input type='range' min='0.5' max='3' step='0.1' value={options['animationSpeed'].value} onChange={(x) => {handleAnimationSpeed(Number(x.currentTarget.value))}} list='values'/>
                    <input type='submit' className='reset' value='↺' onClick={resetAnimationSpeed}/>
                </div>
                <datalist id="values">
                    <option value="0.5" label="0.5"></option>
                    <option value="1" label="1"></option>
                    <option value="3" label="3"></option>
                </datalist>
            </div>}
        </div>
    )
}