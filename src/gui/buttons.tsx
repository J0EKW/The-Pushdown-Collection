
type GuiButtonsProps = {
    interactMode: number,
    onInteractModeUpdate: Function
}

export const GuiButtons = (props: GuiButtonsProps) => {
    return (
        <div id='container'>
            <div id="guiButtonsWrapper">
                <input type='button' title='Click & Drag' className={'guiButton' + (props.interactMode === 0 ? ' clicked': '')} onClick={() => {props.onInteractModeUpdate(0)}} value='🖱️'/>
                <input type='button' title='Add State' className={'guiButton' + (props.interactMode === 1 ? ' clicked': '')} onClick={() => {props.onInteractModeUpdate(1)}} value='⚪️'/>
                <input type='button' title='Add Transition' className={'guiButton' + (props.interactMode === 2 ? ' clicked': '')} onClick={() => {props.onInteractModeUpdate(2)}} value='↗️'/>
                <input type='button' title='remove' className={'guiButton' + (props.interactMode === 3 ? ' clicked': '')} onClick={() => {props.onInteractModeUpdate(3)}} value='❌'/>
            </div>
        </div>
    )
}