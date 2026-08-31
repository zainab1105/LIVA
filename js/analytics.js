/* ============================================================
   LANDTRACK AI
   ANALYTICS ENGINE
   SIH 2026
   ============================================================ */


/* ============================================================
   01. SAFE DATA ACCESS
   ============================================================ */

const analyticsProjects =
    window.LandTrack?.projects || [];

const analyticsHistorical =
    window.LandTrack?.historical || [];

const analyticsHelpers =
    window.LandTrack?.helpers || {};


/* ============================================================
   02. BASIC HELPERS
   ============================================================ */

function analyticsNumber(value, fallback = 0) {

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;

}


function analyticsFormatNumber(value) {

    return analyticsNumber(value)
        .toLocaleString("en-IN");

}


function analyticsFormatCrore(value) {

    const crore =
        analyticsNumber(value) / 10000000;

    return `₹${crore.toFixed(1)} Cr`;

}


function analyticsAverage(values) {

    const validValues =
        values
            .map(Number)
            .filter(Number.isFinite);

    if (!validValues.length) {
        return 0;
    }

    return validValues.reduce(
        (sum, value) => sum + value,
        0
    ) / validValues.length;

}


/* ============================================================
   03. PORTFOLIO CALCULATIONS
   ============================================================ */

function calculateAnalyticsSummary(
    projects = analyticsProjects
) {

    const totalProjects =
        projects.length;


    const highRiskProjects =
        projects.filter(
            project =>
                analyticsNumber(
                    project.riskScore
                ) >= 65
        );


    const criticalProjects =
        projects.filter(
            project =>
                analyticsNumber(
                    project.riskScore
                ) >= 80
        );


    const averageRisk =
        Math.round(
            analyticsAverage(
                projects.map(
                    project =>
                        analyticsNumber(
                            project.riskScore
                        )
                )
            )
        );


    const averageDelay =
        Math.round(
            analyticsAverage(
                projects.map(
                    project =>
                        analyticsNumber(
                            project.predictedDelayDays
                        )
                )
            )
        );


    const totalLandRequired =
        projects.reduce(
            (sum, project) =>
                sum +
                analyticsNumber(
                    project.totalLandRequired
                ),
            0
        );


    const totalLandAcquired =
        projects.reduce(
            (sum, project) =>
                sum +
                analyticsNumber(
                    project.landAcquired
                ),
            0
        );


    const totalFamilies =
        projects.reduce(
            (sum, project) =>
                sum +
                analyticsNumber(
                    project.affectedFamilies
                ),
            0
        );


    const compensationPending =
        projects.reduce(
            (sum, project) =>
                sum +
                analyticsNumber(
                    project.compensationPending
                ),
            0
        );


    const averageProgress =
        Math.round(
            analyticsAverage(
                projects.map(
                    project =>
                        analyticsNumber(
                            project.progress
                        )
                )
            )
        );


    return {

        totalProjects,

        highRiskProjects:
            highRiskProjects.length,

        criticalProjects:
            criticalProjects.length,

        averageRisk,

        averageDelay,

        totalLandRequired,

        totalLandAcquired,

        totalFamilies,

        compensationPending,

        averageProgress

    };

}


/* ============================================================
   04. RISK DISTRIBUTION
   ============================================================ */

function calculateRiskDistribution(
    projects = analyticsProjects
) {

    const distribution = {

        critical: 0,

        high: 0,

        medium: 0,

        low: 0

    };


    projects.forEach(
        project => {

            const score =
                analyticsNumber(
                    project.riskScore
                );


            if (score >= 80) {

                distribution.critical++;

            } else if (score >= 65) {

                distribution.high++;

            } else if (score >= 50) {

                distribution.medium++;

            } else {

                distribution.low++;

            }

        }
    );


    return distribution;

}


/* ============================================================
   05. DELAY DRIVER AGGREGATION
   ============================================================ */

