/**
 * This is a self-executing instruction that has to be included in order to handle expandable elements.
 */
document.addEventListener('DOMContentLoaded', () => {
    let instructions: HTMLCollectionOf<Element> = document.getElementsByClassName('expandable');
    for (let i: number = 0; i < instructions.length; i++) {
        if (instructions[i] instanceof HTMLElement) {
            let instruction: HTMLElement = instructions[i] as HTMLElement;
            let header: HTMLElement | null = document.getElementById(instruction.id + '-header');
            if (header) {
                instruction.style.display = 'none';
                header.addEventListener('click', () => instruction.style.display = instruction.style.display ? '' : 'none');
            }
        }
    }
});
