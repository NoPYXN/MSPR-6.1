const OPTIONS = {
    styles: [
        {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [
                {
                    color: "black",
                },
            ],
        },
        // // Enlever les noms des villes et pays
        // {
        //     featureType: "administrative",
        //     elementType: "labels",
        //     stylers: [
        //         {
        //             visibility: "off",
        //         },
        //     ],
        // },
        // Masquer les routes et les lignes
        {
            featureType: "road",
            elementType: "geometry",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
    ],
    // draggable: false,
    // zoomControl: false,
    // disableDefaultUI: true,
}

export default OPTIONS
