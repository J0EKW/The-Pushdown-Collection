import { useContext, useEffect, useState } from "react"
import '../App.css';
import './options.css';
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

export const Visual = () => {
    const [collapse, setCollapse] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)


    const updateVisiblity = () => {
        if (!collapse) {
            document.getElementById('visualOptionList')?.setAttribute('class', 'options close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('visualOptionList')?.setAttribute('class', 'options')
            }, 1)
        }
        setCollapse(!collapse)
    }

    const handleColourScheme = (value: number) => {
        let valueParam = value
        dispatch({
            type: 'set',
            id: 'colourScheme',
            value: valueParam
        })
    }

    const handleTextSize = (value: number) => {
        let valueParam = value
        dispatch({
            type: 'set',
            id: 'textSize',
            value: valueParam
        })
    }

    return (
        <div id='visualOptionWrapper'>
            <h1 className='optionHeader' onClick={() => {updateVisiblity()}}>{'Visual' + (collapse ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='visualOptionList' className='options close'>
                <div id='colourWrapper'>
                    Colour Scheme
                    <select className='optionsSelect' value={options['colourScheme'].value} onChange={(x) => {handleColourScheme(Number(x.currentTarget.value))}}>
                        <option value={0}>Light</option>
                        <option value={1}>Dark</option>
                        <option value={2}>High Contrast</option>
                    </select>
                </div>
                <div className='textSizeWrapper'>
                    Text Size <input type='range' min='1' max='3' step='1' value={options['textSize'].value} onChange={(x) => {handleTextSize(Number(x.currentTarget.value))}} list='values'/>
                </div>
                <datalist id="values">
                    <option value="1" label="1"></option>
                    <option value="2" label="2"></option>
                    <option value="3" label="3"></option>
                </datalist>
            </div>}
        </div>
    )
}