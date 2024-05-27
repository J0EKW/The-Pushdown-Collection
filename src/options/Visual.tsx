import { useContext, useEffect, useState } from "react"
import '../App.css';
import { OptionContext, OptionDispatchContext } from "../lib/OptionsContext";

type VisualProps = {
    colour: String
}

export const Visual = (props: VisualProps) => {
    const [visible, setVisible] = useState<boolean>(false)
    const [render, setRender] = useState<boolean>(false)
    const [to, setTo] = useState<NodeJS.Timeout>()
    const options = useContext(OptionContext)
    const dispatch = useContext(OptionDispatchContext)
    const [open, setOpen] = useState<string | null>(null)


    const updateVisibility = (visibility: boolean) => {
        document.getElementById('visualOptionList')?.setAttribute('class', props.colour + ' options close')
        if (!visibility) {
            setOpen('close')
            setTo(setTimeout(() => {
                setRender(false)
            }, 690))
        } else {
            setRender(true)
            clearTimeout(to)
            setTimeout(() => {
                document.getElementById('visualOptionList')?.setAttribute('class', props.colour + ' options')
                setOpen('')
            }, 1)
        }
        setVisible(visibility)
    }

    const handleColourScheme = (value: number) => {
        let valueParam = value
        dispatch({
            type: 'set',
            id: 'colourScheme',
            value: valueParam
        })
        updateVisibility(visible)
    }

    return (
        <div id='visualOptionWrapper'>
            <h1 className={props.colour + ' optionHeader'} onClick={() => {updateVisibility(!visible)}}>{'Visual' + (!visible ? ' ▼' : ' ▲')}</h1>
            {render && 
            <div id='visualOptionList' className={props.colour + ' options ' + (open === null ?  'close' : open)}>
                <div id='colourWrapper'>
                    Colour Scheme
                    <select className={props.colour + ' optionsSelect'} value={options['colourScheme'].value} onChange={(x) => {handleColourScheme(Number(x.currentTarget.value))}}>
                        <option value={0}>Light</option>
                        <option value={1}>Dark</option>
                        <option value={2}>Dark Contrast</option>
                        <option value={3}>Light Contrast</option>
                    </select>
                </div>
            </div>}
        </div>
    )
}