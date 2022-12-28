export type Action<T> = {
    type: string
    payload?:T
}

export const isType = <T>(obj: any, ...keys:(keyof T)[]): obj is T  => {
    for(let key of keys) {
        if(obj[key] === null || obj[key] === undefined) return false
    }
    return true
}