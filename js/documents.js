/* ============================================================
   LANDTRACK AI
   DOCUMENT INTELLIGENCE CONTROLLER
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const projects =
        window.LandTrack?.projects || [];

    const documentsView =
        document.getElementById(
            "documentsView"
        );


    if (!documentsView) {
        return;
    }


    let selectedProject =
        projects[0] || null;


    /* ========================================================
       DEMO DOCUMENT DATA
       ======================================================== */

    const documentTypes = [

        {
            key: "landRecord",
            name: "Land Record / 7-12",
            category: "Land ownership",
            required: true
        },

        {
            key: "surveyPlan",
            name: "Survey Plan",
            category: "Survey",
            required: true
        },

        {
            key: "valuationReport",
            name: "Valuation Report",
            category: "Valuation",
            required: true
        },

        {
            key: "awardDocument",
            name: "Award Document",
            category: "Acquisition",
            required: true
        },

        {
            key: "compensationRecord",
            name: "Compensation Record",
            category: "Compensation",
            required: true
        },

        {
            key: "rrRecord",
            name: "R&R Record",
            category: "Rehabilitation",
            required: true
        },

        {
            key: "legalClearance",
            name: "Legal Clearance",
            category: "Legal",
            required: true
        },

        {
            key: "consentRecord",
            name: "Stakeholder / Consent Record",
            category: "Stakeholder",
            required: false
        }

    ];


    /* ========================================================
       DOCUMENT STATUS GENERATOR
       ======================================================== */

    function getDocumentStatus(
        project,
        document
    ) {

        const completeness =
            Number(
                project.documentCompleteness || 0
            );


        const risk =
            Number(
                project.riskScore || 0
            );


        /*
         * Prototype logic:
         * document state is derived from the
         * project's demo completeness/risk.
         */

        if (
            completeness >= 85
        ) {

            return {
                status: "Verified",
                className: "verified"
            };

        }


        if (
            completeness >= 60
        ) {

            if (
                document.key ===
                "legalClearance" &&
                risk >= 70
            ) {

                return {
                    status: "Review required",
                    className: "review"
                };

            }


            return {
                status: "Available",
                className: "available"
            };

        }


        if (
            completeness >= 35
        ) {

            if (
                document.required
            ) {

                return {
                    status: "Incomplete",
                    className: "incomplete"
                };

            }


            return {
                status: "Not available",
                className: "missing"
            };

        }


        return {

            status:
                document.required
                    ? "Missing"
                    : "Not uploaded",

            className:
                document.required
                    ? "missing"
                    : "optional"

        };

    }


    /* ========================================================
       MISSING DOCUMENTS
       ======================================================== */

    function getMissingDocuments(
        project
    ) {

        return documentTypes.filter(
            document => {

                const result =
                    getDocumentStatus(
                        project,
                        document
                    );


                return (
                    result.className ===
                    "missing" ||
                    result.className ===
                    "incomplete"
                );

            }
        );

    }


    /* ========================================================
       DOCUMENT SCORE
       ======================================================== */

    function calculateDocumentScore(
        project
    ) {

        if (!project) {
            return 0;
        }


        const completeness =
            Number(
                project.documentCompleteness || 0
            );


        return Math.max(
            0,
            Math.min(
                100,
                Math.round(completeness)
            )
        );

    }


    /* ========================================================
       BUILD PAGE
       ======================================================== */

    function renderDocuments() {

        documentsView.innerHTML = `

            <div class="documents-page">


                <div class="documents-header">

                    <div>

                        <span class="section-index">
                            06
                        </span>

                        <div>

                            <p class="eyebrow">
                                DOCUMENT INTELLIGENCE
                            </p>

                            <h1>
                                Know what the file
                                <br>
                                is still missing.
                            </h1>

                            <p class="documents-description">
                                Review acquisition records,
                                identify missing information,
                                and surface documents that
                                require administrative attention.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        class="document-upload-button"
                        id="demoUploadButton"
                    >
                        + Add document
                    </button>

                </div>



                <!-- PROJECT SELECT -->

                <div class="document-project-selector">

                    <label>
                        PROJECT
                    </label>

                    <select
                        id="documentProject"
                    >

                        ${
                            projects
                                .map(
                                    project => `

                                        <option
                                            value="${project.id}"
                                        >
                                            ${project.name}
                                            · ${project.district},
                                            ${project.state}
                                        </option>

                                    `
                                )
                                .join("")
                        }

                    </select>

                </div>



                <!-- DOCUMENT SUMMARY -->

                <div class="document-summary">


                    <div class="document-score">

                        <span>
                            DOCUMENT COMPLETENESS
                        </span>

                        <strong
                            id="documentScore"
                        >
                            —
                        </strong>

                        <small>
                            of required information
                        </small>

                    </div>


                    <div class="document-summary-stat">

                        <span>
                            VERIFIED
                        </span>

                        <strong
                            id="verifiedDocuments"
                        >
                            —
                        </strong>

                    </div>


                    <div class="document-summary-stat warning">

                        <span>
                            NEEDS REVIEW
                        </span>

                        <strong
                            id="reviewDocuments"
                        >
                            —
                        </strong>

                    </div>


                    <div class="document-summary-stat danger">

                        <span>
                            MISSING
                        </span>

                        <strong
                            id="missingDocuments"
                        >
                            —
                        </strong>

                    </div>

                </div>



                <!-- DOCUMENT WORKSPACE -->

                <div class="document-workspace">


                    <section class="document-list-panel">


                        <div class="document-list-heading">

                            <div>

                                <span>
                                    ACQUISITION FILE
                                </span>

                                <h2>
                                    Required records
                                </h2>

                            </div>

                            <span
                                id="documentCount"
                            >
                                —
                            </span>

                        </div>


                        <div
                            class="document-list"
                            id="documentList"
                        ></div>


                    </section>



                    <!-- INSPECTION PANEL -->

                    <aside
                        class="document-inspector"
                        id="documentInspector"
                    >

                        <div class="inspector-empty">

                            <span>
                                DOCUMENT INSPECTOR
                            </span>

                            <strong>
                                Select a record
                            </strong>

                            <p>
                                Choose a document from the
                                acquisition file to inspect
                                its status and information.
                            </p>

                        </div>

                    </aside>


                </div>



                <!-- AI DOCUMENT SIGNAL -->

                <section class="document-ai-signal">


                    <div>

                        <span>
                            AI DOCUMENT SIGNAL
                        </span>

                        <h2>
                            ${
                                selectedProject
                                    ? getMissingDocuments(
                                        selectedProject
                                    ).length
                                    : 0
                            }
                            records may require attention.
                        </h2>

                        <p
                            id="documentSignalText"
                        >
                            The prototype analyses document
                            completeness and project risk to
                            highlight records that may delay
                            acquisition processing.
                        </p>

                    </div>


                    <button
                        type="button"
                        id="runDocumentCheck"
                    >
                        Run document check
                        →
                    </button>

                </section>


                <!-- DEMO NOTICE -->

                <div class="documents-disclaimer">

                    <strong>
                        Prototype environment
                    </strong>

                    <span>
                        Document analysis shown here is
                        simulated using demonstration project
                        data. Production deployment can connect
                        OCR, document classification and
                        verification services.
                    </span>

                </div>

            </div>

        `;


        attachDocumentEvents();

        updateDocumentView();

    }


    /* ========================================================
       UPDATE SUMMARY
       ======================================================== */

    function updateDocumentView() {

        if (!selectedProject) {
            return;
        }


        const score =
            calculateDocumentScore(
                selectedProject
            );


        const scoreElement =
            document.getElementById(
                "documentScore"
            );


        if (scoreElement) {

            scoreElement.textContent =
                `${score}%`;

        }


        const statusCounts = {

            verified: 0,

            review: 0,

            missing: 0

        };


        documentTypes.forEach(
            document => {

                const result =
                    getDocumentStatus(
                        selectedProject,
                        document
                    );


                if (
                    result.className ===
                    "verified"
                ) {

                    statusCounts.verified++;

                }


                if (
                    result.className ===
                    "review" ||
                    result.className ===
                    "incomplete"
                ) {

                    statusCounts.review++;

                }


                if (
                    result.className ===
                    "missing"
                ) {

                    statusCounts.missing++;

                }

            }
        );


        const verified =
            document.getElementById(
                "verifiedDocuments"
            );


        const review =
            document.getElementById(
                "reviewDocuments"
            );


        const missing =
            document.getElementById(
                "missingDocuments"
            );


        const count =
            document.getElementById(
                "documentCount"
            );


        if (verified) {

            verified.textContent =
                statusCounts.verified;

        }


        if (review) {

            review.textContent =
                statusCounts.review;

        }


        if (missing) {

            missing.textContent =
                statusCounts.missing;

        }


        if (count) {

            count.textContent =
                `${documentTypes.length} records`;

        }


        renderDocumentList();

    }


    /* ========================================================
       DOCUMENT LIST
       ======================================================== */

    function renderDocumentList() {

        const container =
            document.getElementById(
                "documentList"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        documentTypes.forEach(
            document => {

                const result =
                    getDocumentStatus(
                        selectedProject,
                        document
                    );


                const item =
                    documentElement(
                        document,
                        result
                    );


                container.appendChild(
                    item
                );

            }
        );

    }


    function documentElement(
        document,
        result
    ) {

        const item =
            window.document
                .createElement(
                    "button"
                );


        item.type =
            "button";


        item.className =
            `document-row ${result.className}`;


        item.innerHTML = `

            <span class="document-icon">
                ${getDocumentIcon(
                    result.className
                )}
            </span>

            <span class="document-main">

                <strong>
                    ${document.name}
                </strong>

                <small>
                    ${document.category}
                </small>

            </span>

            <span
                class="document-status"
            >
                ${result.status}
            </span>

            <span class="document-arrow">
                →
            </span>

        `;


        item.addEventListener(
            "click",
            () => {

                inspectDocument(
                    document,
                    result
                );

            }
        );


        return item;

    }


    /* ========================================================
       ICONS
       ======================================================== */

    function getDocumentIcon(
        status
    ) {

        if (
            status ===
            "verified"
        ) {

            return "✓";

        }


        if (
            status ===
            "review" ||
            status ===
            "incomplete"
        ) {

            return "!";

        }


        if (
            status ===
            "missing"
        ) {

            return "×";

        }


        return "•";

    }


    /* ========================================================
       INSPECT DOCUMENT
       ======================================================== */

    function inspectDocument(
        document,
        result
    ) {

        const inspector =
            document.getElementById(
                "documentInspector"
            );


        if (!inspector) {
            return;
        }


        const project =
            selectedProject;


        const risk =
            Number(
                project?.riskScore || 0
            );


        let message =
            "This record is available in the prototype file.";


        if (
            result.className ===
            "missing"
        ) {

            message =
                "This required record has not been detected in the current project data and may need administrative follow-up.";

        }


        if (
            result.className ===
            "incomplete"
        ) {

            message =
                "The record is present but the prototype indicates that its information may be incomplete.";

        }


        if (
            result.className ===
            "review"
        ) {

            message =
                "This record should be reviewed because the project currently carries elevated acquisition risk.";

        }


        if (
            result.className ===
            "verified"
        ) {

            message =
                "The prototype considers this record complete based on the project's current document score.";

        }


        inspector.innerHTML = `

            <div class="inspector-header">

                <span>
                    RECORD INSPECTION
                </span>

                <strong>
                    ${result.status}
                </strong>

            </div>


            <div class="inspector-document-icon">
                ${getDocumentIcon(
                    result.className
                )}
            </div>


            <h2>
                ${document.name}
            </h2>


            <p class="inspector-category">
                ${document.category}
            </p>


            <div class="inspector-status-box ${result.className}">

                <span>
                    CURRENT STATUS
                </span>

                <strong>
                    ${result.status}
                </strong>

            </div>


            <div class="inspector-details">

                <div>

                    <span>
                        Project
                    </span>

                    <strong>
                        ${project?.name || "—"}
                    </strong>

                </div>


                <div>

                    <span>
                        Project risk
                    </span>

                    <strong>
                        ${risk}%
                    </strong>

                </div>


                <div>

                    <span>
                        Required
                    </span>

                    <strong>
                        ${document.required
                            ? "Yes"
                            : "Optional"}
                    </strong>

                </div>

            </div>


            <div class="inspector-analysis">

                <span>
                    SYSTEM NOTE
                </span>

                <p>
                    ${message}
                </p>

            </div>


            ${
                result.className ===
                "missing"
                    ? `
                        <button
                            type="button"
                            class="inspector-action"
                            id="requestDocument"
                        >
                            Request document
                            →
                        </button>
                    `
                    : `
                        <button
                            type="button"
                            class="inspector-action"
                            id="runOCR"
                        >
                            Run document analysis
                            →
                        </button>
                    `
            }

        `;


        document
            .getElementById(
                "requestDocument"
            )
            ?.addEventListener(
                "click",
                () => {

                    showDocumentToast(
                        `Document request created for ${document.name}.`
                    );

                }
            );


        document
            .getElementById(
                "runOCR"
            )
            ?.addEventListener(
                "click",
                () => {

                    showDocumentToast(
                        "Demo document analysis completed."
                    );

                }
            );

    }


    /* ========================================================
       PROJECT CHANGE
       ======================================================== */

    function attachDocumentEvents() {

        const projectSelect =
            document.getElementById(
                "documentProject"
            );


        projectSelect?.addEventListener(
            "change",
            event => {

                selectedProject =
                    projects.find(
                        project =>
                            project.id ===
                            event.target.value
                    ) || null;


                updateDocumentView();

            }
        );


        document
            .getElementById(
                "runDocumentCheck"
            )
            ?.addEventListener(
                "click",
                runDocumentCheck
            );


        document
            .getElementById(
                "demoUploadButton"
            )
            ?.addEventListener(
                "click",
                () => {

                    showDocumentToast(
                        "Demo upload interface opened."
                    );

                }
            );

    }


    /* ========================================================
       DOCUMENT CHECK
       ======================================================== */

    function runDocumentCheck() {

        if (!selectedProject) {
            return;
        }


        const missing =
            getMissingDocuments(
                selectedProject
            );


        const signal =
            document.getElementById(
                "documentSignalText"
            );


        if (!signal) {
            return;
        }


        if (!missing.length) {

            signal.textContent =
                "No major document gaps were detected in the current demonstration project.";

        } else {

            signal.textContent =
                `${missing.length} record(s) require attention: ` +
                missing
                    .map(
                        document =>
                            document.name
                    )
                    .join(", ") +
                ".";

        }


        showDocumentToast(
            "Document intelligence check completed."
        );

    }


    /* ========================================================
       TOAST
       ======================================================== */

    function showDocumentToast(
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
                    () =>
                        toast.remove(),
                    250
                );

            },
            3000
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


            const select =
                document.getElementById(
                    "documentProject"
                );


            if (select) {

                select.value =
                    project.id;

            }


            updateDocumentView();

        }
    );


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.LandTrackDocuments = {

        getSelectedProject:
            () => selectedProject,

        getMissingDocuments,

        calculateDocumentScore,

        runCheck:
            runDocumentCheck,

        inspect:
            inspectDocument

    };


    /* ========================================================
       INITIALIZE
       ======================================================== */

    renderDocuments();

});