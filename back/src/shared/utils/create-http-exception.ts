import { HTTPException } from "hono/http-exception";
import { JSONSerializable } from "../types/json.js";
import { ContentfulStatusCode } from "hono/utils/http-status";

type CreateHTTPExceptionOptions = {
    status: number;
    message: string;
    data?: JSONSerializable;
};

export function createHTTPException({
    status,
    message,
    data,
}: CreateHTTPExceptionOptions) {
    const response = new Response(
        JSON.stringify({
            type: "error",
            status,
            message,
            data,
        }),
    );

    return new HTTPException(status as ContentfulStatusCode, {
        message,
        res: response,
    });
}
