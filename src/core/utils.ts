export function addClass(element: any, name: string) {
    if (element.nodeType === 1) {
        if (element.classList) {
            element.classList.add(name);
        } else {
            element.className = element.className ? element.className + ' ' + name : name;
        }

    }
};

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
