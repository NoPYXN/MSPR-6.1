export const convertirDateCalendrier = dateString => {
    const date = new Date(dateString)

    const jour = ("0" + date.getDate()).slice(-2)
    const mois = ("0" + (date.getMonth() + 1)).slice(-2)
    const annee = date.getFullYear()

    return `${jour}/${mois}/${annee}`
}
