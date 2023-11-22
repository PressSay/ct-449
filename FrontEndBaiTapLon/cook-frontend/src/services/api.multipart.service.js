import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
    },
};

export default (baseURL, token = "") => {
    return (token == "") ? axios.create({
        baseURL,
        ...commonConfig,
    }) : axios.create({
        baseURL,
        headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            'Authorization': `bearer ${token}`
        }
    }) ;
};