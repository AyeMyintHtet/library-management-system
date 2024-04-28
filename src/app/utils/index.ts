"use client"
export const setLocalStorage = (key: string, value:any) => {
    localStorage.setItem(key, JSON.stringify(value));
}
export const getLocalStorage = (key: string) => {
    const data:any = localStorage.getItem(key)
    return JSON.parse(data);
}
export const setClearLocalStorage = ()=>{
    localStorage.clear();
}