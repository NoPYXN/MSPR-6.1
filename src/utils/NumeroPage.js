import React from "react"
import axios from "axios"

export const NumeroPage = async (
    ville,
    isVisiblePublication,
    isVisibleGardiennage,
    isSetAnnonces,
    setAnnonces,
    nbPage,
) => {
    let x = 0
    try {
        let response
        if (ville === "") {
            response = await axios.get(
                `http://localhost:8080/api/v1/annonces?IsVisiblePublication=${isVisiblePublication}&IsVisibleGardiennage=${isVisibleGardiennage}`,
            )
        } else {
            response = await axios.get(
                `http://localhost:8080/api/v1/annonces?Ville=${ville}&IsVisiblePublication=${isVisiblePublication}&IsVisibleGardiennage=${isVisibleGardiennage}`,
            )
        }
        if (response.status === 200) {
            x = Math.ceil(response.data.content.length / 5)
        }
        if (isSetAnnonces) {
            setAnnonces(response.data.content)
        }
        console.log(response)
    } catch (error) {
        console.error(error)
    }

    return x
}

// import React from "react"
// import axios from "axios"

// export const NumeroPage = async (ville) => {
//     let x = 0
//     try {
//         let response
//         if (ville === "") {
//             response = await axios.get(`http://localhost:8080/api/v1/annonces`)
//         } else {
//             response = await axios.get(`http://localhost:8080/api/v1/annonces?Ville=${ville}`)
//         }
//         if (response.status === 200) {
//             x = Math.ceil(response.data.content.length / 5)
//         }
//     } catch (error) {
//         console.error(error)
//     }
//     return x
// }
