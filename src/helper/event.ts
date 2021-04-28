/**
 * Defines functionality around event-handling or the preparation thereof.
 */

/**
 * Executes or registers the given handler for a point of time when the document is fully loaded and constructed.
 * This check is necessary because RequireJS delays the execution of the main script.
 * So a simple DOMContentLoaded listener is added too late most of the time.
 * In case RequireJS is fast enough this will nonetheless prevent the handler from being executed to early.
 * @param {() => void} fun The handler to register or execute.
 */
export function whenReady(fun: () => void): void {
    if (/interactive|complete|loaded/.test(document.readyState)) {
        fun();
    } else {
        document.addEventListener('DOMContentLoaded', fun);
    }
}

/**
 * Turns a button into a file saving operator. Clicking this button will ask the user how to handle a file with the given content.
 * The given button is essentially cloned and replaced.
 * @param {HTMLButtonElement} button The button that should trigger the file handling.
 * @param {string} content The file's content.
 * @param {string} fileName The file's name.
 */
export function saveOnClick(button: HTMLButtonElement, content: string, fileName: string = 'file'): void {
    // remove all event handler first
    let clone: HTMLButtonElement = button.cloneNode(true) as HTMLButtonElement;
    // replace given button with clone
    // if given button isn't added to the document this will not crash but the call will not change anything, so in a way it will fail quietly
    if (button.parentNode)
        button.parentNode.replaceChild(clone, button);
    // instruct content saving
    clone.addEventListener('click', () => {
        let a: HTMLAnchorElement = document.createElement('A') as HTMLAnchorElement;
        a.style.display = 'none';
        a.download = fileName;
        a.href = content;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
    clone.disabled = false;
}