function calculateDelayDrivers(
    projects = analyticsProjects
) {

    const driverMap = {};


    projects.forEach(
        project => {

            const drivers =
                Array.isArray(
                    project.delayDrivers
                )
                    ? project.delayDrivers
                    : [];


            drivers.forEach(
                driver => {

                    const name =
                        driver.name ||
                        "Other";


                    const percentage =
                        analyticsNumber(
                            driver.percentage
                        );


                    if (!driverMap[name]) {

                        driverMap[name] = 0;

                    }


                    driverMap[name] +=
                        percentage;

                }
            );

        }
    );


    return Object.entries(
        driverMap
    )
        .map(
            ([name, value]) => ({

                name,

                value:
                    Math.round(value)

            })
        )
        .sort(
            (a, b) =>
                b.value - a.value
        );

}


/* ============================================================
   06. STATE-WISE ANALYTICS
   ============================================================ */

function calculateStateAnalytics(
    projects = analyticsProjects
) {

    const states = {};


    projects.forEach(
        project => {

            const state =
                project.state ||
                "Unknown";


            if (!states[state]) {

                states[state] = {

                    projects: 0,

                    riskTotal: 0,

                    delayTotal: 0,

                    landRequired: 0,

                    landAcquired: 0

                };

            }


            states[state].projects++;


            states[state].riskTotal +=
                analyticsNumber(
                    project.riskScore
                );


            states[state].delayTotal +=
                analyticsNumber(
                    project.predictedDelayDays
                );


            states[state].landRequired +=
                analyticsNumber(
                    project.totalLandRequired
                );


            states[state].landAcquired +=
                analyticsNumber(
                    project.landAcquired
                );

        }
    );


    return Object.entries(states)

        .map(
            ([state, data]) => ({

                state,

                projects:
                    data.projects,

                averageRisk:
                    Math.round(
                        data.riskTotal /
                        data.projects
                    ),

                averageDelay:
                    Math.round(
                        data.delayTotal /
                        data.projects
                    ),

                landRequired:
                    data.landRequired,

                landAcquired:
                    data.landAcquired

            })
        )

        .sort(
            (a, b) =>
                b.averageRisk -
                a.averageRisk
        );

}


/* ============================================================
   07. DISTRICT-WISE ANALYTICS
   ============================================================ */

function calculateDistrictAnalytics(
    projects = analyticsProjects
) {

    const districts = {};


    projects.forEach(
        project => {

            const district =
                project.district ||
                "Unknown";


            if (!districts[district]) {

                districts[district] = {

                    projects: 0,

                    riskTotal: 0,

                    delayTotal: 0

                };

            }


            districts[district].projects++;


            districts[district].riskTotal +=
                analyticsNumber(
                    project.riskScore
                );


            districts[district].delayTotal +=
                analyticsNumber(
                    project.predictedDelayDays
                );

        }
    );


    return Object.entries(districts)

        .map(
            ([district, data]) => ({

                district,

                projects:
                    data.projects,

                averageRisk:
                    Math.round(
                        data.riskTotal /
                        data.projects
                    ),

                averageDelay:
                    Math.round(
                        data.delayTotal /
                        data.projects
                    )

            })
        )

        .sort(
            (a, b) =>
                b.averageRisk -
                a.averageRisk
        );

}


/* ============================================================
   08. STAGE PERFORMANCE
   ============================================================ */

function calculateStagePerformance(
    projects = analyticsProjects
) {

    const stages = {

        Notification: 0,

        Survey: 0,

        Valuation: 0,

        Award: 0,

        Compensation: 0,

        Possession: 0,

        "R&R": 0,

        Completed: 0

    };


    projects.forEach(
        project => {

            const timeline =
                Array.isArray(
                    project.timeline
                )
                    ? project.timeline
                    : [];


            timeline.forEach(
                item => {

                    if (
                        item.status ===
                        "Completed"
                    ) {

                        if (
                            Object.prototype
                                .hasOwnProperty
                                .call(
                                    stages,
                                    item.stage
                                )
                        ) {

                            stages[
                                item.stage
                            ]++;

                        }

                    }

                }
            );

        }
    );


    return Object.entries(stages)

        .map(
            ([stage, completed]) => ({

                stage,

                completed

            })
        );

}


