/* ============================================================
   LANDTRACK AI
   MAIN APPLICATION CONTROLLER
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       GLOBAL STATE
       ======================================================== */

    let activeView = "overview";

    let selectedProject = null;

    let searchResults = [];



    /* ========================================================
       ELEMENTS
       ======================================================== */

    const views =
        document.querySelectorAll(".view");

    const navigationItems =
        document.querySelectorAll("[data-view]");

    const viewTargetButtons =
        document.querySelectorAll(
            "[data-view-target]"
        );

    const globalSearch =
        document.getElementById(
            "globalSearch"
        );

    const projectModal =
        document.getElementById(
            "projectModal"
        );

    const projectDrawer =
        document.getElementById(
            "projectDrawer"
        );

    const projectDrawerOverlay =
        document.getElementById(
            "projectDrawerOverlay"
        );

    const projectDrawerContent =
        document.getElementById(
            "projectDrawerContent"
        );



    /* ========================================================
       SAFE DATA ACCESS
       ======================================================== */

    function getProjects() {

        return window.LandTrack?.projects || [];

    }


    function getProject(
        projectId
    ) {

        return getProjects().find(
            project =>
                project.id === projectId
        );

    }

    /* ========================================================
       VIEW NAVIGATION
       ======================================================== */

    function switchView(
        viewName
    ) {

        if (!viewName) {
            return;
        }


        activeView =
            viewName;


        views.forEach(
            view => {

                const isActive =
                    view.id ===
                    `${viewName}View`;


                view.classList.toggle(
                    "active",
                    isActive
                );

            }
        );


        navigationItems.forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.view ===
                    viewName
                );

            }
        );


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });


        document.dispatchEvent(
            new CustomEvent(
                "landtrack:viewchanged",
                {
                    detail: {
                        view:
                            viewName
                    }
                }
            )
        );

    }


    navigationItems.forEach(
        item => {

            item.addEventListener(
                "click",
                () => {

                    switchView(
                        item.dataset.view
                    );

                }
            );

        }
    );


    viewTargetButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    switchView(
                        button.dataset
                            .viewTarget
                    );

                }
            );

        }
    );



    /* ========================================================
       PROJECT DRAWER
       ======================================================== */

    function openProjectDrawer(projectId) {

        const project =
            typeof projectId === "object"
                ? projectId
                : getProject(projectId);

        if (!project) {
            return;
        }

        selectedProject = project;

        renderProjectDrawer(project);

        projectDrawer?.classList.add("open");

        projectDrawerOverlay?.classList.add("open");

        document.body.classList.add("drawer-open");

        document.dispatchEvent(
            new CustomEvent("landtrack:projectselected", {
                detail: { project }
            })
        );
    }

    window.LandTrackApp = window.LandTrackApp || {};

    window.LandTrackApp.openProjectDrawer = openProjectDrawer;
    
    window.openProjectDrawer = openProjectDrawer;


    function closeProjectDrawer() {

        projectDrawer?.classList.remove(
            "open"
        );


        projectDrawerOverlay?.classList.remove(
            "open"
        );


        document.body.classList.remove(
            "drawer-open"
        );

    }


    document
        .getElementById(
            "closeProjectDrawer"
        )
        ?.addEventListener(
            "click",
            closeProjectDrawer
        );


    projectDrawerOverlay
        ?.addEventListener(
            "click",
            closeProjectDrawer
        );


    /* ========================================================
       DRAWER CONTENT
       ======================================================== */

    function renderProjectDrawer(
        project
    ) {

        if (!projectDrawerContent) {
            return;
        }

        const risk =
            Number(
                project.riskScore || 0
            );


        const riskClass =
            getRiskClass(risk);


        const getProjectParcels =
            window.LandTrack
                ?.helpers
                ?.getProjectParcels;

        const parcels =
            typeof getProjectParcels === "function"
                ? getProjectParcels(project.id)
                : [];


        const alerts = [];


        projectDrawerContent.innerHTML = `

            <div class="drawer-eyebrow">
                PROJECT INTELLIGENCE
            </div>


            <h2>
                ${escapeHTML(
                    project.name
                )}
            </h2>


            <p class="drawer-location">
                ${escapeHTML(
                    project.district || ""
                )},
                ${escapeHTML(
                    project.state || ""
                )}
            </p>



            <div
                class="drawer-risk ${riskClass}"
            >

                <div>

                    <span>
                        DELAY RISK
                    </span>

                    <strong>
                        ${risk}%
                    </strong>

                </div>


                <div>

                    <span>
                        PREDICTED DELAY
                    </span>

                    <strong>
                        ${number(
                            project.predictedDelayDays
                        )} days
                    </strong>

                </div>

            </div>



            <!-- PROJECT DATA -->

            <section class="drawer-section">

                <div class="drawer-section-title">
                    PROJECT PROFILE
                </div>


                <div class="drawer-data-grid">

                    <div>

                        <span>
                            Project type
                        </span>

                        <strong>
                            ${escapeHTML(
                                project.projectType
                                || "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Current stage
                        </span>

                        <strong>
                            ${escapeHTML(
                                project.acquisitionStage
                                || "—"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Land required
                        </span>

                        <strong>
                            ${number(
                                project.totalLandRequired
                            )} Ha
                        </strong>

                    </div>


                    <div>

                        <span>
                            Land acquired
                        </span>

                        <strong>
                            ${number(
                                project.landAcquired
                            )} Ha
                        </strong>

                    </div>


                    <div>

                        <span>
                            Parcels
                        </span>

                        <strong>
                            ${number(
                                project.parcels
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Affected families
                        </span>

                        <strong>
                            ${number(
                                project.affectedFamilies
                            )}
                        </strong>

                    </div>

                </div>

            </section>



            <!-- DELAY DRIVERS -->

            <section class="drawer-section">

                <div class="drawer-section-title">
                    PREDICTED DELAY DRIVERS
                </div>


                ${
                    (project.delayDrivers || [])
                        .map(
                            driver => `

                                <div class="drawer-driver">

                                    <div>

                                        <span>
                                            ${escapeHTML(
                                                driver.name
                                            )}
                                        </span>

                                        <strong>
                                            ${number(
                                                driver.percentage
                                            )}%
                                        </strong>

                                    </div>


                                    <div
                                        class="drawer-driver-track"
                                    >

                                        <div
                                            style="width:${number(
                                                driver.percentage
                                            )}%"
                                        ></div>

                                    </div>

                                </div>

                            `
                        )
                        .join("")
                }

            </section>



            <!-- ACQUISITION STATUS -->

            <section class="drawer-section">

                <div class="drawer-section-title">
                    ACQUISITION STATUS
                </div>


                <div class="drawer-status-list">

                    ${createStatusRow(
                        "Notification",
                        project.notificationStatus
                    )}

                    ${createStatusRow(
                        "Survey",
                        project.surveyStatus
                    )}

                    ${createStatusRow(
                        "Valuation",
                        project.valuationStatus
                    )}

                    ${createStatusRow(
                        "Award",
                        project.awardStatus
                    )}

                    ${createStatusRow(
                        "Compensation",
                        project.compensationStatus
                    )}

                    ${createStatusRow(
                        "Possession",
                        project.possessionStatus
                    )}

                    ${createStatusRow(
                        "R&R",
                        project.rrStatus
                    )}

                </div>

            </section>



            <!-- TIMELINE -->

            <section class="drawer-section">

                <div class="drawer-section-title">
                    ACQUISITION JOURNEY
                </div>


                <div class="drawer-timeline">

                    ${
                        (project.timeline || [])
                            .map(
                                (stage, index) => {

                                    const status =
                                        String(
                                            stage.status
                                            || ""
                                        ).toLowerCase();


                                    let markerClass =
                                        "";


                                    if (
                                        status.includes(
                                            "completed"
                                        )
                                    ) {

                                        markerClass =
                                            "complete";

                                    }


                                    if (
                                        status.includes(
                                            "progress"
                                        )
                                    ) {

                                        markerClass =
                                            "active";

                                    }


                                    return `

                                        <div
                                            class="drawer-timeline-item"
                                        >

                                            <i
                                                class="timeline-marker ${markerClass}"
                                            ></i>

                                            <div>

                                                <strong>
                                                    ${escapeHTML(
                                                        stage.stage
                                                    )}
                                                </strong>

                                                <small>
                                                    ${escapeHTML(
                                                        stage.status
                                                    )}
                                                </small>

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join("")
                    }

                </div>

            </section>



            <!-- INTELLIGENCE -->

            <section class="drawer-section">

                <div class="drawer-section-title">
                    SYSTEM INTELLIGENCE
                </div>


                <div class="drawer-recommendation">

                    <span>
                        RECOMMENDED ACTION
                    </span>

                    <p>
                        ${escapeHTML(
                            project.aiRecommendation
                            || "No recommendation available."
                        )}
                    </p>

                </div>

            </section>



            <!-- ACTIONS -->

            <div class="drawer-actions">

                <button
                    type="button"
                    class="drawer-primary-action"
                    data-drawer-action="prediction"
                >

                    View AI prediction

                    <span>
                        →
                    </span>

                </button>


                <button
                    type="button"
                    class="drawer-secondary-action"
                    data-drawer-action="simulator"
                >

                    Simulate intervention

                </button>


                <button
                    type="button"
                    class="drawer-secondary-action"
                    data-drawer-action="documents"
                >

                    Inspect documents

                </button>

            </div>


            <div class="drawer-meta">

                <span>
                    ${parcels.length}
                    demo parcel records linked
                </span>

                <span>
                    ${alerts.length}
                    active project alerts
                </span>

            </div>

        `;


        projectDrawerContent
            .querySelectorAll(
                "[data-drawer-action]"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            const action =
                                button.dataset
                                    .drawerAction;


                            closeProjectDrawer();


                            switchView(
                                action
                            );

                        }
                    );

                }
            );

    }



    /* ========================================================
       STATUS ROW
       ======================================================== */

    function createStatusRow(
        label,
        value
    ) {

        return `

            <div>

                <span>
                    ${escapeHTML(
                        label
                    )}
                </span>

                <strong>
                    ${escapeHTML(
                        value || "Pending"
                    )}
                </strong>

            </div>

        `;

    }



    /* ========================================================
       RISK CLASS
       ======================================================== */

    function getRiskClass(
        score
    ) {

        score =
            number(score);


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



    /* ========================================================
       ADD PROJECT MODAL
       ======================================================== */

    function openProjectModal() {

        if (!projectModal) {
            return;
        }


        projectModal
            .classList.add(
                "open"
            );


        projectModal
            .setAttribute(
                "aria-hidden",
                "false"
            );


        document.body.classList.add(
            "modal-open"
        );


        document
            .getElementById(
                "projectName"
            )
            ?.focus();

    }


    function closeProjectModal() {

        if (!projectModal) {
            return;
        }


        projectModal
            .classList.remove(
                "open"
            );


        projectModal
            .setAttribute(
                "aria-hidden",
                "true"
            );


        document.body.classList.remove(
            "modal-open"
        );

    }


    document
        .getElementById(
            "addProjectButton"
        )
        ?.addEventListener(
            "click",
            openProjectModal
        );


    document
        .getElementById(
            "closeProjectModal"
        )
        ?.addEventListener(
            "click",
            closeProjectModal
        );


    document
        .getElementById(
            "cancelProject"
        )
        ?.addEventListener(
            "click",
            closeProjectModal
        );


    projectModal
        ?.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    projectModal
                ) {

                    closeProjectModal();

                }

            }
        );



    /* ========================================================
       ADD NEW PROJECT
       ======================================================== */

    const projectForm =
        document.getElementById(
            "addProjectForm"
        );


    projectForm?.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const formData =
                new FormData(
                    projectForm
                );


            const name =
                String(
                    formData.get(
                        "projectName"
                    ) || ""
                ).trim();


            const projectType =
                String(
                    formData.get(
                        "projectType"
                    ) || ""
                );

            const state =
                String(
                    formData.get(
                        "state"
                    ) || ""
                );

            const district =
                String(
                    formData.get(
                        "district"
                    ) || ""
                ).trim();

            const landCategory =
                String(
                    formData.get(
                        "landCategory"
                    ) || ""
                );

            const landRequired =
                number(
                    formData.get(
                        "landRequired"
                    )
                );


            const landAcquired =
                number(
                    formData.get(
                        "landAcquired"
                    )
                );


            const affectedFamilies =
                number(
                    formData.get(
                        "affectedFamilies"
                    )
                );


            if (
                !name ||
                !projectType ||
                !state ||
                !district ||
                !landCategory
            ) {

                showToast(
                    "Please complete the required project details."
                );

                return;

            }


            const projectId =
                createProjectId(
                    state
                );


            const newProject = {

                id:
                    projectId,

                name,

                projectType,

                state,

                district,

                landCategory:
                    landCategory,

                village:
                    "Demo Village",

                location:
                    `${district}, ${state}`,

                latitude:
                    20,

                longitude:
                    78,

                totalLandRequired:
                    landRequired,

                landAcquired:
                    landAcquired,

                balanceLand:
                    Math.max(
                        0,
                        landRequired -
                        landAcquired
                    ),

                parcels:
                    0,

                affectedFamilies:
                    affectedFamilies,


                acquisitionStage:
                    "Notification",

                progress:
                    landRequired > 0
                        ? Math.round(
                            (
                                landAcquired /
                                landRequired
                            ) * 100
                        )
                        : 0,


                notificationStatus:
                    "In Progress",

                surveyStatus:
                    "Pending",

                valuationStatus:
                    "Pending",

                awardStatus:
                    "Pending",

                compensationStatus:
                    "Pending",

                possessionStatus:
                    "Pending",

                rrStatus:
                    "Pending",


                legalDisputes:
                    0,

                courtCases:
                    0,

                ownershipConflicts:
                    0,

                boundaryDisputes:
                    0,


                documentCompleteness:
                    20,

                stakeholderResponsiveness:
                    50,

                departmentCoordination:
                    50,

                approvalPending:
                    0,

                compensationPending:
                    0,


                riskScore:
                    62,

                riskLevel:
                    "Medium",

                confidenceScore:
                    62,

                predictedDelayDays:
                    64,

                primaryDelayDriver:
                    "Early-stage processing",

                delayDrivers: [

                    {
                        name:
                            "Early-stage processing",

                        percentage:
                            35
                    },

                    {
                        name:
                            "Documentation",

                        percentage:
                            25
                    },

                    {
                        name:
                            "Stakeholder coordination",

                        percentage:
                            20
                    },

                    {
                        name:
                            "Survey",

                        percentage:
                            12
                    },

                    {
                        name:
                            "Other",

                        percentage:
                            8
                    }

                ],


                aiRecommendation:
                    "Complete baseline project documentation and initiate field survey to establish an accurate acquisition timeline.",


                timeline: [

                    {
                        stage:
                            "Notification",

                        status:
                            "In Progress"
                    },

                    {
                        stage:
                            "Survey",

                        status:
                            "Upcoming"
                    },

                    {
                        stage:
                            "Valuation",

                        status:
                            "Upcoming"
                    },

                    {
                        stage:
                            "Award",

                        status:
                            "Upcoming"
                    },

                    {
                        stage:
                            "Compensation",

                        status:
                            "Upcoming"
                    },

                    {
                        stage:
                            "Possession",

                        status:
                            "Upcoming"
                    },

                    {
                        stage:
                            "R&R",

                        status:
                            "Upcoming"
                    }

                ]

            };


            getProjects().push(
                newProject
            );


            window.LandTrack
                .projects =
                getProjects();


            saveProjects();


            projectForm.reset();

            closeProjectModal();


            showToast(
                `${name} added to the demonstration portfolio.`
            );


            refreshDashboard();


            setTimeout(
                () => {

                    openProjectDrawer(
                        projectId
                    );

                },
                350
            );

        }
    );



    /* ========================================================
       SAVE PROJECTS
       ======================================================== */

    function saveProjects() {

        try {

            localStorage.setItem(
                "landtrack_demo_projects",
                JSON.stringify(
                    getProjects()
                )
            );

        } catch (error) {

            console.warn(
                "LandTrack: Could not save projects.",
                error
            );

        }

    }



    /* ========================================================
       PROJECT ID
       ======================================================== */

    function createProjectId(
        state
    ) {

        const prefix =
            state
                .replace(
                    /[^A-Za-z]/g,
                    ""
                )
                .slice(0, 3)
                .toUpperCase();


        const random =
            Math.floor(
                100 +
                Math.random() * 899
            );


        return `PRJ-${prefix}-${random}`;

    }



    /* ========================================================
       DASHBOARD
       ======================================================== */

    function refreshDashboard() {

        const projects =
            getProjects();


        updatePortfolioStats(
            projects
        );


        renderAttentionList(
            projects
        );


        updateAlertCount();

    }


    function updatePortfolioStats(
        projects
    ) {

        const portfolioRisk =
            document.getElementById(
                "portfolioRisk"
            );


        if (!portfolioRisk) {
            return;
        }


        if (!projects.length) {

            portfolioRisk.textContent =
                "0%";

            return;

        }


        const average =
            projects.reduce(
                (
                    total,
                    project
                ) =>
                    total +
                    number(
                        project.riskScore
                    ),
                0
            ) / projects.length;


        portfolioRisk.textContent =
            `${Math.round(
                average
            )}%`;

    }



    /* ========================================================
       ATTENTION LIST
       ======================================================== */

    function renderAttentionList(
        projects
    ) {

        const container =
            document.getElementById(
                "attentionList"
            );


        if (!container) {
            return;
        }


        const sorted =
            [...projects]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        number(
                            b.riskScore
                        ) -
                        number(
                            a.riskScore
                        )
                )
                .slice(
                    0,
                    4
                );


        container.innerHTML =
            sorted
                .map(
                    project => {

                        const risk =
                            number(
                                project.riskScore
                            );


                        return `

                            <button
                                type="button"
                                class="attention-item ${getRiskClass(
                                    risk
                                )} ${risk >= 80 ? "priority-risk" : ""}"
                                data-attention-project="${escapeAttribute(
                                    project.id
                                )}"
                            >

                                <div class="attention-index">
                                    ${String(
                                        projects.indexOf(
                                            project
                                        ) + 1
                                    ).padStart(
                                        2,
                                        "0"
                                    )}
                                </div>


                                <div class="attention-main">

                                    <strong>
                                        ${escapeHTML(
                                            project.name
                                        )}
                                    </strong>

                                    <span>
                                        ${escapeHTML(
                                            project.district
                                        )},
                                        ${escapeHTML(
                                            project.state
                                        )}
                                    </span>

                                </div>


                                <div class="attention-driver">

                                    <span>
                                        PRIMARY DRIVER
                                    </span>

                                    <strong>
                                        ${escapeHTML(
                                            project.primaryDelayDriver
                                            || "Risk detected"
                                        )}
                                    </strong>

                                </div>


                                <div class="attention-risk">

                                    <strong>
                                        ${risk}%
                                    </strong>

                                    <span>
                                        delay risk
                                    </span>

                                </div>


                                <span class="attention-arrow">
                                    →
                                </span>

                            </button>

                        `;

                    }
                )
                .join("");


        container
            .querySelectorAll(
                "[data-attention-project]"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        () => {

                            openProjectDrawer(
                                item.dataset
                                    .attentionProject
                            );

                        }
                    );

                }
            );

    }



    /* ========================================================
       GLOBAL SEARCH
       ======================================================== */

    globalSearch?.addEventListener(
        "input",
        event => {

            const query =
                event.target.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                closeSearchResults();

                return;

            }


            searchResults =
                getProjects()
                    .filter(
                        project => {

                            const searchable = [

                                project.name,

                                project.id,

                                project.projectType,

                                project.state,

                                project.district,

                                project.village

                            ]
                                .filter(Boolean)
                                .join(" ")
                                .toLowerCase();


                            return searchable
                                .includes(
                                    query
                                );

                        }
                    )
                    .slice(
                        0,
                        6
                    );


            renderSearchResults();

        }
    );



    /* ========================================================
       SEARCH RESULTS
       ======================================================== */

    function renderSearchResults() {

        closeSearchResults();


        if (!searchResults.length) {

            return;

        }


        const searchBox =
            globalSearch?.closest(
                ".global-search"
            );


        if (!searchBox) {
            return;
        }


        const results =
            document.createElement(
                "div"
            );


        results.className =
            "search-results";


        results.innerHTML =
            searchResults
                .map(
                    project => `

                        <button
                            type="button"
                            data-search-project="${escapeAttribute(
                                project.id
                            )}"
                        >

                            <span>

                                <strong>
                                    ${escapeHTML(
                                        project.name
                                    )}
                                </strong>

                                <small>
                                    ${escapeHTML(
                                        project.district
                                    )},
                                    ${escapeHTML(
                                        project.state
                                    )}
                                </small>

                            </span>


                            <b>
                                ${number(
                                    project.riskScore
                                )}%
                            </b>

                        </button>

                    `
                )
                .join("");


        searchBox.appendChild(
            results
        );


        results
            .querySelectorAll(
                "[data-search-project]"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        () => {

                            const id =
                                item.dataset
                                    .searchProject;


                            globalSearch.value =
                                "";


                            closeSearchResults();


                            openProjectDrawer(
                                id
                            );

                        }
                    );

                }
            );

    }


    function closeSearchResults() {

        document
            .querySelector(
                ".search-results"
            )
            ?.remove();

    }



    /* ========================================================
       CTRL + K
       ======================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                (
                    event.ctrlKey ||
                    event.metaKey
                ) &&
                event.key.toLowerCase()
                    === "k"
            ) {

                event.preventDefault();


                globalSearch?.focus();

            }


            if (
                event.key === "Escape"
            ) {

                closeSearchResults();

                closeProjectModal();

                closeProjectDrawer();

            }

        }
    );



    /* ========================================================
       ALERTS
       ======================================================== */

    function updateAlertCount() {

        const count =
            document.getElementById(
                "alertCount"
            );


        if (!count) {
            return;
        }


        const alerts =
            window.LandTrack
                ?.alerts || [];


        count.textContent =
            alerts.length;

    }


    document
        .getElementById(
            "alertsButton"
        )
        ?.addEventListener(
            "click",
            () => {

                switchView(
                    "actions"
                );

            }
        );



    /* ========================================================
       TOAST
       ======================================================== */

    function showToast(
        message
    ) {

        const existing =
            document.querySelector(
                ".landtrack-toast"
            );


        existing?.remove();


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "landtrack-toast";


        toast.textContent =
            message;


        document.body.appendChild(
            toast
        );


        requestAnimationFrame(
            () => {

                toast.classList.add(
                    "show"
                );

            }
        );


        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );


                setTimeout(
                    () => toast.remove(),
                    250
                );

            },
            3000
        );

    }



    /* ========================================================
       UTILITY FUNCTIONS
       ======================================================== */

    function number(
        value
    ) {

        const parsed =
            Number(value);


        return Number.isFinite(
            parsed
        )
            ? parsed
            : 0;

    }


    function escapeHTML(
        value
    ) {

        return String(
            value ?? ""
        )
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


    function escapeAttribute(
        value
    ) {

        return escapeHTML(
            value
        );

    }



    /* ========================================================
       PUBLIC APPLICATION API
       ======================================================== */

    window.LandTrackApp = {

        switchView,

        openProjectDrawer,

        closeProjectDrawer,

        openProjectModal,

        closeProjectModal,

        showToast,

        getSelectedProject:
            () => selectedProject,

        getActiveView:
            () => activeView,

        refreshDashboard

    };



    /* ========================================================
       INITIALIZE
       ======================================================== */

    refreshDashboard();

    switchView(
        "overview"
    );

});

/*----------------------------
  home page navigate projects
  ---------------------------*/
  const investigateProjectButton =
    document.getElementById(
        "investigateProjectButton"
    );


if (investigateProjectButton) {

    investigateProjectButton.addEventListener(
        "click",
        () => {

            const projectId =
                investigateProjectButton.dataset.projectId;

            window.LandTrackApp.openProjectDrawer(projectId);

        }
    );

}