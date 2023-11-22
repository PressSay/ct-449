import axios from "axios";

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export default (baseURL, token = "") => {
    return (token == "") ? axios.create({
        baseURL,
        ...commonConfig,
    }) : axios.create({
        baseURL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            'Authorization': `bearer ${token}`
        }
    }) ;
};