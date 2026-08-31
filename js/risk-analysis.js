/* ============================================================
   LANDTRACK AI
   AI RISK INTELLIGENCE CONTROLLER
   SIH26017
   ============================================================ */


/* ============================================================
   01. STATE
   ============================================================ */

let selectedRiskProject = null;


/* ============================================================
   02. INITIALIZE
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeRiskAnalysis();

    }
);


function initializeRiskAnalysis() {

    const selector =
        document.getElementById(
            "riskProjectSelect"
        );


    if (!selector) {
        return;
    }


    loadRiskProjects();

    initializeProjectSelector();

    initializeActionButton();

    initializeURLProject();

}


/* ============================================================
   03. LOAD PROJECT SELECTOR
   ============================================================ */

function loadRiskProjects() {

    const selector =
        document.getElementById(
            "riskProjectSelect"
        );


    if (
        !selector ||
        typeof landTrackProjects ===
        "undefined"
    ) {
        return;
    }


    selector.innerHTML = "";


    /*
        Highest-risk projects appear first.
    */

    const sortedProjects =
        [...landTrackProjects]
            .sort(
                (a, b) =>
                    b.riskScore -
                    a.riskScore
            );


    sortedProjects.forEach(
        project => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                project.id;


            option.textContent =
                `${project.name} — ${project.riskScore}% risk`;


            selector.appendChild(
                option
            );

        }
    );


    /*
        Default to highest-risk project.
    */

    if (sortedProjects.length) {

        selectedRiskProject =
            sortedProjects[0];

        selector.value =
            selectedRiskProject.id;

        renderRiskAnalysis(
            selectedRiskProject
        );

    }

}


/* ============================================================
   04. PROJECT SELECTOR
   ============================================================ */

function initializeProjectSelector() {

    const selector =
        document.getElementById(
            "riskProjectSelect"
        );


    if (!selector) {
        return;
    }


    selector.addEventListener(
        "change",
        event => {

            const project =
                findRiskProject(
                    event.target.value
                );


            if (!project) {
                return;
            }


            selectedRiskProject =
                project;


            renderRiskAnalysis(
                project
            );

        }
    );

}


/* ============================================================
   05. FIND PROJECT
   ============================================================ */

function findRiskProject(
    projectId
) {

    if (
        typeof landTrackProjects ===
        "undefined"
    ) {
        return null;
    }


    return landTrackProjects.find(
        project =>
            project.id ===
            projectId
    );

}


/* ============================================================
   06. RENDER COMPLETE ANALYSIS
   ============================================================ */

function renderRiskAnalysis(
    project
) {

    if (!project) {
        return;
    }


    renderProjectHeader(
        project
    );


    renderRiskScore(
        project
    );


    renderDelayForecast(
        project
    );


    renderContributingFactors(
        project
    );


    renderLifecycleRisk(
        project
    );


    renderRecommendation(
        project
    );

}


/* ============================================================
   07. PROJECT HEADER
   ============================================================ */

function renderProjectHeader(
    project
) {

    setRiskText(
        "selectedProjectName",
        project.name
    );


    setRiskText(
        "selectedProjectMeta",
        `${project.state} · ${project.district} · ${project.projectType} · ${project.authority}`
    );


    const statusBadge =
        document.querySelector(
            ".risk-project-status .status-badge"
        );


    if (statusBadge) {

        const riskClass =
            getRiskClass(
                project.riskScore
            );


        statusBadge.className =
            `status-badge ${getStatusBadgeClass(
                project.riskScore
            )}`;


        statusBadge.textContent =
            `● ${getRiskLabel(
                project.riskScore
            )} Risk`;

    }


    setRiskText(
        "riskLastUpdated",
        `Last updated · ${project.lastUpdated || "Today"}`
    );

}


/* ============================================================
   08. RISK SCORE
   ============================================================ */

