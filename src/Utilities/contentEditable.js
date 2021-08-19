//onKeyDown
export const saveContentAfterPressEnter = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        e.target.blur();
    }
};

//select all input when click
export const selectAllInlineText = (e) => {
    e.target.focus();
    e.target.select();
    // document.execCommand('selectAll', false, null);// equal to e.target.select()
};