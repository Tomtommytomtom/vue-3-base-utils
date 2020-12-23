export const debounce = <F extends Function>(func: F, wait:number, immediate:boolean) => {
    let timeout: number|null;

    return <any>function executedFunction(this: any) {
        const context = this;
        const args = arguments;
            
        const later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
        };

        var callNow = immediate && !timeout;
        
        if(timeout){
            clearTimeout(timeout);
        }

        timeout = setTimeout(later, wait);
        
        if (callNow) func.apply(context, args);
    };
};

export const shuffle = <T>(array: T[]) =>{
    let result = array;
    for(let i = array.length - 1; i >= 0; i--){
        let j = Math.floor(Math.random() * i)
        let tmp = result[i]
        result[i] = result[j]
        result[j] = tmp
    }
    return result
}