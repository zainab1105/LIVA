document.addEventListener("DOMContentLoaded", () => {

    const rrView =
        document.getElementById("rrView");

    if (!rrView) {
        return;
    }


    /* ========================================================
       STATE
       ======================================================== */

    let selectedProject =
        window.LandTrack?.projects?.[0] || null;



    /* ========================================================
       HELPERS
       ======================================================== */

    function number(value) {

        const result = Number(value);

        return Number.isFinite(result)
            ? result
            : 0;

    }


    function percentage(
        current,
        total
    ) {

        current = number(current);
        total = number(total);

        if (!total) {
            return 0;
        }

        return Math.round(
            (current / total) * 100
        );

    }


    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }



    /* ========================================================
       GET R&R DATA
       ======================================================== */

    function getRRData(
        projectId
    ) {

        return (
            window.LandTrack
                ?.helpers
                ?.getProjectRR(
                    projectId
                )
            || {

                familiesAffected: 0,

                familiesRelocated: 0,

                familiesPending: 0,

                housesRequired: 0,

                housesCompleted: 0,

                livelihoodCases: 0,

                livelihoodResolved: 0,

                rrProgress: 0

            }
        );

    }



    /* ========================================================
       RENDER
       ======================================================== */

    function renderRR() {

        rrView.innerHTML = `

            <div class="rr-page">


                <!-- ==========================================
                     HEADER
                     ========================================== -->

                <div class="rr-header">

                    <div>

                        <span class="section-index">
                            07
                        </span>

                        <div>

                            <p class="eyebrow">
                                REHABILITATION & RESETTLEMENT
                            </p>

                            <h1>
                                Acquisition doesn't end
                                <br>
                                with possession.
                            </h1>

                            <p class="rr-description">
                                Track the people, commitments and
                                rehabilitation work that follow
                                land acquisition.
                            </p>

                        </div>

                    </div>


                    <div class="rr-principle">

                        <span>
                            PEOPLE FIRST
                        </span>

                        <strong>
                            Monitor every commitment.
                        </strong>

                    </div>

                </div>



                <!-- ==========================================
                     PROJECT SELECTOR
                     ========================================== -->

                <div class="rr-selector">

                    <label>
                        PROJECT
                    </label>

                    <select
                        id="rrProject"
                    >

                        ${
                            (
                                window.LandTrack
                                    ?.projects || []
                            )
                            .map(
                                project => `

                                    <option
                                        value="${escapeHTML(
                                            project.id
                                        )}"
                                    >
                                        ${escapeHTML(
                                            project.name
                                        )}
                                        ·
                                        ${escapeHTML(
                                            project.district
                                        )},
                                        ${escapeHTML(
                                            project.state
                                        )}
                                    </option>

                                `
                            )
                            .join("")
                        }

                    </select>

                </div>



                <!-- ==========================================
                     TOP METRICS
                     ========================================== -->

                <div class="rr-metrics">


                    <div class="rr-metric-main">

                        <span>
                            R&R PROGRESS
                        </span>

                        <strong
                            id="rrProgress"
                        >
                            —
                        </strong>

                        <div class="rr-progress-track">

                            <div
                                id="rrProgressBar"
                            ></div>

                        </div>

                    </div>


                    <div class="rr-metric">

                        <span>
                            AFFECTED FAMILIES
                        </span>

                        <strong
                            id="rrAffected"
                        >
                            —
                        </strong>

                    </div>


                    <div class="rr-metric">

                        <span>
                            RELOCATED
                        </span>

                        <strong
                            id="rrRelocated"
                        >
                            —
                        </strong>

                    </div>


                    <div class="rr-metric warning">

                        <span>
                            PENDING
                        </span>

                        <strong
                            id="rrPending"
                        >
                            —
                        </strong>

                    </div>

                </div>



                <!-- ==========================================
                     MAIN WORKSPACE
                     ========================================== -->

                <div class="rr-workspace">


                    <!-- ======================================
                         FAMILIES
                         ====================================== -->

                    <section class="rr-panel">

                        <div class="rr-panel-heading">

                            <div>

                                <span>
                                    01 · FAMILY REHABILITATION
                                </span>

                                <h2>
                                    Relocation status
                                </h2>

                            </div>

                        </div>


                        <div class="rr-big-stat">

                            <strong
                                id="relocationPercentage"
                            >
                                —
                            </strong>

                            <span>
                                of affected families relocated
                            </span>

                        </div>


                        <div class="rr-bar">

                            <div
                                id="relocationBar"
                            ></div>

                        </div>


                        <div class="rr-stat-list">


                            <div>

                                <span>
                                    Total affected
                                </span>

                                <strong
                                    id="familyTotal"
                                >
                                    —
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Relocated
                                </span>

                                <strong
                                    id="familyRelocated"
                                >
                                    —
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Pending
                                </span>

                                <strong
                                    id="familyPending"
                                >
                                    —
                                </strong>

                            </div>


                        </div>

                    </section>



                    <!-- ======================================
                         HOUSING
                         ====================================== -->

                    <section class="rr-panel">

                        <div class="rr-panel-heading">

                            <div>

                                <span>
                                    02 · HOUSING
                                </span>

                                <h2>
                                    Resettlement units
                                </h2>

                            </div>

                        </div>


                        <div class="rr-big-stat">

                            <strong
                                id="housingPercentage"
                            >
                                —
                            </strong>

                            <span>
                                of required units completed
                            </span>

                        </div>


                        <div class="rr-bar">

                            <div
                                id="housingBar"
                            ></div>

                        </div>


                        <div class="rr-stat-list">


                            <div>

                                <span>
                                    Units required
                                </span>

                                <strong
                                    id="housingRequired"
                                >
                                    —
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Completed
                                </span>

                                <strong
                                    id="housingCompleted"
                                >
                                    —
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Remaining
                                </span>

                                <strong
                                    id="housingRemaining"
                                >
                                    —
                                </strong>

                            </div>


                        </div>

                    </section>



                    <!-- ======================================
                         LIVELIHOOD
                         ====================================== -->

                    <section class="rr-panel">

                        <div class="rr-panel-heading">

                            <div>

                                <span>
                                    03 · LIVELIHOOD
                                </span>

                                <h2>
                                    Restoration commitments
                                </h2>

                            </div>

                        </div>


                        <div class="rr-big-stat">

                            <strong
                                id="livelihoodPercentage"
                            >
                                —
                            </strong>

                            <span>
                                livelihood cases resolved
                            </span>

                        </div>


                        <div class="rr-bar">

                            <div
                                id="livelihoodBar"
                            ></div>

                        </div>


                        <div class="rr-stat-list">


                            <div>

                                <span>
                                    Total cases
                                </span>

                                <strong
                                    id="livelihoodTotal"
                                >
                                    —
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Resolved
                                </span>

                                <strong
                                    id="livelihoodResolved"
                                >
                                    —
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Pending
                                </span>

                                <strong
                                    id="livelihoodPending"
                                >
                                    —
                                </strong>

                            </div>


                        </div>

                    </section>

                </div>



                <!-- ==========================================
                     PROJECT JOURNEY
                     ========================================== -->

                <section class="rr-journey-panel">


                    <div class="rr-panel-heading">

                        <div>

                            <span>
                                04 · ACQUISITION TO REHABILITATION
                            </span>

                            <h2>
                                Where this project stands
                            </h2>

                        </div>

                    </div>


                    <div
                        class="rr-journey"
                        id="rrJourney"
                    ></div>


                </section>



                <!-- ==========================================
                     PRIORITY CASES
                     ========================================== -->

                <section class="rr-priority">


                    <div>

                        <span>
                            ADMINISTRATIVE SIGNAL
                        </span>

                        <h2
                            id="rrSignalTitle"
                        >
                            —
                        </h2>

                        <p
                            id="rrSignalText"
                        >
                            —
                        </p>

                    </div>


                    <button
                        type="button"
                        id="rrActionButton"
                    >

                        Open action centre

                        <span>
                            →
                        </span>

                    </button>

                </section>



                <div class="rr-disclaimer">

                    <strong>
                        Prototype data
                    </strong>

                    <span>
                        R&R figures are simulated demonstration
                        values. Production deployment would use
                        verified beneficiary, relocation and
                        rehabilitation records.
                    </span>

                </div>


            </div>

        `;


        attachEvents();

        updateRR();

    }



    /* ========================================================
       UPDATE DATA
       ======================================================== */

    function updateRR() {

        if (!selectedProject) {
            return;
        }


        const data =
            getRRData(
                selectedProject.id
            );


        const rrProgress =
            number(
                data.rrProgress
            );


        const relocation =
            percentage(
                data.familiesRelocated,
                data.familiesAffected
            );


        const housing =
            percentage(
                data.housesCompleted,
                data.housesRequired
            );


        const livelihood =
            percentage(
                data.livelihoodResolved,
                data.livelihoodCases
            );



        /* ==============================================
           TOP METRICS
           ============================================== */

        setText(
            "rrProgress",
            `${rrProgress}%`
        );


        setText(
            "rrAffected",
            data.familiesAffected
        );


        setText(
            "rrRelocated",
            data.familiesRelocated
        );


        setText(
            "rrPending",
            data.familiesPending
        );


        setWidth(
            "rrProgressBar",
            rrProgress
        );



        /* ==============================================
           FAMILIES
           ============================================== */

        setText(
            "relocationPercentage",
            `${relocation}%`
        );


        setWidth(
            "relocationBar",
            relocation
        );


        setText(
            "familyTotal",
            data.familiesAffected
        );


        setText(
            "familyRelocated",
            data.familiesRelocated
        );


        setText(
            "familyPending",
            data.familiesPending
        );



        /* ==============================================
           HOUSING
           ============================================== */

        const housingRemaining =
            Math.max(
                0,
                number(
                    data.housesRequired
                ) -
                number(
                    data.housesCompleted
                )
            );


        setText(
            "housingPercentage",
            `${housing}%`
        );


        setWidth(
            "housingBar",
            housing
        );


        setText(
            "housingRequired",
            data.housesRequired
        );


        setText(
            "housingCompleted",
            data.housesCompleted
        );


        setText(
            "housingRemaining",
            housingRemaining
        );



        /* ==============================================
           LIVELIHOOD
           ============================================== */

        const livelihoodPending =
            Math.max(
                0,
                number(
                    data.livelihoodCases
                ) -
                number(
                    data.livelihoodResolved
                )
            );


        setText(
            "livelihoodPercentage",
            `${livelihood}%`
        );


        setWidth(
            "livelihoodBar",
            livelihood
        );


        setText(
            "livelihoodTotal",
            data.livelihoodCases
        );


        setText(
            "livelihoodResolved",
            data.livelihoodResolved
        );


        setText(
            "livelihoodPending",
            livelihoodPending
        );


        renderJourney();

        renderSignal();

    }



    /* ========================================================
       JOURNEY
       ======================================================== */

    function renderJourney() {

        const container =
            document.getElementById(
                "rrJourney"
            );


        if (!container) {
            return;
        }


        const timeline =
            selectedProject?.timeline || [];


        const stages = [

            ...timeline,

            {
                stage: "R&R",
                status:
                    selectedProject?.rrStatus
                    || "Pending"
            }

        ];


        container.innerHTML =
            stages
                .map(
                    (stage, index) => {

                        const status =
                            String(
                                stage.status || ""
                            ).toLowerCase();


                        let state =
                            "upcoming";


                        if (
                            status.includes(
                                "completed"
                            )
                        ) {

                            state =
                                "complete";

                        }


                        if (
                            status.includes(
                                "progress"
                            )
                        ) {

                            state =
                                "active";

                        }


                        return `

                            <div
                                class="rr-journey-stage ${state}"
                            >

                                <div class="rr-journey-marker">

                                    ${
                                        state ===
                                        "complete"
                                            ? "✓"
                                            : index + 1
                                    }

                                </div>


                                <strong>
                                    ${escapeHTML(
                                        stage.stage
                                    )}
                                </strong>


                                <span>
                                    ${escapeHTML(
                                        stage.status
                                    )}
                                </span>

                            </div>


                            ${
                                index <
                                stages.length - 1
                                    ? `
                                        <div
                                            class="rr-journey-connector ${state}"
                                        ></div>
                                    `
                                    : ""
                            }

                        `;

                    }
                )
                .join("");

    }



    /* ========================================================
       ADMINISTRATIVE SIGNAL
       ======================================================== */

    function renderSignal() {

        const data =
            getRRData(
                selectedProject.id
            );


        const pending =
            number(
                data.familiesPending
            );


        const progress =
            number(
                data.rrProgress
            );


        const title =
            document.getElementById(
                "rrSignalTitle"
            );


        const text =
            document.getElementById(
                "rrSignalText"
            );


        if (!title || !text) {
            return;
        }


        if (
            pending >= 200 ||
            progress < 25
        ) {

            title.textContent =
                "R&R requires immediate attention.";


            text.textContent =
                `${pending} affected families remain pending while overall R&R progress is only ${progress}%. Prioritize rehabilitation planning before possession advances.`;

            return;

        }


        if (
            pending >= 75 ||
            progress < 50
        ) {

            title.textContent =
                "R&R progress is behind the acquisition journey.";


            text.textContent =
                `${pending} families remain pending. Coordinated rehabilitation action could reduce downstream implementation risk.`;

            return;

        }


        title.textContent =
            "R&R implementation is progressing.";


        text.textContent =
            "Continue monitoring outstanding rehabilitation and livelihood commitments.";

    }



    /* ========================================================
       EVENTS
       ======================================================== */

    function attachEvents() {

        const selector =
            document.getElementById(
                "rrProject"
            );


        selector?.addEventListener(
            "change",
            event => {

                selectedProject =
                    (
                        window.LandTrack
                            ?.projects || []
                    )
                    .find(
                        project =>
                            project.id ===
                            event.target.value
                    ) || null;


                updateRR();


                document.dispatchEvent(
                    new CustomEvent(
                        "landtrack:projectselected",
                        {
                            detail: {
                                project:
                                    selectedProject
                            }
                        }
                    )
                );

            }
        );


        document
            .getElementById(
                "rrActionButton"
            )
            ?.addEventListener(
                "click",
                () => {

                    window.LandTrackApp
                        ?.switchView(
                            "actions"
                        );

                }
            );

    }



    /* ========================================================
       PROJECT SELECTION FROM OTHER MODULES
       ======================================================== */

    document.addEventListener(
        "landtrack:projectselected",
        event => {

            const project =
                event.detail?.project;


            if (!project) {
                return;
            }


            selectedProject =
                project;


            const selector =
                document.getElementById(
                    "rrProject"
                );


            if (selector) {

                selector.value =
                    project.id;

            }


            updateRR();

        }
    );



    /* ========================================================
       SMALL UI HELPERS
       ======================================================== */

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


    function setWidth(
        id,
        value
    ) {

        const element =
            document.getElementById(
                id
            );


        if (element) {

            element.style.width =
                `${Math.max(
                    0,
                    Math.min(
                        100,
                        number(value)
                    )
                )}%`;

        }

    }



    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.LandTrackRR = {

        getSelectedProject:
            () => selectedProject,

        getData:
            () =>
                getRRData(
                    selectedProject?.id
                ),

        update:
            updateRR

    };



    /* ========================================================
       INITIALIZE
       ======================================================== */

    renderRR();

});