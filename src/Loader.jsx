import React from "react";

import { PuffLoader } from "react-spinners";


export const Loader = () => {

    let loaderCSS = `
        display: block;
        margin: 0 auto;
        border-color: red;
        text-align: center;
        margin-top: 16px;
        padding: 8px;
        border: 0;
        border-radius: 5px;
    `;

    return (
    <div className="loaderText">
        Tu saludo se está enviando...
        <PuffLoader css={loaderCSS} color="grey" speedMultiplier="2" />
    </div>
    )

}