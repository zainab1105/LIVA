/* ============================================================
   LANDTRACK AI
   PREDICTIVE INTELLIGENCE CONTROLLER
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    const predictionView =
        document.getElementById("predictionView");

    if (!predictionView) {
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


    function riskClass(score) {

        score = number(score);

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


    function riskLabel(score) {

        const value = number(score);

        if (value >= 80) {
            return "Critical";
        }

        if (value >= 65) {
            return "High";
        }

        if (value >= 50) {
            return "Medium";
        }

        return "Low";

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
       RENDER PAGE
       ======================================================== */

    function renderPrediction() {

        predictionView.innerHTML = `

            <div class="prediction-page">


                <!-- ==========================================
                     HEADER
                     ========================================== -->

                <div class="prediction-header">

                    <div>

                        <span class="section-index">
                            04
                        </span>

                        <div>

                            <p class="eyebrow">
                                PREDICTIVE INTELLIGENCE
                            </p>

                            <h1>
                                Don't just see the risk.
                                <br>
                                Understand it.
                            </h1>

                            <p class="prediction-description">
                                LandTrack analyses project conditions
                                to identify where acquisition delay
                                is most likely to occur and why.
                            </p>

                        </div>

                    </div>


                    <div class="prediction-status">

                        <span class="prediction-status-dot"></span>

                        MODEL ACTIVE

                    </div>

                </div>



                <!-- ==========================================
                     PROJECT SELECTOR
                     ========================================== -->

                <div class="prediction-selector">

                    <label>
                        PROJECT UNDER ANALYSIS
                    </label>

                    <select
                        id="predictionProject"
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
                     MAIN RISK READING
                     ========================================== -->

                <div class="prediction-hero">


                    <div class="prediction-score-card">

                        <div class="prediction-score-heading">

                            <span>
                                PREDICTED DELAY RISK
                            </span>

                            <span
                                id="predictionRiskLabel"
                            >
                                —
                            </span>

                        </div>


                        <div class="prediction-score">

                            <strong
                                id="predictionRisk"
                            >
                                —
                            </strong>

                            <span>
                                %
                            </span>

                        </div>


                        <div class="prediction-risk-bar">

                            <div
                                id="predictionRiskFill"
                            ></div>

                        </div>


                        <div class="prediction-score-footer">

                            <span>
                                Confidence
                            </span>

                            <strong
                                id="predictionConfidence"
                            >
                                —
                            </strong>

                        </div>

                    </div>



                    <!-- DELAY -->

                    <div class="prediction-delay-card">

                        <span>
                            EXPECTED DELAY
                        </span>

                        <strong
                            id="predictionDelay"
                        >
                            —
                        </strong>

                        <small>
                            days
                        </small>

                        <p>
                            Estimated additional time
                            if current conditions continue.
                        </p>

                    </div>



                    <!-- PRIMARY DRIVER -->

                    <div class="prediction-driver-card">

                        <span>
                            PRIMARY DELAY DRIVER
                        </span>

                        <strong
                            id="predictionDriver"
                        >
                            —
                        </strong>

                        <p
                            id="predictionDriverText"
                        >
                            —
                        </p>

                    </div>

                </div>



                <!-- ==========================================
                     ANALYSIS
                     ========================================== -->

                <div class="prediction-analysis">


                    <!-- FACTORS -->

                    <section class="prediction-panel">

                        <div class="prediction-panel-heading">

                            <div>

                                <span>
                                    01 · CONTRIBUTING FACTORS
                                </span>

                                <h2>
                                    Why is this project at risk?
                                </h2>

                            </div>

                        </div>


                        <div
                            class="prediction-factors"
                            id="predictionFactors"
                        ></div>

                    </section>



                    <!-- SIGNALS -->

                    <section class="prediction-panel signals-panel">

                        <div class="prediction-panel-heading">

                            <div>

                                <span>
                                    02 · PROJECT SIGNALS
                                </span>

                                <h2>
                                    Current conditions
                                </h2>

                            </div>

                        </div>


                        <div
                            class="prediction-signals"
                            id="predictionSignals"
                        ></div>

                    </section>


                </div>



                <!-- ==========================================
                     AI INTERPRETATION
                     ========================================== -->

                <section class="prediction-interpretation">


                    <div class="interpretation-label">

                        <span>
                            AI INTERPRETATION
                        </span>

                        <div class="interpretation-line"></div>

                    </div>


                    <div class="interpretation-content">

                        <h2
                            id="predictionRecommendation"
                        >
                            —
                        </h2>

                        <p>
                            This is a prototype interpretation
                            generated from the demonstration
                            project's risk and acquisition data.
                        </p>

                    </div>


                </section>



                <!-- ==========================================
                     NEXT ACTION
                     ========================================== -->

                <section class="prediction-next-action">

                    <div>

                        <span>
                            NEXT DECISION
                        </span>

                        <h2>
                            What should the officer do next?
                        </h2>

                        <p>
                            Move from prediction to intervention
                            and test how administrative action
                            could change the projected outcome.
                        </p>

                    </div>


                    <button
                        type="button"
                        id="predictionSimulatorButton"
                    >

                        Open intervention simulator

                        <span>
                            →
                        </span>

                    </button>

                </section>



                <div class="prediction-disclaimer">

                    <strong>
                        Prototype intelligence
                    </strong>

                    <span>
                        Risk scores and predicted delays are
                        demonstration values. A production system
                        would require validated historical datasets,
                        model evaluation and appropriate government
                        data governance.
                    </span>

                </div>


            </div>

        `;


        attachEvents();

        updatePrediction();

    }



    /* ========================================================
       UPDATE PREDICTION
       ======================================================== */

    function updatePrediction() {

        if (!selectedProject) {
            return;
        }


        const risk =
            number(
                selectedProject.riskScore
            );


        const confidence =
            number(
                selectedProject.confidenceScore
            );


        const delay =
            number(
                selectedProject.predictedDelayDays
            );


        const label =
            riskLabel(risk);


        const riskElement =
            document.getElementById(
                "predictionRisk"
            );


        const riskLabelElement =
            document.getElementById(
                "predictionRiskLabel"
            );


        const confidenceElement =
            document.getElementById(
                "predictionConfidence"
            );


        const delayElement =
            document.getElementById(
                "predictionDelay"
            );


        const driverElement =
            document.getElementById(
                "predictionDriver"
            );


        const driverTextElement =
            document.getElementById(
                "predictionDriverText"
            );


        const recommendationElement =
            document.getElementById(
                "predictionRecommendation"
            );


        if (riskElement) {

            riskElement.textContent =
                risk;

        }


        if (riskLabelElement) {

            riskLabelElement.textContent =
                label;

            riskLabelElement.className =
                riskClass(risk);

        }


        if (confidenceElement) {

            confidenceElement.textContent =
                `${confidence}%`;

        }


        if (delayElement) {

            delayElement.textContent =
                delay;

        }


        if (driverElement) {

            driverElement.textContent =
                selectedProject
                    .primaryDelayDriver
                    || "Multiple factors";

        }


        if (driverTextElement) {

            driverTextElement.textContent =
                getDriverExplanation(
                    selectedProject
                        .primaryDelayDriver
                );

        }


        if (recommendationElement) {

            recommendationElement.textContent =
                selectedProject
                    .aiRecommendation
                    || "No recommendation available.";

        }


        const riskFill =
            document.getElementById(
                "predictionRiskFill"
            );


        if (riskFill) {

            riskFill.style.width =
                `${risk}%`;

            riskFill.className =
                riskClass(risk);

        }


        renderFactors();

        renderSignals();

    }



    /* ========================================================
       DRIVER EXPLANATION
       ======================================================== */

    function getDriverExplanation(
        driver
    ) {

        if (!driver) {

            return "The model has identified multiple contributing factors.";

        }


        const text =
            driver.toLowerCase();


        if (
            text.includes("compensation")
        ) {

            return "Pending compensation cases can prevent the project from progressing to possession.";

        }


        if (
            text.includes("ownership")
        ) {

            return "Conflicting ownership information can delay verification, award processing and legal clearance.";

        }


        if (
            text.includes("survey")
        ) {

            return "Pending surveys and boundary verification can block downstream acquisition stages.";

        }


        if (
            text.includes("award")
        ) {

            return "Pending award processing is creating a bottleneck before compensation can proceed.";

        }


        if (
            text.includes("document")
        ) {

            return "Incomplete records may require additional verification before the next acquisition stage.";

        }


        if (
            text.includes("possession")
        ) {

            return "Coordination around possession is currently the strongest source of predicted delay.";

        }


        return "This factor currently contributes the highest share of the project's predicted delay risk.";

    }



    /* ========================================================
       FACTORS
       ======================================================== */

    function renderFactors() {

        const container =
            document.getElementById(
                "predictionFactors"
            );


        if (!container) {
            return;
        }


        const factors =
            selectedProject
                ?.delayDrivers || [];


        if (!factors.length) {

            container.innerHTML = `

                <div class="prediction-empty">
                    No contributing factors available.
                </div>

            `;

            return;

        }


        container.innerHTML =
            factors
                .map(
                    (factor, index) => {

                        const percentage =
                            number(
                                factor.percentage
                            );


                        return `

                            <div class="prediction-factor">

                                <div class="factor-top">

                                    <div>

                                        <span class="factor-number">
                                            ${String(
                                                index + 1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                factor.name
                                            )}
                                        </strong>

                                    </div>

                                    <b>
                                        ${percentage}%
                                    </b>

                                </div>


                                <div class="factor-track">

                                    <div
                                        style="width:${percentage}%"
                                    ></div>

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");

    }



    /* ========================================================
       CURRENT SIGNALS
       ======================================================== */

    function renderSignals() {

        const container =
            document.getElementById(
                "predictionSignals"
            );


        if (!container) {
            return;
        }


        const project =
            selectedProject;


        const signals = [

            {
                name: "Land acquired",

                value:
                    `${number(
                        project.landAcquired
                    )} / ${number(
                        project.totalLandRequired
                    )} Ha`,

                status:
                    getProgressStatus(
                        project.landAcquired,
                        project.totalLandRequired
                    )

            },


            {
                name: "Documentation",

                value:
                    `${number(
                        project.documentCompleteness
                    )}% complete`,

                status:
                    getSignalStatus(
                        project.documentCompleteness
                    )

            },


            {
                name: "Stakeholder response",

                value:
                    `${number(
                        project.stakeholderResponsiveness
                    )}%`,

                status:
                    getSignalStatus(
                        project.stakeholderResponsiveness
                    )

            },


            {
                name: "Department coordination",

                value:
                    `${number(
                        project.departmentCoordination
                    )}%`,

                status:
                    getSignalStatus(
                        project.departmentCoordination
                    )

            },


            {
                name: "Legal disputes",

                value:
                    `${number(
                        project.legalDisputes
                    )}`,

                status:
                    project.legalDisputes > 15
                        ? "Elevated"
                        : project.legalDisputes > 5
                            ? "Moderate"
                            : "Low"

            },


            {
                name: "Court cases",

                value:
                    `${number(
                        project.courtCases
                    )}`,

                status:
                    project.courtCases > 8
                        ? "Elevated"
                        : project.courtCases > 3
                            ? "Moderate"
                            : "Low"

            }

        ];


        container.innerHTML =
            signals
                .map(
                    signal => `

                        <div class="prediction-signal">

                            <div>

                                <span>
                                    ${escapeHTML(
                                        signal.name
                                    )}
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        signal.value
                                    )}
                                </strong>

                            </div>

                            <b>
                                ${escapeHTML(
                                    signal.status
                                )}
                            </b>

                        </div>

                    `
                )
                .join("");

    }



    /* ========================================================
       SIGNAL HELPERS
       ======================================================== */

    function getSignalStatus(
        value
    ) {

        value = number(value);


        if (value >= 80) {
            return "Strong";
        }


        if (value >= 60) {
            return "Moderate";
        }


        return "Needs attention";

    }


    function getProgressStatus(
        current,
        total
    ) {

        current = number(current);

        total = number(total);


        if (!total) {
            return "Unknown";
        }


        const percentage =
            (current / total) * 100;


        if (percentage >= 80) {
            return "Strong";
        }


        if (percentage >= 60) {
            return "Moderate";
        }


        return "Needs attention";

    }



    /* ========================================================
       EVENTS
       ======================================================== */

    function attachEvents() {

        const selector =
            document.getElementById(
                "predictionProject"
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


                updatePrediction();


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
                "predictionSimulatorButton"
            )
            ?.addEventListener(
                "click",
                () => {

                    if (
                        window.LandTrackApp
                            ?.switchView
                    ) {

                        window.LandTrackApp
                            .switchView(
                                "simulator"
                            );

                    }

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
                    "predictionProject"
                );


            if (selector) {

                selector.value =
                    project.id;

            }


            updatePrediction();

        }
    );



    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.LandTrackPrediction = {

        getSelectedProject:
            () => selectedProject,

        update:
            updatePrediction,

        riskClass,

        riskLabel

    };



    /* ========================================================
       INITIALIZE
       ======================================================== */

    renderPrediction();

});