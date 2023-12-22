import Ajv from "https://esm.sh/ajv@8.12.0";
import addFormats from "https://esm.sh/ajv-formats@2.1.1";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export default ajv;
