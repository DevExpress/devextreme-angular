export function hasClass(element: any, name: string) {
    let result;

    if (element.classList) {
        result = element.classList.contains(name);
    } else {
        result = element.className.split(' ').indexOf(name) >= 0;
    }

    return result;
};

export function getElement(element: any) {
    return element.get ? element.get(0) : element;
};

export function removeElement(element: any) {
    let node = getElement(element),
        parentNode = node && node.parentNode;
        if (parentNode) {
            parentNode.removeChild(node);
        }
};
