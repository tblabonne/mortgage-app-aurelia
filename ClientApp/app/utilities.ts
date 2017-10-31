import { computedFrom as originalComputedFrom } from "aurelia-framework";

// Compares two objects to see if each property in the object is equal (referentially).
export function areEqual(obj1: any, obj2: any) {
    return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
}

// Makes a deep copy of the specified object.
export function deepCopy(value: any) {
    return JSON.parse(JSON.stringify(value));
}

// type-safe version of aurelia's computedFrom decorator
export function computedFrom<T>(...rest: Array<keyof T>) {
    return originalComputedFrom(...rest);
}
