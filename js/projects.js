/* ============================================================
   LANDTRACK AI
   PROJECT PORTFOLIO CONTROLLER
   SIH26017
   ============================================================ */


/* ============================================================
   01. STATE
   ============================================================ */

let projects = [];

let filteredProjects = [];

let currentFilters = {
    search: "",
    state: "all",
    risk: "all",
    stage: "all"
};


/* ============================================================
   02. INITIALIZE
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeProjectsPage();

    }
);


function initializeProjectsPage() {

    if (
        !document.getElementById(
            "projectsTableBody"
        )
    ) {
        return;
    }


    /*
        Load saved projects first.
        If nothing has been added yet,
        the demo dataset is used.
    */

    projects =
        loadProjects();


    filteredProjects =
        [...projects];


    populateFilters();

    renderProjectSummary();

    renderProjectsTable();

    initializeSearch();

    initializeFilters();

    initializeAddProject();

    initializeExport();

}


/* ============================================================
   03. LOAD PROJECTS
   ============================================================ */

function loadProjects() {

    const saved =
        localStorage.getItem(
            "landTrackProjects"
        );

    if (saved) {

        try {

            const parsed =
                JSON.parse(saved);

            if (
                Array.isArray(parsed) &&
                parsed.length > 0
            ) {

                return parsed;

            }

        } catch (error) {

            console.error(
                "Could not load saved projects.",
                error
            );

        }

    }


    /* Use central LandTrack data */

    if (
        window.LandTrack &&
        Array.isArray(
            window.LandTrack.projects
        )
    ) {

        return [
            ...window.LandTrack.projects
        ];

    }


    return [];

}

/* ============================================================
   04. SAVE PROJECTS
   ============================================================ */

function saveProjectData() {

    localStorage.setItem(
        "landTrackProjects",
        JSON.stringify(projects)
    );


    /*
        Tell other modules that
        project data changed.
    */

    window.dispatchEvent(
        new CustomEvent(
            "landTrackDataUpdated"
        )
    );

}


/* ============================================================
   05. POPULATE FILTERS
   ============================================================ */

function populateFilters() {

    const stateFilter =
        document.getElementById(
            "stateFilter"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    if (stateFilter) {

        const states =
            [
                ...new Set(
                    projects.map(
                        project =>
                            project.state
                    )
                )
            ]
            .filter(Boolean)
            .sort();


        states.forEach(
            state => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    state;

                option.textContent =
                    state;


                stateFilter.appendChild(
                    option
                );

            }
        );

    }


    if (stageFilter) {

        const stages =
            [
                ...new Set(
                    projects.map(
                        project =>
                            project.aquisitionStage
                    )
                )
            ]
            .filter(Boolean)
            .sort();


        stages.forEach(
            stage => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    stage;

                option.textContent =
                    stage;


                stageFilter.appendChild(
                    option
                );

            }
        );

    }

}


/* ============================================================
   06. SEARCH
   ============================================================ */

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "projectSearch"
        );


    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        event => {

            currentFilters.search =
                event.target.value
                    .trim()
                    .toLowerCase();


            applyFilters();

        }
    );

}


/* ============================================================
   07. FILTERS
   ============================================================ */

function initializeFilters() {

    const stateFilter =
        document.getElementById(
            "stateFilter"
        );


    const riskFilter =
        document.getElementById(
            "riskFilter"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    const clearButton =
        document.getElementById(
            "clearFilters"
        );


    if (stateFilter) {

        stateFilter.addEventListener(
            "change",
            event => {

                currentFilters.state =
                    event.target.value;

                updateFilterVisual(
                    stateFilter
                );

                applyFilters();

            }
        );

    }


    if (riskFilter) {

        riskFilter.addEventListener(
            "change",
            event => {

                currentFilters.risk =
                    event.target.value;

                updateFilterVisual(
                    riskFilter
                );

                applyFilters();

            }
        );

    }


    if (stageFilter) {

        stageFilter.addEventListener(
            "change",
            event => {

                currentFilters.stage =
                    event.target.value;

                updateFilterVisual(
                    stageFilter
                );

                applyFilters();

            }
        );

    }


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            clearFilters
        );

    }

}


/* ============================================================
   08. APPLY FILTERS
   ============================================================ */

