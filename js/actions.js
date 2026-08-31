/* ============================================================
   LANDTRACK AI
   ACTION CENTRE
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const actionsView =
        document.getElementById("actionsView");

    if (!actionsView) {
        return;
    }


    /* ========================================================
       STATE
       ======================================================== */

    let selectedFilter = "all";

    let actionItems = [];



    /* ========================================================
       HELPERS
       ======================================================== */

    function number(value) {

        const result = Number(value);

        return Number.isFinite(result)
            ? result
            : 0;

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
       BUILD ACTIONS FROM PROJECT DATA
       ======================================================== */

    function buildActions() {

        const projects =
            window.LandTrack?.projects || [];


        actionItems = [];


        projects.forEach(project => {

            const risk =
                number(
                    project.riskScore
                );


            /*
             * HIGH RISK
             */

            if (risk >= 80) {

                actionItems.push({

                    id:
                        `${project.id}-risk`,

                    projectId:
                        project.id,

                    project:
                        project.name,

                    type:
                        "risk",

                    priority:
                        "critical",

                    title:
                        "Review high delay-risk project",

                    description:
                        `Predicted delay risk is ${risk}%. Immediate administrative review is recommended.`,

                    owner:
                        "Land Acquisition Cell",

                    due:
                        "Immediate",

                    status:
                        "open"

                });

            }


            /*
             * DOCUMENTS
             */

            const documents =
                number(
                    project.documentCompleteness
                );


            if (documents < 60) {

                actionItems.push({

                    id:
                        `${project.id}-documents`,

                    projectId:
                        project.id,

                    project:
                        project.name,

                    type:
                        "documents",

                    priority:
                        documents < 35
                            ? "high"
                            : "medium",

                    title:
                        "Complete acquisition documentation",

                    description:
                        `Document completeness is currently ${documents}%. Missing records may delay downstream verification.`,

                    owner:
                        "Documentation Officer",

                    due:
                        "Within 7 days",

                    status:
                        "open"

                });

            }


            /*
             * LEGAL DISPUTES
             */

            const disputes =
                number(
                    project.legalDisputes
                );


            if (disputes > 5) {

                actionItems.push({

                    id:
                        `${project.id}-legal`,

                    projectId:
                        project.id,

                    project:
                        project.name,

                    type:
                        "legal",

                    priority:
                        disputes > 15
                            ? "critical"
                            : "high",

                    title:
                        "Review land dispute cases",

                    description:
                        `${disputes} ownership or land-related disputes are associated with this project.`,

                    owner:
                        "Legal / Revenue Cell",

                    due:
                        "Within 7 days",

                    status:
                        "open"

                });

            }


            /*
             * COMPENSATION
             */

            const compensation =
                number(
                    project.compensationPending
                );


            if (compensation > 0) {

                actionItems.push({

                    id:
                        `${project.id}-compensation`,

                    projectId:
                        project.id,

                    project:
                        project.name,

                    type:
                        "compensation",

                    priority:
                        compensation > 100
                            ? "high"
                            : "medium",

                    title:
                        "Review pending compensation",

                    description:
                        `${compensation} compensation cases are still pending.`,

                    owner:
                        "Compensation Cell",

                    due:
                        "Within 14 days",

                    status:
                        "open"

                });

            }


            /*
             * STAKEHOLDER RESPONSE
             */

            const stakeholder =
                number(
                    project.stakeholderResponsiveness
                );


            if (stakeholder < 50) {

                actionItems.push({

                    id:
                        `${project.id}-stakeholder`,

                    projectId:
                        project.id,

                    project:
                        project.name,

                    type:
                        "stakeholder",

                    priority:
                        stakeholder < 30
                            ? "high"
                            : "medium",

                    title:
                        "Escalate stakeholder coordination",

                    description:
                        `Stakeholder responsiveness is ${stakeholder}%. Additional coordination may be required.`,

                    owner:
                        "Project Coordination Cell",

                    due:
                        "Within 7 days",

                    status:
                        "open"

                });

            }


            /*
             * R&R
             */

            const rr =
                window.LandTrack
                    ?.helpers
                    ?.getProjectRR?.(
                        project.id
                    );


            if (
                rr &&
                number(
                    rr.familiesPending
                ) > 75
            ) {

                actionItems.push({

                    id:
                        `${project.id}-rr`,

                    projectId:
                        project.id,

                    project:
                        project.name,

                    type:
                        "rr",

                    priority:
                        number(
                            rr.familiesPending
                        ) > 200
                            ? "critical"
                            : "high",

                    title:
                        "Prioritise R&R cases",

                    description:
                        `${number(
                            rr.familiesPending
                        )} affected families remain pending for rehabilitation or resettlement.`,

                    owner:
                        "R&R Cell",

                    due:
                        "Within 14 days",

                    status:
                        "open"

                });

            }

        });


        /*
         * DEMO ACTIONS
         * Ensures the Action Centre still looks useful
         * even when the dataset has very few issues.
         */

        if (!actionItems.length) {

            actionItems.push({

                id:
                    "demo-monitoring",

                projectId:
                    null,

                project:
                    "Portfolio",

                type:
                    "monitoring",

                priority:
                    "low",

                title:
                    "Continue portfolio monitoring",

                description:
                    "No immediate intervention has been generated from the current demonstration dataset.",

                owner:
                    "Land Acquisition Cell",

                due:
                    "Routine",

                status:
                    "open"

            });

        }

    }



    /* ========================================================
       RENDER PAGE
       ======================================================== */

    function renderPage() {

        actionsView.innerHTML = `

            <div class="actions-page">


                <!-- ==========================================
                     HEADER
                     ========================================== -->

                <div class="actions-header">

                    <div>

                        <span class="section-index">
                            08
                        </span>

                        <div>

                            <p class="eyebrow">
                                ADMINISTRATIVE ACTION
                            </p>

                            <h1>
                                Intelligence is useful
                                <br>
                                only when it moves.
                            </h1>

                            <p class="actions-description">
                                Convert project signals into
                                prioritised actions, assign
                                responsibility and keep track of
                                what still needs attention.
                            </p>

                        </div>

                    </div>


                    <div class="action-summary-badge">

                        <strong
                            id="openActionCount"
                        >
                            —
                        </strong>

                        <span>
                            open actions
                        </span>

                    </div>

                </div>



                <!-- ==========================================
                     SUMMARY
                     ========================================== -->

                <div class="action-metrics">


                    <div>

                        <span>
                            CRITICAL
                        </span>

                        <strong
                            id="criticalActionCount"
                        >
                            0
                        </strong>

                    </div>


                    <div>

                        <span>
                            HIGH PRIORITY
                        </span>

                        <strong
                            id="highActionCount"
                        >
                            0
                        </strong>

                    </div>


                    <div>

                        <span>
                            PROJECTS AFFECTED
                        </span>

                        <strong
                            id="affectedProjectCount"
                        >
                            0
                        </strong>

                    </div>


                    <div>

                        <span>
                            GENERATED BY SIGNALS
                        </span>

                        <strong>
                            AI
                        </strong>

                    </div>

                </div>



                <!-- ==========================================
                     FILTERS
                     ========================================== -->

                <div class="action-toolbar">

                    <div>

                        <button
                            type="button"
                            class="action-filter active"
                            data-filter="all"
                        >
                            All
                        </button>


                        <button
                            type="button"
                            class="action-filter"
                            data-filter="critical"
                        >
                            Critical
                        </button>


                        <button
                            type="button"
                            class="action-filter"
                            data-filter="high"
                        >
                            High
                        </button>


                        <button
                            type="button"
                            class="action-filter"
                            data-filter="medium"
                        >
                            Medium
                        </button>

                    </div>


                    <span
                        id="actionFilterCount"
                    >
                        —
                    </span>

                </div>



                <!-- ==========================================
                     ACTION LIST
                     ========================================== -->

                <section class="actions-workspace">


                    <div class="actions-list-panel">

                        <div class="actions-list-heading">

                            <div>

                                <span>
                                    PRIORITISED QUEUE
                                </span>

                                <h2>
                                    What needs attention
                                </h2>

                            </div>

                        </div>


                        <div
                            class="action-list"
                            id="actionList"
                        ></div>

                    </div>



                    <!-- ======================================
                         ACTION DETAIL
                         ====================================== -->

                    <aside
                        class="action-detail-panel"
                        id="actionDetail"
                    >

                        <div class="action-detail-empty">

                            <span>
                                ACTION INSPECTOR
                            </span>

                            <strong>
                                Select an action
                            </strong>

                            <p>
                                Choose an item from the queue
                                to review its project context
                                and recommended next step.
                            </p>

                        </div>

                    </aside>

                </section>



                <!-- ==========================================
                     WORKFLOW
                     ========================================== -->

                <section class="action-workflow">

                    <div>

                        <span>
                            THE LOOP
                        </span>

                        <h2>
                            Detect → Decide → Act → Verify
                        </h2>

                    </div>


                    <div class="workflow-steps">


                        <div class="workflow-step complete">

                            <b>
                                01
                            </b>

                            <strong>
                                Detect
                            </strong>

                            <span>
                                Risk signal identified
                            </span>

                        </div>


                        <div class="workflow-line"></div>


                        <div class="workflow-step complete">

                            <b>
                                02
                            </b>

                            <strong>
                                Decide
                            </strong>

                            <span>
                                Priority assigned
                            </span>

                        </div>


                        <div class="workflow-line active"></div>


                        <div class="workflow-step active">

                            <b>
                                03
                            </b>

                            <strong>
                                Act
                            </strong>

                            <span>
                                Officer intervention
                            </span>

                        </div>


                        <div class="workflow-line"></div>


                        <div class="workflow-step">

                            <b>
                                04
                            </b>

                            <strong>
                                Verify
                            </strong>

                            <span>
                                Outcome monitored
                            </span>

                        </div>

                    </div>

                </section>



                <div class="actions-disclaimer">

                    <strong>
                        Prototype workflow
                    </strong>

                    <span>
                        Generated actions are demonstration
                        recommendations. In production,
                        assignment, escalation and approvals
                        would follow authorised departmental
                        workflows.
                    </span>

                </div>


            </div>

        `;


        attachEvents();

        buildActions();

        renderActions();

        updateMetrics();

    }



    /* ========================================================
       RENDER ACTION LIST
       ======================================================== */

    function renderActions() {

        const container =
            document.getElementById(
                "actionList"
            );


        if (!container) {
            return;
        }


        let visibleActions =
            actionItems;


        if (
            selectedFilter !==
            "all"
        ) {

            visibleActions =
                actionItems.filter(
                    action =>
                        action.priority ===
                        selectedFilter
                );

        }


        document
            .getElementById(
                "actionFilterCount"
            )
            ?.replaceChildren(
                document.createTextNode(
                    `${visibleActions.length} items`
                )
            );


        if (!visibleActions.length) {

            container.innerHTML = `

                <div class="action-empty">

                    <strong>
                        Nothing in this queue.
                    </strong>

                    <span>
                        No actions match the selected priority.
                    </span>

                </div>

            `;

            return;

        }


        container.innerHTML =
            visibleActions
                .map(
                    action => `

                        <button
                            type="button"
                            class="action-item ${action.priority}"
                            data-action-id="${escapeHTML(
                                action.id
                            )}"
                        >

                            <div class="action-priority">

                                <span>
                                    ${escapeHTML(
                                        action.priority
                                    )}
                                </span>

                            </div>


                            <div class="action-main">

                                <strong>
                                    ${escapeHTML(
                                        action.title
                                    )}
                                </strong>

                                <span>
                                    ${escapeHTML(
                                        action.project
                                    )}
                                </span>

                                <small>
                                    ${escapeHTML(
                                        action.description
                                    )}
                                </small>

                            </div>


                            <div class="action-owner">

                                <span>
                                    OWNER
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        action.owner
                                    )}
                                </strong>

                            </div>


                            <div class="action-due">

                                <span>
                                    DUE
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        action.due
                                    )}
                                </strong>

                            </div>


                            <div class="action-arrow">
                                →
                            </div>

                        </button>

                    `
                )
                .join("");


        container
            .querySelectorAll(
                "[data-action-id]"
            )
            .forEach(
                item => {

                    item.addEventListener(
                        "click",
                        () => {

                            selectAction(
                                item.dataset
                                    .actionId
                            );

                        }
                    );

                }
            );

    }



    /* ========================================================
       ACTION DETAIL
       ======================================================== */

    function selectAction(
        actionId
    ) {

        const action =
            actionItems.find(
                item =>
                    item.id === actionId
            );


        if (!action) {
            return;
        }


        const detail =
            document.getElementById(
                "actionDetail"
            );


        if (!detail) {
            return;
        }


        const project =
            action.projectId
                ? window.LandTrack
                    ?.projects
                    ?.find(
                        item =>
                            item.id ===
                            action.projectId
                    )
                : null;


        detail.innerHTML = `

            <div class="action-detail">

                <span class="action-detail-eyebrow">
                    ${escapeHTML(
                        action.priority
                    )} PRIORITY
                </span>


                <h2>
                    ${escapeHTML(
                        action.title
                    )}
                </h2>


                <p class="action-detail-project">
                    ${escapeHTML(
                        action.project
                    )}
                </p>


                <div class="action-detail-status">

                    <span>
                        CURRENT STATUS
                    </span>

                    <strong>
                        ${escapeHTML(
                            action.status
                        )}
                    </strong>

                </div>


                <div class="action-detail-description">

                    <span>
                        WHY THIS MATTERS
                    </span>

                    <p>
                        ${escapeHTML(
                            action.description
                        )}
                    </p>

                </div>


                ${
                    project
                        ? `

                            <div class="action-project-context">

                                <span>
                                    PROJECT CONTEXT
                                </span>


                                <div>

                                    <strong>
                                        ${number(
                                            project.riskScore
                                        )}%
                                    </strong>

                                    <small>
                                        delay risk
                                    </small>

                                </div>


                                <div>

                                    <strong>
                                        ${number(
                                            project.predictedDelayDays
                                        )}
                                    </strong>

                                    <small>
                                        predicted delay days
                                    </small>

                                </div>

                            </div>

                        `
                        : ""
                }


                <div class="action-assignment">

                    <div>

                        <span>
                            RESPONSIBLE
                        </span>

                        <strong>
                            ${escapeHTML(
                                action.owner
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            TARGET
                        </span>

                        <strong>
                            ${escapeHTML(
                                action.due
                            )}
                        </strong>

                    </div>

                </div>


                <div class="action-detail-actions">

                    ${
                        project
                            ? `

                                <button
                                    type="button"
                                    class="action-primary"
                                    data-open-project="${escapeHTML(
                                        project.id
                                    )}"
                                >
                                    Investigate project
                                    <span>→</span>
                                </button>

                            `
                            : ""
                    }


                    <button
                        type="button"
                        class="action-complete"
                        data-complete-action="${escapeHTML(
                            action.id
                        )}"
                    >
                        Mark action complete
                    </button>

                </div>

            </div>

        `;


        detail
            .querySelector(
                "[data-open-project]"
            )
            ?.addEventListener(
                "click",
                () => {

                    const id =
                        detail
                            .querySelector(
                                "[data-open-project]"
                            )
                            .dataset
                            .openProject;


                    window.LandTrackApp
                        ?.openProjectDrawer(
                            id
                        );

                }
            );


        detail
            .querySelector(
                "[data-complete-action]"
            )
            ?.addEventListener(
                "click",
                () => {

                    completeAction(
                        action.id
                    );

                }
            );

    }



    /* ========================================================
       COMPLETE ACTION
       ======================================================== */

    function completeAction(
        actionId
    ) {

        const action =
            actionItems.find(
                item =>
                    item.id ===
                    actionId
            );


        if (!action) {
            return;
        }


        action.status =
            "completed";


        actionItems =
            actionItems.filter(
                item =>
                    item.id !==
                    actionId
            );


        renderActions();

        updateMetrics();


        document
            .querySelector(
                "#actionDetail"
            )
            ?.replaceChildren();


        const detail =
            document.getElementById(
                "actionDetail"
            );


        if (detail) {

            detail.innerHTML = `

                <div class="action-detail-empty">

                    <span>
                        ACTION COMPLETED
                    </span>

                    <strong>
                        Good. One less thing.
                    </strong>

                    <p>
                        The action has been removed from
                        the active queue for this prototype.
                    </p>

                </div>

            `;

        }


        window.LandTrackApp
            ?.showToast(
                "Action marked as complete."
            );

    }



    /* ========================================================
       METRICS
       ======================================================== */

    function updateMetrics() {

        const critical =
            actionItems.filter(
                action =>
                    action.priority ===
                    "critical"
            ).length;


        const high =
            actionItems.filter(
                action =>
                    action.priority ===
                    "high"
            ).length;


        const projects =
            new Set(
                actionItems
                    .map(
                        action =>
                            action.projectId
                    )
                    .filter(Boolean)
            );


        setText(
            "openActionCount",
            actionItems.length
        );


        setText(
            "criticalActionCount",
            critical
        );


        setText(
            "highActionCount",
            high
        );


        setText(
            "affectedProjectCount",
            projects.size
        );

    }



    /* ========================================================
       EVENTS
       ======================================================== */

    function attachEvents() {

        document
            .querySelectorAll(
                ".action-filter"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () => {

                            selectedFilter =
                                button.dataset
                                    .filter;


                            document
                                .querySelectorAll(
                                    ".action-filter"
                                )
                                .forEach(
                                    item =>
                                        item.classList
                                            .remove(
                                                "active"
                                            )
                                );


                            button.classList.add(
                                "active"
                            );


                            renderActions();

                        }
                    );

                }
            );

    }



    /* ========================================================
       TEXT HELPER
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



    /* ========================================================
       PROJECT UPDATE LISTENER
       ======================================================== */

    document.addEventListener(
        "landtrack:projectselected",
        () => {

            buildActions();

            renderActions();

            updateMetrics();

        }
    );



    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.LandTrackActions = {

        refresh: () => {

            buildActions();

            renderActions();

            updateMetrics();

        },

        getActions:
            () => actionItems,

        complete:
            completeAction

    };



    /* ========================================================
       INITIALIZE
       ======================================================== */

    renderPage();

});