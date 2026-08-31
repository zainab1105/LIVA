/* ============================================================
   LANDTRACK AI
   COMMAND CENTER CONTROLLER
   SIH26017
   ============================================================ */


/* ============================================================
   01. INITIALIZE DASHBOARD
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    initializeDashboard();

});


function initializeDashboard() {

    /*
        Only run dashboard logic when
        dashboard elements are present.
    */

    const dashboard =
        document.querySelector(
            ".dashboard-kpi-grid"
        );

    if (!dashboard) {
        return;
    }


    renderDashboardMetrics();

    renderDelayDrivers();

    renderStageRisk();

    renderPriorityProjects();

    renderMapMarkers();

}


/* ============================================================
   02. DASHBOARD METRICS
   ============================================================ */

function renderDashboardMetrics() {

    if (
        typeof landTrackDashboard ===
        "undefined"
    ) {
        return;
    }


    const metricValues =
        document.querySelectorAll(
            ".dashboard-kpi .kpi-value"
        );


    if (metricValues.length >= 4) {

        metricValues[0].textContent =
            formatDashboardNumber(
                landTrackDashboard.activeProjects
            );


        metricValues[1].textContent =
            formatDashboardNumber(
                landTrackDashboard.highRiskProjects
            );


        metricValues[2].textContent =
            formatDashboardNumber(
                landTrackDashboard.delayedProjects
            );


        metricValues[3].textContent =
            formatLandArea(
                landTrackDashboard.landUnderProcess
            );

    }

}


/* ============================================================
   03. FORMAT DASHBOARD NUMBERS
   ============================================================ */

function formatDashboardNumber(
    value
) {

    return new Intl.NumberFormat(
        "en-IN"
    ).format(value);

}


function formatLandArea(
    hectares
) {

    if (hectares >= 1000) {

        return (
            (hectares / 1000)
                .toFixed(1)
            + "K"
        );

    }

    return formatDashboardNumber(
        hectares
    );

}


/* ============================================================
   04. DELAY DRIVERS
   ============================================================ */

function renderDelayDrivers() {

    if (
        typeof landTrackDelayDrivers ===
        "undefined"
    ) {
        return;
    }


    const container =
        document.querySelector(
            ".delay-drivers-card"
        );


    if (!container) {
        return;
    }


    const driverItems =
        container.querySelectorAll(
            ".driver-item"
        );


    landTrackDelayDrivers
        .slice(0, driverItems.length)
        .forEach(
            (driver, index) => {

                const item =
                    driverItems[index];


                const name =
                    item.querySelector(
                        ".driver-name"
                    );


                const value =
                    item.querySelector(
                        ".driver-value"
                    );


                const fill =
                    item.querySelector(
                        ".driver-fill"
                    );


                if (name) {

                    name.textContent =
                        driver.name;

                }


                if (value) {

                    value.textContent =
                        `${driver.percentage}%`;

                }


                if (fill) {

                    fill.style.width =
                        `${driver.percentage}%`;

                }

            }
        );

}


/* ============================================================
   05. STAGE RISK
   ============================================================ */

function renderStageRisk() {

    if (
        typeof landTrackStageRisk ===
        "undefined"
    ) {
        return;
    }


    const container =
        document.querySelector(
            ".stage-risk-card"
        );


    if (!container) {
        return;
    }


    const stageItems =
        container.querySelectorAll(
            ".stage-item"
        );


    landTrackStageRisk
        .slice(0, stageItems.length)
        .forEach(
            (stage, index) => {

                const item =
                    stageItems[index];


                const name =
                    item.querySelector(
                        ".stage-name"
                    );


                const fill =
                    item.querySelector(
                        ".stage-fill"
                    );


                const value =
                    item.querySelector(
                        ".stage-risk-value"
                    );


                if (name) {

                    name.textContent =
                        stage.stage;

                }


                if (fill) {

                    fill.style.width =
                        `${stage.risk}%`;

                    /*
                        Slightly different
                        visual intensity according
                        to risk.
                    */

                    if (stage.risk >= 70) {

                        fill.style.background =
                            "var(--red)";

                    } else if (
                        stage.risk >= 50
                    ) {

                        fill.style.background =
                            "var(--amber)";

                    } else {

                        fill.style.background =
                            "var(--blue)";

                    }

                }


                if (value) {

                    value.textContent =
                        `${stage.risk}%`;

                }

            }
        );

}