/* ============================================================
   09. ACQUISITION STAGE DISTRIBUTION
   ============================================================ */

function calculateAcquisitionStages(
    projects = analyticsProjects
) {

    const stages = {};


    projects.forEach(
        project => {

            const stage =
                project.acquisitionStage ||
                "Unknown";


            stages[stage] =
                (stages[stage] || 0) + 1;

        }
    );


    return Object.entries(stages)

        .map(
            ([stage, count]) => ({

                stage,

                count

            })
        )

        .sort(
            (a, b) =>
                b.count - a.count
        );

}


/* ============================================================
   10. RENDER KPI
   ============================================================ */

function renderAnalyticsKPIs() {

    const summary =
        calculateAnalyticsSummary();


    const totalElement =
        document.querySelector(
            "[data-analytics-total]"
        );


    const riskElement =
        document.querySelector(
            "[data-analytics-risk]"
        );


    const delayElement =
        document.querySelector(
            "[data-analytics-delay]"
        );


    const compensationElement =
        document.querySelector(
            "[data-analytics-compensation]"
        );


    if (totalElement) {

        totalElement.textContent =
            analyticsFormatNumber(
                summary.totalProjects
            );

    }


    if (riskElement) {

        riskElement.textContent =
            analyticsFormatNumber(
                summary.highRiskProjects
            );

    }


    if (delayElement) {

        delayElement.textContent =
            `${summary.averageDelay} days`;

    }


    if (compensationElement) {

        compensationElement.textContent =
            analyticsFormatCrore(
                summary.compensationPending
            );

    }

}


/* ============================================================
   11. RENDER RISK DISTRIBUTION
   ============================================================ */

function renderRiskDistribution() {

    const distribution =
        calculateRiskDistribution();


    const total =
        analyticsProjects.length;


    const critical =
        document.querySelector(
            "[data-risk-critical]"
        );


    const high =
        document.querySelector(
            "[data-risk-high]"
        );


    const medium =
        document.querySelector(
            "[data-risk-medium]"
        );


    const low =
        document.querySelector(
            "[data-risk-low]"
        );


    if (critical) {

        critical.textContent =
            distribution.critical;

    }


    if (high) {

        high.textContent =
            distribution.high;

    }


    if (medium) {

        medium.textContent =
            distribution.medium;

    }


    if (low) {

        low.textContent =
            distribution.low;

    }


    const donut =
        document.querySelector(
            "[data-risk-donut]"
        );


    if (donut && total) {

        const criticalPercent =
            distribution.critical /
            total *
            100;


        const highPercent =
            distribution.high /
            total *
            100;


        const mediumPercent =
            distribution.medium /
            total *
            100;


        donut.style.background =
            `conic-gradient(
                #b4232d 0% ${criticalPercent}%,
                #d99119 ${criticalPercent}% ${criticalPercent + highPercent}%,
                #258f88 ${criticalPercent + highPercent}% ${criticalPercent + highPercent + mediumPercent}%,
                #4779a8 ${criticalPercent + highPercent + mediumPercent}% 100%
            )`;

    }

}


/* ============================================================
   12. RENDER DELAY DRIVERS
   ============================================================ */

