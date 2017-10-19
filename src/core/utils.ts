export class Utils {
    public static addClass(element: any, name: string) {
        if (element.nodeType === 1) {
            if (element.classList) {
                element.classList.add(name);
            } else {
                element.className = element.className ? element.className + ' ' + name : name;
            }
        }
    };

    public static getElement(element: any) {
         return element.get ? element.get(0) : element;
    };
}