function applyFilters() {

    filteredProjects =
        projects.filter(
            project => {


                /*
                    Search across the most
                    useful project fields.
                */

                const searchableText = [

                    project.name,

                    project.id,

                    project.state,

                    project.district,

                    project.authority,

                    project.projectType,

                    project.status

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !currentFilters.search ||
                    searchableText.includes(
                        currentFilters.search
                    );


                const matchesState =
                    currentFilters.state ===
                        "all" ||
                    project.state ===
                        currentFilters.state;


                const projectRisk =
                    window.LandTrack.helpers.riskLabel(
                        project.riskScore
                    );

                const matchesRisk =
                    currentFilters.risk === "all" ||
                    projectRisk === currentFilters.risk;


                const matchesStage =
                    currentFilters.stage ===
                        "all" ||
                    project.status ===
                        currentFilters.stage;


                return (
                    matchesSearch &&
                    matchesState &&
                    matchesRisk &&
                    matchesStage
                );

            }
        );


    renderProjectsTable();

}


/* ============================================================
   09. CLEAR FILTERS
   ============================================================ */

function clearFilters() {

    currentFilters = {
        search: "",
        state: "all",
        risk: "all",
        stage: "all"
    };


    const search =
        document.getElementById(
            "projectSearch"
        );


    const state =
        document.getElementById(
            "stateFilter"
        );


    const risk =
        document.getElementById(
            "riskFilter"
        );


    const stage =
        document.getElementById(
            "stageFilter"
        );


    if (search) {
        search.value = "";
    }


    if (state) {
        state.value = "all";
    }


    if (risk) {
        risk.value = "all";
    }


    if (stage) {
        stage.value = "all";
    }


    [
        state,
        risk,
        stage
    ].forEach(
        element => {

            if (element) {

                element.classList.remove(
                    "filter-active"
                );

            }

        }
    );


    filteredProjects =
        [...projects];


    renderProjectsTable();

}


/* ============================================================
   10. FILTER VISUAL
   ============================================================ */

function updateFilterVisual(
    select
) {

    if (!select) {
        return;
    }


    if (select.value !== "all") {

        select.classList.add(
            "filter-active"
        );

    } else {

        select.classList.remove(
            "filter-active"
        );

    }

}


/* ============================================================
   11. SUMMARY
   ============================================================ */

function setDetail(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value ?? "Not available";
    }
}


function renderProjectSummary(project) {
    // your existing code
}

function renderProjectSummary() {

    const total =
        projects.length;


    const highRisk =
        projects.filter(
            project =>
                project.riskScore >= 65
        ).length;


    const atRisk =
        projects.filter(
            project =>
                project.status === "At Risk"
        ).length;


    const onTrack =
        projects.filter(
            project =>
                project.status === "On Track"
        ).length;


    setDetail(
        "totalProjects",
        total
    );


    setDetail(
        "highRiskProjects",
        highRisk
    );


    setDetail(
        "atRiskProjects",
        atRisk
    );


    setDetail(
        "onTrackProjects",
        onTrack
    );

}


/* ============================================================
   12. TABLE RENDERING
   ============================================================ */

function renderProjectsTable() {

    const tbody =
        document.getElementById(
            "projectsTableBody"
        );


    const emptyState =
        document.getElementById(
            "projectEmptyState"
        );


    const resultInfo =
        document.getElementById(
            "tableResultInfo"
        );


    const portfolioCount =
        document.getElementById(
            "portfolioCount"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (
        filteredProjects.length ===
        0
    ) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );

        }


        if (resultInfo) {

            resultInfo.textContent =
                "No projects match the current filters.";

        }


        if (portfolioCount) {

            portfolioCount.textContent =
                "0 projects";

        }


        return;

    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );

    }


    filteredProjects.forEach(
        project => {

            tbody.appendChild(
                createProjectRow(
                    project
                )
            );

        }
    );


    if (resultInfo) {

        resultInfo.textContent =
            `Showing ${filteredProjects.length} of ${projects.length} projects`;

    }


    if (portfolioCount) {

        portfolioCount.textContent =
            `${filteredProjects.length} projects`;

    }

}


/* ============================================================
   13. CREATE PROJECT ROW
   ============================================================ */

