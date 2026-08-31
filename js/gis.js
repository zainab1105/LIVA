document.addEventListener("DOMContentLoaded", function () {

    const mapElement = document.getElementById("indiaMap");

    if (!mapElement) return;

    const map = L.map("indiaMap", {
        zoomControl: true
    }).setView([22.5937, 78.9629], 5);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "© OpenStreetMap"
        }
    ).addTo(map);


    // PROJECT LOCATIONS

    const projects = window.LandTrack?.projects || [];

    projects.forEach(project => {

        const lat = Number(project.latitude);
        const lng = Number(project.longitude);

        if (!lat || !lng) {
            return;
        }

        let color = "#d97706";

        if (project.risk === "critical") {
            color = "#b94b4b";
        }

        if (project.risk === "high") {
            color = "#c98a22";
        }

        if (project.risk === "medium") {
            color = "#d6a23a";
        }

        if (project.risk === "low") {
            color = "#1f6b63";
        }


        const marker = L.circleMarker([lat, lng], {

            radius: 9,

            fillColor: color,

            color: "#ffffff",

            weight: 3,

            opacity: 1,

            fillOpacity: 1

        }).addTo(map);


        marker.bindPopup(`
            <div style="font-family: Arial; padding: 4px;">
                <strong>${project.name}</strong>
                <br>
                <span>${project.location}</span>
                <br><br>
                Risk: <b>${project.risk.toUpperCase()}</b>
            </div>
        `);

    });


    // IMPORTANT — fixes broken/half map rendering

    setTimeout(() => {
        map.invalidateSize();
    }, 300);

});