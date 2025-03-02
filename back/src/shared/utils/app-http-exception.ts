import { HTTPException } from "hono/http-exception";
import { JSONSerializable } from "../types/json.js";
import { ContentfulStatusCode } from "hono/utils/http-status";

type AppHTTPExceptionOptions = {
    status: number;
    message: string;
    details?: JSONSerializable;
};

export class AppHTTPException extends HTTPException {
    constructor(options: AppHTTPExceptionOptions) {
        const response = new Response(
            JSON.stringify({
                type: "error",
                status: options.status,
                message: options.message,
                details: options.details,
            }),
        );

        super(options.status as ContentfulStatusCode, {
            message: options.message,
            res: response,
        });
    }
}