function renderRiskScore(
    project
) {

    const score =
        Number(
            project.riskScore || 0
        );


    const scoreValue =
        document.getElementById(
            "riskScoreValue"
        );


    const circle =
        document.getElementById(
            "riskScoreCircle"
        );


    const classification =
        document.getElementById(
            "riskClassification"
        );


    if (scoreValue) {

        scoreValue.textContent =
            `${score}%`;

    }


    if (circle) {

        const degrees =
            Math.min(
                Math.max(
                    score,
                    0
                ),
                100
            ) * 3.6;


        const riskColor =
            getRiskColor(
                score
            );


        circle.style.background =
            `conic-gradient(
                ${riskColor} 0deg,
                ${riskColor} ${degrees}deg,
                #edf0f2 ${degrees}deg,
                #edf0f2 360deg
            )`;

    }


    if (classification) {

        classification.textContent =
            getRiskLabel(
                score
            ).toUpperCase();


        classification.className =
            `${getRiskTextClass(
                score
            )}`;

    }

}


/* ============================================================
   09. DELAY FORECAST
   ============================================================ */

function renderDelayForecast(
    project
) {

    const predictedDays =
        Number(
            project.predictedDelayDays ||
            calculatePredictedDelay(
                project.riskScore
            )
        );


    setRiskText(
        "predictedDelay",
        `${predictedDays} days`
    );


    const probability =
        Number(
            project.delayProbability ||
            project.riskScore ||
            0
        );


    const progress =
        Math.min(
            Math.max(
                probability,
                10
            ),
            90
        );


    const timelineProgress =
        document.querySelector(
            ".timeline-progress"
        );


    const timelineEnd =
        document.querySelector(
            ".timeline-dot.end"
        );


    if (timelineProgress) {

        timelineProgress.style.width =
            `${progress}%`;

    }


    if (timelineEnd) {

        timelineEnd.style.left =
            `${progress}%`;

    }


    const assessment =
        document.getElementById(
            "modelAssessment"
        );


    if (assessment) {

        assessment.textContent =
            generateAssessment(
                project
            );

    }

}


/* ============================================================
   10. PREDICTED DELAY FALLBACK
   ============================================================ */

function calculatePredictedDelay(
    riskScore
) {

    return Math.max(
        7,
        Math.round(
            Number(
                riskScore || 0
            ) * 1.5
        )
    );

}


/* ============================================================
   11. MODEL ASSESSMENT
   ============================================================ */

function generateAssessment(
    project
) {

    const drivers =
        getProjectDrivers(
            project
        );


    if (!drivers.length) {

        return "The model requires additional project data before identifying the strongest delay contributors.";

    }


    const strongest =
        drivers[0];


    if (
        drivers.length === 1
    ) {

        return `${strongest.name} is currently the strongest contributor to the predicted delay risk.`;

    }


    return `${strongest.name} and ${drivers[1].name.toLowerCase()} are currently the strongest contributors to the predicted delay risk.`;

}


/* ============================================================
   12. CONTRIBUTING FACTORS
   ============================================================ */