function renderDelayDrivers() {

    const drivers =
        calculateDelayDrivers();


    const container =
        document.querySelector(
            "[data-delay-drivers]"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const maximum =
        drivers.length
            ? Math.max(
                ...drivers.map(
                    driver =>
                        driver.value
                )
            )
            : 1;


    drivers
        .slice(0, 6)
        .forEach(
            driver => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "delay-driver-card";


                const width =
                    Math.max(
                        8,
                        driver.value /
                        maximum *
                        100
                    );


                item.innerHTML = `

                    <div class="delay-driver-name">
                        ${driver.name}
                    </div>

                    <div class="delay-driver-value">

                        <strong>
                            ${driver.value}%
                        </strong>

                        <span>
                            contribution
                        </span>

                    </div>

                    <div class="delay-driver-track">

                        <div
                            class="delay-driver-fill"
                            style="width:${width}%"
                        ></div>

                    </div>

                    <div class="delay-driver-description">

                        Identified across the
                        current project portfolio.

                    </div>

                `;


                container.appendChild(item);

            }
        );

}


/* ============================================================
   13. RENDER STATE ANALYTICS
   ============================================================ */

function renderStateAnalytics() {

    const states =
        calculateStateAnalytics();


    const container =
        document.querySelector(
            "[data-state-risk]"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    states
        .slice(0, 8)
        .forEach(
            state => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "state-risk-row";


                const width =
                    Math.min(
                        100,
                        state.averageRisk
                    );


                row.innerHTML = `

                    <div class="state-risk-name">
                        ${state.state}
                    </div>

                    <div class="state-risk-track">

                        <div
                            class="state-risk-fill"
                            style="width:${width}%"
                        ></div>

                    </div>

                    <div class="state-risk-value">
                        ${state.averageRisk}%
                    </div>

                `;


                container.appendChild(row);

            }
        );

}


/* ============================================================
   14. RENDER LIFECYCLE
   ============================================================ */

function renderLifecyclePerformance() {

    const stages =
        calculateStagePerformance();


    const container =
        document.querySelector(
            "[data-lifecycle]"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const maximum =
        Math.max(
            1,
            ...stages.map(
                stage =>
                    stage.completed
            )
        );


    stages.forEach(
        stage => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "lifecycle-row";


            const width =
                stage.completed /
                maximum *
                100;


            row.innerHTML = `

                <div class="lifecycle-name">
                    ${stage.stage}
                </div>

                <div class="lifecycle-track">

                    <div
                        class="lifecycle-fill"
                        style="width:${width}%"
                    ></div>

                </div>

                <div class="lifecycle-value">
                    ${stage.completed}
                </div>

            `;


            container.appendChild(row);

        }
    );

}


/* ============================================================
   15. RENDER PORTFOLIO INSIGHT
   ============================================================ */

function renderPortfolioInsight() {

    const summary =
        calculateAnalyticsSummary();


    const highRiskPercentage =
        summary.totalProjects
            ? Math.round(
                summary.highRiskProjects /
                summary.totalProjects *
                100
            )
            : 0;


    const riskElement =
        document.querySelector(
            "[data-insight-risk]"
        );


    const delayElement =
        document.querySelector(
            "[data-insight-delay]"
        );


    const progressElement =
        document.querySelector(
            "[data-insight-progress]"
        );


    if (riskElement) {

        riskElement.textContent =
            `${highRiskPercentage}%`;

    }


    if (delayElement) {

        delayElement.textContent =
            `${summary.averageDelay} days`;

    }


    if (progressElement) {

        progressElement.textContent =
            `${summary.averageProgress}%`;

    }

}


/* ============================================================
   16. UPDATE FILTERED ANALYTICS
   ============================================================ */

function getFilteredAnalyticsProjects() {

    const stateSelect =
        document.querySelector(
            "[data-analytics-state]"
        );


    const districtSelect =
        document.querySelector(
            "[data-analytics-district]"
        );


    const selectedState =
        stateSelect?.value || "all";


    const selectedDistrict =
        districtSelect?.value || "all";


    return analyticsProjects.filter(
        project => {

            const stateMatch =
                selectedState === "all" ||
                project.state === selectedState;


            const districtMatch =
                selectedDistrict === "all" ||
                project.district === selectedDistrict;


            return (
                stateMatch &&
                districtMatch
            );

        }
    );

}