function createProjectRow(
    project
) {

    const row =
        document.createElement(
            "tr"
        );


    const riskClass =
        getProjectRiskClass(
            project.riskScore
        );


    const statusClass =
        getStatusClass(
            project.status
        );


    row.innerHTML = `

        <td>

            <div class="project-name-cell">

                <span class="project-name">
                    ${escapeProjectHTML(
                        project.name
                    )}
                </span>

                <span class="project-id">
                    ${escapeProjectHTML(
                        project.id
                    )}
                </span>

            </div>

        </td>


        <td>

            <div class="project-location-cell">

                <span class="project-state">
                    ${escapeProjectHTML(
                        project.state
                    )}
                </span>

                <span class="project-district">
                    ${escapeProjectHTML(
                        project.district
                    )}
                </span>

            </div>

        </td>


        <td>

            <span class="project-stage">
                ${escapeProjectHTML(
                    project.status ||
                    "—"
                )}
            </span>

        </td>


        <td>

            <div class="project-progress">

                <div class="project-progress-top">

                    <span class="project-progress-value">
                        ${Number(
                            project.progress || 0
                        )}%
                    </span>

                </div>

                <div class="project-progress-track">

                    <div
                        class="project-progress-fill"
                        style="width: ${Number(
                            project.progress || 0
                        )}%"
                    ></div>

                </div>

            </div>

        </td>


        <td>

            <span
                class="status-badge ${getRiskBadgeClass(
                    project.riskScore
                )}"
            >
                ${getRiskText(
                    project.riskScore
                )}
            </span>

        </td>


        <td>

            <span class="delay-days">
                ${Number(
                    project.predictedDelayDays || 0
                )} days
            </span>

            <span class="delay-label">
                predicted
            </span>

        </td>


        <td>

            <span
                class="status-badge ${statusClass}"
            >
                ${escapeProjectHTML(
                    project.status ||
                    "Monitoring"
                )}
            </span>

        </td>


        <td>

            <button
                class="project-action-button"
                data-project-id="${escapeProjectHTML(
                    project.id
                )}"
            >
                View
            </button>

        </td>

    `;


    const viewButton =
        row.querySelector(
            ".project-action-button"
        );


    viewButton.addEventListener("click", () => {
    const projectId = viewButton.dataset.projectId;
    openProjectDrawer(projectId);
});


/* ============================================================
   14. RISK HELPERS
   ============================================================ */

function getProjectRiskClass(
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


function getRiskBadgeClass(
    score
) {

    if (score >= 80) {
        return "status-critical";
    }

    if (score >= 65) {
        return "status-high";
    }

    if (score >= 50) {
        return "status-medium";
    }

    return "status-low";

}


function getRiskText(
    score
) {

    if (score >= 80) {
        return "Critical";
    }

    if (score >= 65) {
        return "High";
    }

    if (score >= 50) {
        return "Medium";
    }

    return "Low";

}


function getStatusClass(
    status
) {

    switch (status) {

        case "At Risk":
            return "status-high";

        case "On Track":
            return "status-low";

        case "Delayed":
            return "status-critical";

        case "Monitoring":
            return "status-medium";

        default:
            return "status-neutral";

    }

}


/* ============================================================
   15. ADD PROJECT
   ============================================================ */

function initializeAddProject() {

    const openButton =
        document.getElementById(
            "addProjectButton"
        );


    const modal =
        document.getElementById(
            "projectModal"
        );


    const closeButton =
        document.getElementById(
            "closeProjectModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelProject"
        );


    const form =
        document.getElementById(
            "addProjectForm"
        );


    if (
        !openButton ||
        !modal ||
        !form
    ) {
        return;
    }


    openButton.addEventListener(
        "click",
        () => {

            openProjectModal();

        }
    );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeProjectModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeProjectModal
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeProjectModal();

            }

        }
    );


    form.addEventListener(
        "submit",
        handleAddProject
    );

}


/* ============================================================
   16. OPEN MODAL
   ============================================================ */

function openProjectModal() {

    const modal =
        document.getElementById(
            "projectModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        "hidden"
    );


    document.body.style.overflow =
        "hidden";


    const firstInput =
        modal.querySelector(
            "input"
        );


    if (firstInput) {

        setTimeout(
            () => firstInput.focus(),
            100
        );

    }

}


/* ============================================================
   17. CLOSE MODAL
   ============================================================ */

