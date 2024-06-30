import { useContext, useEffect, useState } from "react"
import '../App.css';
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

type InputProps = {
    onAlphabetUpdate: Function,
    colour: String
}

export const Input = (props: InputProps) => {
    const [collapse, setCollapse] = useState<boolean>(true)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)

    const updateVisiblity = () => {
        if (!collapse) {
            document.getElementById('inputOptionList')?.setAttribute('class', props.colour + ' options close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('inputOptionList')?.setAttribute('class', props.colour + ' options')
            }, 1)
        }
        setCollapse(!collapse)
    }

    const handleBookendInput = () => {
        
        if (options['bookendInput'].value) {
            props.onAlphabetUpdate('startChar', '', 0)
            props.onAlphabetUpdate('endChar', '', 0)
        } else {
            props.onAlphabetUpdate('startChar', '[', -1)
            props.onAlphabetUpdate('endChar', ']', -1)
        }
        
        dispatch({
            type: 'set',
            id: 'bookendInput',
            value: !options['bookendInput'].value
        })
    }

    return (
        <div id='inputOptionWrapper'>
            <h1 className={props.colour + ' optionHeader'} onClick={() => {updateVisiblity()}}>{'Input' + (collapse ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='inputOptionList' className={props.colour + ' options close'}>
                <div id='bookendWrapper'>
                    Bookend Input <input type='checkbox' checked={options['bookendInput'].value} onClick={handleBookendInput} />
                </div>
            </div>}
        </div>
    )
}