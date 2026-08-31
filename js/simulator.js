document.addEventListener("DOMContentLoaded", () => {

    const projects =
        window.LandTrack?.projects || [];

    const simulatorView =
        document.getElementById(
            "simulatorView"
        );

    if (!simulatorView) {
        return;
    }


    /* ========================================================
       SIMULATOR STATE
       ======================================================== */

    let selectedProject =
        projects[0] || null;


    let simulation = {

        surveyAcceleration: 0,

        disputeResolution: 0,

        compensationAcceleration: 0,

        documentCompletion: 0,

        stakeholderCoordination: 0

    };


    /* ========================================================
       HELPERS
       ======================================================== */

    function number(value) {

        const parsed =
            Number(value);

        return Number.isFinite(parsed)
            ? parsed
            : 0;

    }


    function clamp(
        value,
        minimum,
        maximum
    ) {

        return Math.max(
            minimum,
            Math.min(
                maximum,
                value
            )
        );

    }


    function calculateSimulation() {

        if (!selectedProject) {

            return {

                baselineRisk: 0,

                simulatedRisk: 0,

                baselineDelay: 0,

                simulatedDelay: 0,

                riskReduction: 0,

                daysRecovered: 0

            };

        }


        const baselineRisk =
            number(
                selectedProject.riskScore
            );


        const baselineDelay =
            number(
                selectedProject
                    .predictedDelayDays
            );


        /*
         * Prototype intervention weights.
         * These are demonstration values,
         * not real-world predictive coefficients.
         */

        const riskReduction =

            simulation
                .surveyAcceleration
                * 0.12

            +

            simulation
                .disputeResolution
                * 0.18

            +

            simulation
                .compensationAcceleration
                * 0.16

            +

            simulation
                .documentCompletion
                * 0.08

            +

            simulation
                .stakeholderCoordination
                * 0.10;


        const simulatedRisk =
            clamp(
                Math.round(
                    baselineRisk -
                    riskReduction
                ),
                0,
                100
            );


        const delayReduction =
            Math.round(
                baselineDelay *
                (
                    riskReduction /
                    Math.max(
                        baselineRisk,
                        1
                    )
                )
            );


        const simulatedDelay =
            Math.max(
                0,
                baselineDelay -
                delayReduction
            );


        return {

            baselineRisk,

            simulatedRisk,

            baselineDelay,

            simulatedDelay,

            riskReduction:
                baselineRisk -
                simulatedRisk,

            daysRecovered:
                baselineDelay -
                simulatedDelay

        };

    }


    /* ========================================================
       BUILD SIMULATOR UI
       ======================================================== */

    function renderSimulator() {

        simulatorView.innerHTML = `

            <div class="simulator-page">

                <div class="simulator-header">

                    <div>

                        <span class="section-index">
                            05
                        </span>

                        <div>

                            <p class="eyebrow">
                                DECISION SUPPORT
                            </p>

                            <h1>
                                What if we intervene now?
                            </h1>

                            <p class="simulator-description">
                                Test possible administrative
                                interventions and see how the
                                project's predicted outcome could change.
                            </p>

                        </div>

                    </div>


                    <div class="prototype-badge">
                        PROTOTYPE SIMULATION
                    </div>

                </div>


                <div class="simulator-project-select">

                    <label>
                        PROJECT
                    </label>

                    <select
                        id="simulationProject"
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


                <div class="simulation-layout">


                    <!-- =========================================
                         BASELINE
                         ========================================= -->

                    <section class="simulation-panel baseline-panel">

                        <div class="simulation-panel-heading">

                            <div>

                                <span>
                                    CURRENT OUTLOOK
                                </span>

                                <h2>
                                    Without intervention
                                </h2>

                            </div>

                        </div>


                        <div class="simulation-number">

                            <span>
                                Delay probability
                            </span>

                            <strong
                                id="baselineRisk"
                            >
                                —
                            </strong>

                        </div>


                        <div class="simulation-number secondary">

                            <span>
                                Predicted delay
                            </span>

                            <strong
                                id="baselineDelay"
                            >
                                —
                            </strong>

                            <small>
                                days
                            </small>

                        </div>


                        <div class="risk-scale">

                            <div
                                class="risk-scale-fill"
                                id="baselineRiskBar"
                            ></div>

                        </div>


                        <p class="simulation-note">
                            This represents the current
                            demonstration prediction based
                            on the project's available data.
                        </p>

                    </section>



                    <!-- =========================================
                         INTERVENTIONS
                         ========================================= -->

                    <section class="simulation-panel intervention-panel">

                        <div class="simulation-panel-heading">

                            <div>

                                <span>
                                    ADMINISTRATIVE LEVERS
                                </span>

                                <h2>
                                    Try an intervention
                                </h2>

                            </div>

                            <button
                                type="button"
                                id="resetSimulation"
                                class="reset-simulation"
                            >
                                Reset
                            </button>

                        </div>


                        <div class="intervention-list">


                            <div class="intervention">

                                <div class="intervention-copy">

                                    <strong>
                                        Accelerate field survey
                                    </strong>

                                    <span>
                                        Prioritize pending parcel
                                        verification.
                                    </span>

                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    data-intervention="surveyAcceleration"
                                >

                                <output
                                    data-output="surveyAcceleration"
                                >
                                    0%
                                </output>

                            </div>


                            <div class="intervention">

                                <div class="intervention-copy">

                                    <strong>
                                        Resolve land disputes
                                    </strong>

                                    <span>
                                        Increase legal resolution
                                        coordination.
                                    </span>

                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    data-intervention="disputeResolution"
                                >

                                <output
                                    data-output="disputeResolution"
                                >
                                    0%
                                </output>

                            </div>


                            <div class="intervention">

                                <div class="intervention-copy">

                                    <strong>
                                        Accelerate compensation
                                    </strong>

                                    <span>
                                        Prioritize pending compensation
                                        cases.
                                    </span>

                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    data-intervention="compensationAcceleration"
                                >

                                <output
                                    data-output="compensationAcceleration"
                                >
                                    0%
                                </output>

                            </div>


                            <div class="intervention">

                                <div class="intervention-copy">

                                    <strong>
                                        Complete documentation
                                    </strong>

                                    <span>
                                        Close missing document gaps.
                                    </span>

                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    data-intervention="documentCompletion"
                                >

                                <output
                                    data-output="documentCompletion"
                                >
                                    0%
                                </output>

                            </div>


                            <div class="intervention">

                                <div class="intervention-copy">

                                    <strong>
                                        Increase coordination
                                    </strong>

                                    <span>
                                        Improve inter-department
                                        stakeholder coordination.
                                    </span>

                                </div>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    data-intervention="stakeholderCoordination"
                                >

                                <output
                                    data-output="stakeholderCoordination"
                                >
                                    0%
                                </output>

                            </div>


                        </div>

                    </section>



                    <!-- =========================================
                         RESULT
                         ========================================= -->

                    <section class="simulation-panel result-panel">

                        <div class="simulation-panel-heading">

                            <div>

                                <span>
                                    SIMULATED OUTCOME
                                </span>

                                <h2>
                                    If we act now
                                </h2>

                            </div>

                        </div>


                        <div class="result-risk">

                            <span>
                                New predicted risk
                            </span>

                            <strong
                                id="simulatedRisk"
                            >
                                —
                            </strong>

                            <small>
                                %
                            </small>

                        </div>


                        <div class="result-change">

                            <div>

                                <span>
                                    Risk reduction
                                </span>

                                <strong
                                    id="riskReduction"
                                >
                                    0%
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Days recovered
                                </span>

                                <strong
                                    id="daysRecovered"
                                >
                                    0
                                </strong>

                            </div>

                        </div>


                        <div class="outcome-comparison">

                            <div>

                                <span>
                                    CURRENT
                                </span>

                                <strong
                                    id="currentOutcome"
                                >
                                    —
                                </strong>

                            </div>

                            <div class="outcome-arrow">
                                →
                            </div>

                            <div>

                                <span>
                                    SIMULATED
                                </span>

                                <strong
                                    id="newOutcome"
                                >
                                    —
                                </strong>

                            </div>

                        </div>


                        <div class="simulation-verdict">

                            <span>
                                SYSTEM INTERPRETATION
                            </span>

                            <p
                                id="simulationVerdict"
                            >
                                Adjust an intervention
                                to see the projected outcome.
                            </p>

                        </div>


                        <button
                            type="button"
                            class="apply-simulation"
                            id="applySimulation"
                        >
                            Create action plan
                            <span>
                                →
                            </span>
                        </button>

                    </section>


                </div>


                <div class="simulation-disclaimer">

                    <strong>
                        Prototype note
                    </strong>

                    <span>
                        Simulation outputs are illustrative
                        demonstration values. Production
                        predictions would be generated from
                        validated historical acquisition data.
                    </span>

                </div>

            </div>

        `;


        attachSimulatorEvents();

        updateSimulation();

    }


    /* ========================================================
       UPDATE UI
       ======================================================== */

    function updateSimulation() {

        const result =
            calculateSimulation();


        const baselineRisk =
            document.getElementById(
                "baselineRisk"
            );


        const baselineDelay =
            document.getElementById(
                "baselineDelay"
            );


        const simulatedRisk =
            document.getElementById(
                "simulatedRisk"
            );


        const riskReduction =
            document.getElementById(
                "riskReduction"
            );


        const daysRecovered =
            document.getElementById(
                "daysRecovered"
            );


        const currentOutcome =
            document.getElementById(
                "currentOutcome"
            );


        const newOutcome =
            document.getElementById(
                "newOutcome"
            );


        const verdict =
            document.getElementById(
                "simulationVerdict"
            );


        if (baselineRisk) {

            baselineRisk.textContent =
                `${result.baselineRisk}%`;

        }


        if (baselineDelay) {

            baselineDelay.textContent =
                result.baselineDelay;

        }


        if (simulatedRisk) {

            simulatedRisk.textContent =
                result.simulatedRisk;

        }


        if (riskReduction) {

            riskReduction.textContent =
                `${result.riskReduction}%`;

        }


        if (daysRecovered) {

            daysRecovered.textContent =
                result.daysRecovered;

        }


        if (currentOutcome) {

            currentOutcome.textContent =
                `${result.baselineRisk}%`;

        }


        if (newOutcome) {

            newOutcome.textContent =
                `${result.simulatedRisk}%`;

        }


        const baselineBar =
            document.getElementById(
                "baselineRiskBar"
            );


        if (baselineBar) {

            baselineBar.style.width =
                `${result.baselineRisk}%`;

        }


        if (verdict) {

            if (
                result.riskReduction >= 25
            ) {

                verdict.textContent =
                    "Strong intervention effect. The selected combination could materially reduce the project's predicted delay risk.";

            } else if (
                result.riskReduction >= 10
            ) {

                verdict.textContent =
                    "Moderate improvement detected. Additional intervention or stronger coordination may be required.";

            } else if (
                result.riskReduction > 0
            ) {

                verdict.textContent =
                    "Early improvement detected. Increase intervention intensity to explore a stronger outcome.";

            } else {

                verdict.textContent =
                    "No intervention has been applied yet. Adjust one or more administrative levers.";

            }

        }


        document
            .querySelectorAll(
                "[data-intervention]"
            )
            .forEach(
                slider => {

                    const key =
                        slider.dataset
                            .intervention;


                    const output =
                        document.querySelector(
                            `[data-output="${key}"]`
                        );


                    if (output) {

                        output.textContent =
                            `${simulation[key]}%`;

                    }

                }
            );

    }


    /* ========================================================
       EVENT HANDLERS
       ======================================================== */

    function attachSimulatorEvents() {

        const projectSelect =
            document.getElementById(
                "simulationProject"
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


                resetSimulationValues();

                updateSimulation();

            }
        );


        document
            .querySelectorAll(
                "[data-intervention]"
            )
            .forEach(
                slider => {

                    slider.addEventListener(
                        "input",
                        event => {

                            const key =
                                event.target
                                    .dataset
                                    .intervention;


                            simulation[key] =
                                Number(
                                    event.target.value
                                );


                            updateSimulation();

                        }
                    );

                }
            );


        document
            .getElementById(
                "resetSimulation"
            )
            ?.addEventListener(
                "click",
                () => {

                    resetSimulationValues();

                    updateSimulation();

                }
            );


        document
            .getElementById(
                "applySimulation"
            )
            ?.addEventListener(
                "click",
                () => {

                    const result =
                        calculateSimulation();


                    if (
                        window.LandTrackApp
                            ?.showToast
                    ) {

                        window.LandTrackApp
                            .showToast(
                                `Action plan prepared with ${result.riskReduction}% projected risk reduction.`
                            );

                    }


                    document.dispatchEvent(
                        new CustomEvent(
                            "landtrack:simulationcreated",
                            {
                                detail: {
                                    project:
                                        selectedProject,

                                    simulation:
                                        {
                                            ...simulation
                                        },

                                    result
                                }
                            }
                        )
                    );

                }
            );

    }


    /* ========================================================
       RESET
       ======================================================== */

    function resetSimulationValues() {

        simulation = {

            surveyAcceleration: 0,

            disputeResolution: 0,

            compensationAcceleration: 0,

            documentCompletion: 0,

            stakeholderCoordination: 0

        };


        document
            .querySelectorAll(
                "[data-intervention]"
            )
            .forEach(
                slider => {

                    slider.value = 0;

                }
            );

    }


    /* ========================================================
       PROJECT CHANGE FROM OTHER MODULES
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
                    "simulationProject"
                );


            if (select) {

                select.value =
                    project.id;

            }


            resetSimulationValues();

            updateSimulation();

        }
    );


    /* ========================================================
       PUBLIC API
       ======================================================== */

    window.LandTrackSimulator = {

        getSelectedProject:
            () => selectedProject,

        getSimulation:
            () => ({
                ...simulation
            }),

        calculate:
            calculateSimulation,

        reset:
            resetSimulationValues

    };


    /* ========================================================
       INITIALIZE
       ======================================================== */

    renderSimulator();

});