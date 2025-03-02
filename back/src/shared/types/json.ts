export type JSONSerializable =
    | string
    | number
    | boolean
    | null
    | JSONObject
    | JSONArray;

type JSONArray = Array<JSONSerializable>;
type JSONObject = {
    [key: string]: JSONSerializable;
};
