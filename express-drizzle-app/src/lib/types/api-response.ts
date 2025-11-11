class ResponseType {
    readonly status: boolean;
    readonly message: string;
    readonly data: any;
    constructor(status: boolean, message: string, data: any){
        this.status = status,
        this.message = message,
        this.data = data
    }
}

const send = (data: any = null) => {
    return new ResponseType(true, "Request complete succcessfully", data)
}

const failed = (message = "failed to process your request") => {
    return new ResponseType(false, message, null);
}

export const ApiResponse = {
    send,
    failed,
}