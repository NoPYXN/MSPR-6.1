import React from "react"
import axios from "axios"

export const NumeroPage = async ville => {
    console.log(ville, "VILLE")

    let x = 0
    try {
        let response
        if (ville === "") {
            response = await axios.get(`http://localhost:8080/api/v1/annonces`)
        } else {
            response = await axios.get(`http://localhost:8080/api/v1/annonces?Ville=${ville}`)
        }
        if (response.status === 200) {
            console.log(Math.ceil(response.data.content.length / 5))
            x = Math.ceil(response.data.content.length / 5)
        }
    } catch (error) {
        console.error(error)
    }
    return x
}
