export type JSONSerializable =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

type JSONArray = Array<JSONSerializable>;
type JSONObject = {
    [key: string]: JSONSerializable;
};
