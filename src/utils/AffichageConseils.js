export const sortDateConseils = (a, b) => {
    var dateA = new Date(
        a.DateCreation.replace(
            /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
            "$3-$1-$2T$4:$5:$6",
        ),
    )
    var dateB = new Date(
        b.DateCreation.replace(
            /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
            "$3-$1-$2T$4:$5:$6",
        ),
    )
    return dateB - dateA
}