function renderContributingFactors(
    project
) {

    const container =
        document.getElementById(
            "factorList"
        );


    if (!container) {
        return;
    }


    const factors =
        buildProjectFactors(
            project
        );


    container.innerHTML = "";


    factors.forEach(
        factor => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "factor-item";


            item.innerHTML = `

                <span class="factor-name">
                    ${escapeRiskHTML(
                        factor.name
                    )}
                </span>


                <div class="factor-track">

                    <div
                        class="factor-fill"
                        style="
                            width: ${factor.value}%;
                            background: ${factor.color};
                        "
                    ></div>

                </div>


                <span class="factor-value">
                    ${factor.value}%
                </span>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* ============================================================
   13. BUILD FACTORS
   ============================================================ */

function buildProjectFactors(
    project
) {

    /*
        Higher values represent stronger
        risk contribution.

        In the production ML system,
        these values would come from
        model explainability methods
        such as SHAP / feature importance.
    */

    const factors = [

        {
            name: "Compensation delays",
            value:
                Number(
                    100 -
                    (project.compensationStatus || 0)
                )
        },

        {
            name: "Legal disputes",
            value:
                Math.min(
                    100,
                    Number(
                        project.legalDisputes ||
                        0
                    ) * 3
                )
        },

        {
            name: "Pending approvals",
            value:
                Number(
                    100 -
                    (project.approvalStatus || 0)
                )
        },

        {
            name: "Documentation gaps",
            value:
                Number(
                    100 -
                    (project.documentationStatus || 0)
                )
        },

        {
            name: "Rehabilitation & R&R",
            value:
                Number(
                    100 -
                    (project.rehabilitationStatus || 0)
                )
        },

        {
            name: "Stakeholder responsiveness",
            value:
                Number(
                    100 -
                    (project.stakeholderResponsiveness || 0)
                )
        }

    ];


    /*
        Prevent values from going outside 0–100.
    */

    factors.forEach(
        factor => {

            factor.value =
                Math.min(
                    100,
                    Math.max(
                        0,
                        Math.round(
                            factor.value
                        )
                    )
                );

        }
    );


    /*
        Highest contributor first.
    */

    factors.sort(
        (a, b) =>
            b.value -
            a.value
    );


    /*
        Keep the strongest five
        contributors visible.
    */

    const colors = [
        "var(--red)",
        "var(--amber)",
        "var(--teal)",
        "var(--blue)",
        "#78909c"
    ];


    return factors
        .slice(0, 5)
        .map(
            (factor, index) => {

                factor.color =
                    colors[
                        Math.min(
                            index,
                            colors.length - 1
                        )
                    ];

                return factor;

            }
        );

}


/* ============================================================
   14. PROJECT DRIVERS
   ============================================================ */

function getProjectDrivers(
    project
) {

    return buildProjectFactors(
        project
    );

}


/* ============================================================
   15. LIFECYCLE STAGE RISK
   ============================================================ */

function renderLifecycleRisk(
    project
) {

    const container =
        document.getElementById(
            "projectStageRisk"
        );


    if (!container) {
        return;
    }


    const stages =
        calculateStageRisk(
            project
        );


    container.innerHTML = "";


    stages.forEach(
        stage => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "project-stage-item";


            item.innerHTML = `

                <span class="project-stage-name">
                    ${escapeRiskHTML(
                        stage.name
                    )}
                </span>


                <div class="project-stage-track">

                    <div
                        class="project-stage-fill"
                        style="
                            width: ${stage.risk}%;
                            background: ${getRiskColor(
                                stage.risk
                            )};
                        "
                    ></div>

                </div>


                <span class="project-stage-value">
                    ${stage.risk}%
                </span>

            `;


            container.appendChild(
                item
            );

        }
    );

}


/* ============================================================
   16. STAGE RISK CALCULATION
   ============================================================ */

function calculateStageRisk(
    project
) {

    const base =
        Number(
            project.riskScore || 0
        );


    const currentStage =
        project.acquisitionStage;


    const stages = [

        {
            name: "Notification",
            risk: Math.round(
                base * 0.25
            )
        },

        {
            name: "Approval",
            risk: Math.round(
                (
                    base * 0.55
                ) +
                (
                    (100 -
                        Number(
                            project.approvalStatus ||
                            0
                        )) * 0.25
                )
            )
        },

        {
            name: "Compensation",
            risk: Math.round(
                (
                    base * 0.55
                ) +
                (
                    (100 -
                        Number(
                            project.compensationStatus ||
                            0
                        )) * 0.35
                )
            )
        },

        {
            name: "Possession",
            risk: Math.round(
                (
                    base * 0.50
                ) +
                (
                    (100 -
                        Number(
                            project.possessionStatus ||
                            0
                        )) * 0.40
                )
            )
        },

        {
            name: "Rehabilitation",
            risk: Math.round(
                (
                    base * 0.45
                ) +
                (
                    (100 -
                        Number(
                            project.rehabilitationStatus ||
                            0
                        )) * 0.40
                )
            )
        }

    ];


    /*
        Slightly emphasize the current stage
        because it is the immediate intervention
        point.
    */

    stages.forEach(
        stage => {

            if (
                stage.name ===
                currentStage
            ) {

                stage.risk += 8;

            }


            stage.risk =
                Math.min(
                    99,
                    Math.max(
                        5,
                        stage.risk
                    )
                );

        }
    );


    return stages;

}


/* ============================================================
   17. RECOMMENDATION
   ============================================================ */

function renderRecommendation(
    project
) {

    const title =
        document.getElementById(
            "aiRecommendationTitle"
        );


    const text =
        document.getElementById(
            "aiRecommendationText"
        );


    if (title) {

        title.textContent =
            getRecommendationTitle(
                project
            );

    }


    if (text) {

        text.textContent =
            project.recommendation ||
            generateRecommendation(
                project
            );

    }

}


/* ============================================================
   18. RECOMMENDATION TITLE
   ============================================================ */

function getRecommendationTitle(
    project
) {

    const score =
        Number(
            project.riskScore || 0
        );


    if (score >= 80) {

        return "Immediate intervention recommended";

    }


    if (score >= 65) {

        return "Priority intervention recommended";

    }


    if (score >= 50) {

        return "Preventive action recommended";

    }


    return "Continue routine monitoring";

}


/* ============================================================
   19. FALLBACK RECOMMENDATION
   ============================================================ */

function generateRecommendation(
    project
) {

    const factors =
        getProjectDrivers(
            project
        );


    if (!factors.length) {

        return "Collect additional project information to generate a more specific mitigation plan.";

    }


    const strongest =
        factors[0].name;


    const actions = {

        "Compensation delays":
            "Prioritize pending compensation cases, verify payment documentation and establish a time-bound disbursement plan.",

        "Legal disputes":
            "Prioritize disputed parcels, track case status and establish a time-bound legal resolution workflow.",

        "Pending approvals":
            "Escalate pending approvals to the responsible authority and establish milestone-based follow-up.",

        "Documentation gaps":
            "Complete missing land records and documentation before the project advances to the next acquisition stage.",

        "Rehabilitation & R&R":
            "Increase R&R field coordination and monitor pending beneficiary and resettlement cases.",

        "Stakeholder responsiveness":
            "Increase stakeholder engagement and introduce structured follow-up for unresolved cases."

    };


    return (
        actions[strongest] ||
        "Review the project's highest-risk factors and prioritize corrective action."
    );

}


/* ============================================================
   20. ACTION BUTTON
   ============================================================ */

function initializeActionButton() {

    const button =
        document.getElementById(
            "viewActionButton"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            if (
                !selectedRiskProject
            ) {

                showToast(
                    "Select a project first.",
                    "warning"
                );

                return;

            }


            navigateTo(
                "recommendations.html",
                {
                    id:
                        selectedRiskProject.id
                }
            );

        }
    );

}


/* ============================================================
   21. URL PROJECT
   ============================================================ */

function initializeURLProject() {

    const projectId =
        getURLParameter(
            "id"
        );


    if (!projectId) {
        return;
    }


    const project =
        findRiskProject(
            projectId
        );


    if (!project) {
        return;
    }


    selectedRiskProject =
        project;


    const selector =
        document.getElementById(
            "riskProjectSelect"
        );


    if (selector) {

        selector.value =
            project.id;

    }


    renderRiskAnalysis(
        project
    );

}


/* ============================================================
   22. RISK COLORS
   ============================================================ */

function getRiskColor(
    score
) {

    if (score >= 80) {

        return "var(--red)";

    }


    if (score >= 65) {

        return "var(--amber)";

    }


    if (score >= 50) {

        return "var(--teal)";

    }


    return "var(--blue)";

}


/* ============================================================
   23. RISK CLASS
   ============================================================ */

function getRiskClass(
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
   24. RISK LABEL
   ============================================================ */

function getRiskLabel(
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


/* ============================================================
   25. STATUS BADGE
   ============================================================ */

function getStatusBadgeClass(
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


/* ============================================================
   26. RISK TEXT CLASS
   ============================================================ */

function getRiskTextClass(
    score
) {

    if (score >= 80) {

        return "critical-text";

    }


    if (score >= 65) {

        return "high-text";

    }


    if (score >= 50) {

        return "medium-text";

    }


    return "low-text";

}


/* ============================================================
   27. SAFE TEXT
   ============================================================ */

function setRiskText(
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
   28. SAFE HTML
   ============================================================ */

function escapeRiskHTML(
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