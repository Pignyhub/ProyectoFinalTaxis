document.addEventListener("DOMContentLoaded", function () {
    const paradasList = document.getElementById("listaParadas");

    axios.get("static/datos.json")
        .then(response => {
            const paradas = response.data.features;
            const map = L.map("map").setView([36.7212, -4.4218], 13); 

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© OpenStreetMap'
            }).addTo(map);

            const markers = [];
            
            //blucle para recorrer las paradas
            paradas.forEach(parada => {
                const coordenadas = parada.geometry.coordinates;
                const nombre = parada.properties.NOMBRE;
                const direccion = parada.properties.DIRECCION;

               //Colocamos marcadores
                const marcador = L.marker([coordenadas[1], coordenadas[0]]);
                marcador.bindPopup(`<b>${nombre}</b><br>${direccion}`);
                markers.push(marcador);

               //Escribimos la lista de paradas de Taxis
                const listaTaxis = document.createElement("li");
                listaTaxis.innerHTML = `<strong>${nombre}</strong><br><br>${direccion}`;
                paradasList.appendChild(listaTaxis);

               //hacemos que al clickear algun elemento de la lista, se centre y haga zoom en su respectivo marcador
                listaTaxis.addEventListener("click", () => {
                    map.setView([coordenadas[1], coordenadas[0]], 20);
                    marcador.openPopup();
                });
            });

            const markerGroup = L.layerGroup(markers);
            markerGroup.addTo(map);
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
        });
});