function closeProjectModal() {

    const modal =
        document.getElementById(
            "projectModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add(
        "hidden"
    );


    document.body.style.overflow =
        "";


    const form =
        document.getElementById(
            "addProjectForm"
        );


    if (form) {

        form.reset();

    }

}


/* ============================================================
   18. ADD PROJECT FORM
   ============================================================ */

function handleAddProject(
    event
) {

    event.preventDefault();


    const form =
        event.target;


    const formData =
        new FormData(form);


    const name =
        formData.get(
            "name"
        )?.trim();


    const state =
        formData.get(
            "state"
        )?.trim();


    const district =
        formData.get(
            "district"
        )?.trim();


    const projectType =
        formData.get(
            "projectType"
        );


    if (
        !name ||
        !state ||
        !district ||
        !projectType
    ) {

        showToast(
            "Please complete all required fields.",
            "warning"
        );

        return;

    }


    /*
        Generate a prototype project ID.
    */

    const projectNumber =
        String(
            projects.length + 1
        ).padStart(
            3,
            "0"
        );


    /*
        For the prototype, the initial
        risk is generated from the selected
        risk level.

        In the production version, this
        would be replaced by the ML model.
    */

    const riskLevel =
        formData.get(
            "riskLevel"
        ) || "Medium";


    const riskScores = {

        Low: 38,

        Medium: 57,

        High: 72,

        Critical: 86

    };


    const riskScore =
        riskScores[
            riskLevel
        ] || 57;


    const newProject = {

        id:
            `LT-2026-${projectNumber}`,

        name,

        projectType,

        state,

        district,

        authority:
            formData.get(
                "authority"
            )?.trim() ||
            "Pending assignment",

        landArea:
            Number(
                formData.get(
                    "landArea"
                )
            ) || 0,

        affectedFamilies:
            Number(
                formData.get(
                    "affectedFamilies"
                )
            ) || 0,

        acquisitionStage:
            formData.get(
                "acquisitionStage"
            ) || "Notification",

        progress: 10,

        riskScore,

        riskLevel,

        delayProbability:
            riskScore,

        predictedDelayDays:
            Math.round(
                riskScore * 1.5
            ),

        status:
            riskScore >= 65
                ? "At Risk"
                : "Monitoring",

        compensationStatus: 0,

        approvalStatus: 0,

        legalDisputes: 0,

        documentationStatus: 50,

        possessionStatus: 0,

        rehabilitationStatus: 0,

        stakeholderResponsiveness: 50,

        historicalPerformance: 50,

        latitude: 20.59,

        longitude: 78.96,

        primaryDelayDriver:
            "Initial assessment",

        delayDrivers: [
            "Initial project assessment"
        ],

        recommendation:
            "Complete project data collection for a more accurate AI risk prediction.",

        lastUpdated:
            new Date()
                .toLocaleDateString(
                    "en-IN"
                )

    };


    projects.push(
        newProject
    );


    saveProjectData();


    /*
        Update everything immediately.
    */

    populateNewFilterValues();

    applyFilters();

    function setDetail(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent =
                value ?? "Not available";
        }
    }

    renderProjectSummary();

    closeProjectModal();


    showToast(
        `${name} added to the project portfolio.`,
        "success"
    );

}


/* ============================================================
   19. UPDATE FILTER OPTIONS
   ============================================================ */

