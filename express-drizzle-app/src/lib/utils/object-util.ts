const requireNotNullElse = (arg1: any, arg2: any) => {
    if(arg1) return arg1;
    return arg2
}

export const ObjectUtil = {
    requireNotNullElse
}