/* ============================================================
   17. FILTER CHANGE
   ============================================================ */

function refreshAnalytics() {

    const projects =
        getFilteredAnalyticsProjects();


    const summary =
        calculateAnalyticsSummary(
            projects
        );


    const totalElement =
        document.querySelector(
            "[data-analytics-total]"
        );


    const riskElement =
        document.querySelector(
            "[data-analytics-risk]"
        );


    const delayElement =
        document.querySelector(
            "[data-analytics-delay]"
        );


    const compensationElement =
        document.querySelector(
            "[data-analytics-compensation]"
        );


    if (totalElement) {

        totalElement.textContent =
            analyticsFormatNumber(
                summary.totalProjects
            );

    }


    if (riskElement) {

        riskElement.textContent =
            analyticsFormatNumber(
                summary.highRiskProjects
            );

    }


    if (delayElement) {

        delayElement.textContent =
            `${summary.averageDelay} days`;

    }


    if (compensationElement) {

        compensationElement.textContent =
            analyticsFormatCrore(
                summary.compensationPending
            );

    }


    renderFilteredRiskDistribution(
        projects
    );


    renderFilteredDelayDrivers(
        projects
    );


    renderFilteredStates(
        projects
    );

}


/* ============================================================
   18. FILTERED RISK DISTRIBUTION
   ============================================================ */

function renderFilteredRiskDistribution(
    projects
) {

    const distribution =
        calculateRiskDistribution(
            projects
        );


    const total =
        projects.length;


    const elements = {

        critical:
            document.querySelector(
                "[data-risk-critical]"
            ),

        high:
            document.querySelector(
                "[data-risk-high]"
            ),

        medium:
            document.querySelector(
                "[data-risk-medium]"
            ),

        low:
            document.querySelector(
                "[data-risk-low]"
            )

    };


    if (elements.critical) {

        elements.critical.textContent =
            distribution.critical;

    }


    if (elements.high) {

        elements.high.textContent =
            distribution.high;

    }


    if (elements.medium) {

        elements.medium.textContent =
            distribution.medium;

    }


    if (elements.low) {

        elements.low.textContent =
            distribution.low;

    }


    const donut =
        document.querySelector(
            "[data-risk-donut]"
        );


    if (!donut || !total) {
        return;
    }


    const c =
        distribution.critical /
        total *
        100;


    const h =
        distribution.high /
        total *
        100;


    const m =
        distribution.medium /
        total *
        100;


    donut.style.background =
        `conic-gradient(
            #b4232d 0% ${c}%,
            #d99119 ${c}% ${c + h}%,
            #258f88 ${c + h}% ${c + h + m}%,
            #4779a8 ${c + h + m}% 100%
        )`;

}


/* ============================================================
   19. FILTERED DELAY DRIVERS
   ============================================================ */

function renderFilteredDelayDrivers(
    projects
) {

    const drivers =
        calculateDelayDrivers(
            projects
        );


    const container =
        document.querySelector(
            "[data-delay-drivers]"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const maximum =
        Math.max(
            1,
            ...drivers.map(
                driver =>
                    driver.value
            )
        );


    drivers
        .slice(0, 6)
        .forEach(
            driver => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "delay-driver-card";


                const width =
                    Math.max(
                        8,
                        driver.value /
                        maximum *
                        100
                    );


                item.innerHTML = `

                    <div class="delay-driver-name">
                        ${driver.name}
                    </div>

                    <div class="delay-driver-value">

                        <strong>
                            ${driver.value}%
                        </strong>

                        <span>
                            portfolio contribution
                        </span>

                    </div>

                    <div class="delay-driver-track">

                        <div
                            class="delay-driver-fill"
                            style="width:${width}%"
                        ></div>

                    </div>

                `;


                container.appendChild(item);

            }
        );

}