/* ============================================================
   06. PRIORITY PROJECTS
   ============================================================ */

function renderPriorityProjects() {

    if (
        typeof landTrackProjects ===
        "undefined"
    ) {
        return;
    }


    const list =
        document.querySelector(
            ".priority-list"
        );


    if (!list) {
        return;
    }


    /*
        Highest-risk projects first.
    */

    const projects =
        [...landTrackProjects]
            .sort(
                (a, b) =>
                    b.riskScore -
                    a.riskScore
            )
            .slice(0, 5);


    list.innerHTML = "";


    projects.forEach(
        project => {

            const riskClass =
                getDashboardRiskClass(
                    project.riskScore
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "priority-item";


            item.dataset.projectId =
                project.id;


            item.innerHTML = `

                <span
                    class="priority-risk ${riskClass}"
                ></span>


                <div class="priority-info">

                    <p class="priority-project">
                        ${escapeDashboardHTML(
                            project.name
                        )}
                    </p>

                    <p class="priority-location">
                        ${escapeDashboardHTML(
                            project.state
                        )}
                        ·
                        ${escapeDashboardHTML(
                            project.projectType
                        )}
                    </p>

                </div>


                <div class="priority-score">

                    <strong>
                        ${project.riskScore}%
                    </strong>

                    <span>
                        delay risk
                    </span>

                </div>

            `;


            /*
                Clicking a project will eventually
                open its complete AI risk profile.
            */

            item.addEventListener(
                "click",
                () => {

                    openProjectDrawer(projectId);

                }
            );


            item.style.cursor =
                "pointer";


            list.appendChild(
                item
            );

        }
    );


    /*
        Update priority count.
    */

    const count =
        document.querySelector(
            ".priority-count"
        );


    if (count) {

        const highRisk =
            landTrackProjects.filter(
                project =>
                    project.riskScore >= 65
            ).length;


        count.textContent =
            `${String(highRisk).padStart(2, "0")} NEED ACTION`;

    }

}


/* ============================================================
   07. MAP MARKERS
   ============================================================ */

function renderMapMarkers() {

    const map =
        document.querySelector(
            ".risk-map"
        );


    if (!map) {
        return;
    }


    /*
        Existing static markers are kept
        as a visual fallback.

        Real project markers can later be
        generated from GIS coordinates.
    */

    const markers =
        map.querySelectorAll(
            ".map-marker"
        );


    if (!markers.length) {
        return;
    }


    /*
        Assign demo projects to markers.
    */

    const projects =
        [...landTrackProjects]
            .sort(
                (a, b) =>
                    b.riskScore -
                    a.riskScore
            );


    markers.forEach(
        (marker, index) => {

            const project =
                projects[index];

            if (!project) {
                return;
            }


            const riskClass =
                getDashboardRiskClass(
                    project.riskScore
                );


            marker.classList.remove(
                "critical",
                "high",
                "medium",
                "low"
            );


            marker.classList.add(
                riskClass
            );


            marker.title =
                `${project.name} — ${project.riskScore}% delay risk`;


            marker.dataset.projectId =
                project.id;


            marker.addEventListener(
                "click",
                () => {

                    openProjectDrawer(projectId);

                }
            );


            marker.style.cursor =
                "pointer";

        }
    );

}


/* ============================================================
   08. RISK CLASS
   ============================================================ */

function getDashboardRiskClass(
    score
) {

    if (score >= 80) {
        return "critical";
    }

    if (score >= 65) {
        return "high";
    }

    if (score >= 50) {
        return "medium";
    }

    return "low";

}


/* ============================================================
   09. SAFE HTML
   ============================================================ */

function escapeDashboardHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ============================================================
   10. LIVE DATA REFRESH
   ============================================================ */

window.addEventListener(
    "landTrackDataUpdated",
    () => {

        renderDashboardMetrics();

        renderDelayDrivers();

        renderStageRisk();

        renderPriorityProjects();

        renderMapMarkers();

    }
);

