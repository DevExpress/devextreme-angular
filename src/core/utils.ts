export function getElement(element: any) {
    return element.get ? element.get(0) : element;
};

export function clearArrayValue(arr: string[], value: string) {
    arr.forEach((item: string, index: number) => {
        if (item.substring(0, value.length) === value) {
            arr[index] = '';
        }
    });
};