/* ============================================================
   20. FILTERED STATE VIEW
   ============================================================ */

function renderFilteredStates(
    projects
) {

    const states =
        calculateStateAnalytics(
            projects
        );


    const container =
        document.querySelector(
            "[data-state-risk]"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    states
        .slice(0, 8)
        .forEach(
            state => {

                const row =
                    document.createElement(
                        "div"
                    );


                row.className =
                    "state-risk-row";


                row.innerHTML = `

                    <div class="state-risk-name">
                        ${state.state}
                    </div>

                    <div class="state-risk-track">

                        <div
                            class="state-risk-fill"
                            style="width:${state.averageRisk}%"
                        ></div>

                    </div>

                    <div class="state-risk-value">
                        ${state.averageRisk}%
                    </div>

                `;


                container.appendChild(row);

            }
        );

}


/* ============================================================
   21. INITIALIZE FILTERS
   ============================================================ */

function initializeAnalyticsFilters() {

    const stateSelect =
        document.querySelector(
            "[data-analytics-state]"
        );


    const districtSelect =
        document.querySelector(
            "[data-analytics-district]"
        );


    if (stateSelect) {

        const states =
            [
                ...new Set(
                    analyticsProjects
                        .map(
                            project =>
                                project.state
                        )
                        .filter(Boolean)
                )
            ]
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


                stateSelect.appendChild(
                    option
                );

            }
        );


        stateSelect.addEventListener(
            "change",
            () => {

                updateDistrictFilter();

                refreshAnalytics();

            }
        );

    }


    if (districtSelect) {

        districtSelect.addEventListener(
            "change",
            refreshAnalytics
        );

    }


    updateDistrictFilter();

}


/* ============================================================
   22. DISTRICT FILTER
   ============================================================ */

function updateDistrictFilter() {

    const stateSelect =
        document.querySelector(
            "[data-analytics-state]"
        );


    const districtSelect =
        document.querySelector(
            "[data-analytics-district]"
        );


    if (!districtSelect) {
        return;
    }


    const selectedState =
        stateSelect?.value || "all";


    const districts =
        [
            ...new Set(

                analyticsProjects

                    .filter(
                        project =>
                            selectedState === "all" ||
                            project.state ===
                            selectedState
                    )

                    .map(
                        project =>
                            project.district
                    )

                    .filter(Boolean)

            )
        ]
        .sort();


    districtSelect.innerHTML = `

        <option value="all">
            All Districts
        </option>

    `;


    districts.forEach(
        district => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                district;


            option.textContent =
                district;


            districtSelect.appendChild(
                option
            );

        }
    );

}


/* ============================================================
   23. FULL ANALYTICS INITIALIZATION
   ============================================================ */

function initializeAnalytics() {

    if (!analyticsProjects.length) {

        console.warn(
            "LandTrack AI: No project data available."
        );

        return;

    }


    renderAnalyticsKPIs();

    renderRiskDistribution();

    renderDelayDrivers();

    renderStateAnalytics();

    renderLifecyclePerformance();

    renderPortfolioInsight();

    initializeAnalyticsFilters();

}


/* ============================================================
   24. PUBLIC ANALYTICS API
   ============================================================ */

window.LandTrackAnalytics = {

    projects:
        analyticsProjects,

    historical:
        analyticsHistorical,

    summary:
        calculateAnalyticsSummary,

    riskDistribution:
        calculateRiskDistribution,

    delayDrivers:
        calculateDelayDrivers,

    stateAnalytics:
        calculateStateAnalytics,

    districtAnalytics:
        calculateDistrictAnalytics,

    stagePerformance:
        calculateStagePerformance,

    acquisitionStages:
        calculateAcquisitionStages,

    refresh:
        refreshAnalytics,

    initialize:
        initializeAnalytics

};


/* ============================================================
   25. START
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAnalytics
    );

} else {

    initializeAnalytics();

}