function populateNewFilterValues() {

    const stateFilter =
        document.getElementById(
            "stateFilter"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    if (stateFilter) {

        const existing =
            new Set(
                [
                    ...stateFilter.options
                ].map(
                    option =>
                        option.value
                )
            );


        projects
            .map(
                project =>
                    project.state
            )
            .filter(Boolean)
            .forEach(
                state => {

                    if (
                        existing.has(
                            state
                        )
                    ) {
                        return;
                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        state;

                    option.textContent =
                        state;


                    stateFilter.appendChild(
                        option
                    );

                }
            );

    }


    if (stageFilter) {

        stageFilter.innerHTML =
            '<option value="all">All Stages</option>';

        const existing =
            new Set(
                [
                    ...stageFilter.options
                ].map(
                    option =>
                        option.value
                )
            );


        projects
            .map(
                project =>
                    project.status
            )
            .filter(Boolean)
            .forEach(
                stage => {

                    if (
                        existing.has(
                            stage
                        )
                    ) {
                        return;
                    }


                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        stage;

                    option.textContent =
                        stage;


                    stageFilter.appendChild(
                        option
                    );

                }
            );

    }

}


/* ============================================================
   20. EXPORT
   ============================================================ */

function initializeExport() {

    const exportButton =
        document.getElementById(
            "exportProjects"
        );


    if (!exportButton) {
        return;
    }


    exportButton.addEventListener(
        "click",
        exportProjects
    );

}


function exportProjects() {

    if (
        !filteredProjects.length
    ) {

        showToast(
            "There are no projects to export.",
            "warning"
        );

        return;

    }


    const headers = [

        "Project ID",

        "Project Name",

        "Project Type",

        "State",

        "District",

        "Authority",

        "Land Area (ha)",

        "Affected Families",

        "Acquisition Stage",

        "Progress (%)",

        "Risk Score (%)",

        "Risk Level",

        "Predicted Delay (days)",

        "Status"

    ];


    const rows =
        filteredProjects.map(
            project => [

                project.id,

                project.name,

                project.projectType,

                project.state,

                project.district,

                project.authority,

                project.landArea,

                project.affectedFamilies,

                project.acquisitionStage,

                project.progress,

                project.riskScore,

                project.riskLevel,

                project.predictedDelayDays,

                project.status

            ]
        );


    const csv = [

        headers,

        ...rows

    ]
        .map(
            row =>
                row
                    .map(
                        value =>
                            `"${String(
                                value ?? ""
                            ).replace(
                                /"/g,
                                '""'
                            )}"`
                    )
                    .join(",")
        )
        .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;

    link.download =
        "LandTrack_Project_Portfolio.csv";


    document.body.appendChild(
        link
    );


    link.click();

    link.remove();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Project portfolio exported successfully.",
        "success"
    );

}


/* ============================================================
   21. UTILITY
   ============================================================ */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* ============================================================
   22. SAFE HTML
   ============================================================ */

function escapeProjectHTML(
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
   PROJECT DETAILS PAGE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(
        window.location.search
    );

    const projectId = params.get("id");

    if (!projectId) return;

    const project =
        window.LandTrack.helpers.getProject(projectId);

    if (!project) {

        const name =
            document.getElementById("project-name");

        if (name) {
            name.textContent = "Project not found";
        }

        return;
    }


    /* BASIC DETAILS */

    setDetail(
        "project-name",
        project.name
    );

    setDetail(
        "project-location",
        `${project.district}, ${project.state}`
    );

    setDetail(
        "detail-project-type",
        project.projectType
    );

    setDetail(
        "detail-land-category",
        project.landCategory || "Not specified"
    );

    setDetail(
        "detail-land-area",
        `${project.totalLandRequired} Ha`
    );

    setDetail(
        "detail-state",
        project.state
    );

    setDetail(
        "detail-district",
        project.district
    );

    setDetail(
        "detail-village",
        project.village || "Not specified"
    );

    setDetail(
        "detail-stage",
        project.status
    );

    setDetail(
        "detail-owners",
        project.parcelsRequired
    );

    setDetail(
        "detail-delay",
        `${project.predictedDelayDays} days`
    );


    /* RISK */

    setDetail(
        "project-risk-value",
        `${project.riskScore}%`
    );

    setDetail(
        "project-risk-label",
        window.LandTrack.helpers.riskLabel(
            project.riskScore
        )
    );


    /* STATUS */

    setDetail(
        "status-ownership",
        project.legalDisputes > 0
            ? "Verification required"
            : "Clear"
    );

    setDetail(
        "status-documents",
        `${project.documentCompleteness}% complete`
    );

    setDetail(
        "status-compensation",
        project.compensationPending > 0
            ? "Pending"
            : "Completed"
    );

    setDetail(
        "status-legal",
        `${project.courtCases} court cases`
    );

    setDetail(
        "status-sia",
        "Available"
    );

    setDetail(
        "status-environment",
        project.landCategory ===
        "Forest / Protected Area"
            ? "Regulatory review"
            : "Under review"
    );


    /* MAP LOCATION */

    setDetail(
        "map-location-label",
        `${project.state} → ${project.district}`
    );

});

function setDetail(id, value) {
    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value ?? "Not available";
    }
}}