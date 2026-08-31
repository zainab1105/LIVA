/* ============================================================
   LANDTRACK AI
   CENTRAL DATA LAYER
   ============================================================ */

window.LandTrack = window.LandTrack || {};


/* ============================================================
   PROJECT DATA
   ============================================================ */

window.LandTrack.projects = [

    {
        id: "MH-MUM-001",

        name: "Mumbai Coastal Connector",

        shortName: "Mumbai Coastal",

        state: "Maharashtra",

        district: "Mumbai",

        authority: "Public Works Department",

        landCategory: "Coastal / Mixed Land",

        landCategory: "Agricultural",

        status: "Acquisition in Progress",

        priority: "High",

        location: {
            lat: 19.0760,
            lng: 72.8777
        },

        /* ----------------------------------------------
           LAND
           ---------------------------------------------- */

        totalLandRequired: 148.5,

        landAcquired: 96.4,

        parcelsRequired: 312,

        parcelsAcquired: 218,

        /* ----------------------------------------------
           FINANCIAL
           ---------------------------------------------- */

        estimatedValue: 842,

        compensationPending: 137,

        compensationDisbursed: 511,

        /* ----------------------------------------------
           RISK
           ---------------------------------------------- */

        riskScore: 78,

        confidenceScore: 91,

        predictedDelayDays: 64,

        primaryDelayDriver:
            "Compensation pending",

        delayDrivers: [

            {
                name: "Compensation pending",
                percentage: 31
            },

            {
                name: "Ownership verification",
                percentage: 24
            },

            {
                name: "Documentation gaps",
                percentage: 18
            },

            {
                name: "Stakeholder coordination",
                percentage: 15
            },

            {
                name: "Legal disputes",
                percentage: 12
            }

        ],

        /* ----------------------------------------------
           DOCUMENTS
           ---------------------------------------------- */

        documentCompleteness: 67,

        documentsTotal: 312,

        documentsVerified: 209,

        documentsPending: 103,

        /* ----------------------------------------------
           STAKEHOLDERS
           ---------------------------------------------- */

        stakeholderResponsiveness: 58,

        departmentCoordination: 71,

        /* ----------------------------------------------
           LEGAL
           ---------------------------------------------- */

        legalDisputes: 18,

        courtCases: 7,

        /* ----------------------------------------------
           R&R
           ---------------------------------------------- */

        rrStatus: "In Progress",

        rr: {

            familiesAffected: 284,

            familiesRelocated: 151,

            familiesPending: 133,

            housesRequired: 172,

            housesCompleted: 89,

            livelihoodCases: 119,

            livelihoodResolved: 64,

            rrProgress: 54

        },

        /* ----------------------------------------------
           TIMELINE
           ---------------------------------------------- */

        timeline: [

            {
                stage: "Notification",
                status: "Completed"
            },

            {
                stage: "Survey",
                status: "Completed"
            },

            {
                stage: "Verification",
                status: "In Progress"
            },

            {
                stage: "Award",
                status: "In Progress"
            },

            {
                stage: "Compensation",
                status: "Pending"
            },

            {
                stage: "Possession",
                status: "Pending"
            }

        ],

        aiRecommendation:
            "Prioritise compensation processing for verified parcels while resolving the remaining ownership records. This is the fastest intervention likely to reduce the current delay trajectory."

    },


    /* ========================================================
       PROJECT 02
       ======================================================== */

    {
        id: "MH-PUN-002",

        name: "Pune Ring Road",

        shortName: "Pune Ring Road",

        state: "Maharashtra",

        district: "Pune",

        authority: "Maharashtra State Road Development Corporation",

        projectType: "Road Infrastructure",

        landCategory: "Agricultural",

        status: "Acquisition in Progress",

        priority: "Critical",

        location: {
            lat: 18.5204,
            lng: 73.8567
        },

        totalLandRequired: 421.8,

        landAcquired: 263.7,

        parcelsRequired: 786,

        parcelsAcquired: 491,

        estimatedValue: 2130,

        compensationPending: 326,

        compensationDisbursed: 1178,

        riskScore: 87,

        confidenceScore: 94,

        predictedDelayDays: 113,

        primaryDelayDriver:
            "Ownership verification",

        delayDrivers: [

            {
                name: "Ownership verification",
                percentage: 34
            },

            {
                name: "Legal disputes",
                percentage: 26
            },

            {
                name: "Compensation pending",
                percentage: 21
            },

            {
                name: "Documentation gaps",
                percentage: 11
            },

            {
                name: "Stakeholder coordination",
                percentage: 8
            }

        ],

        documentCompleteness: 48,

        documentsTotal: 786,

        documentsVerified: 378,

        documentsPending: 408,

        stakeholderResponsiveness: 42,

        departmentCoordination: 54,

        legalDisputes: 47,

        courtCases: 16,

        rrStatus: "Delayed",

        rr: {

            familiesAffected: 612,

            familiesRelocated: 198,

            familiesPending: 414,

            housesRequired: 387,

            housesCompleted: 116,

            livelihoodCases: 274,

            livelihoodResolved: 91,

            rrProgress: 31

        },

        timeline: [

            {
                stage: "Notification",
                status: "Completed"
            },

            {
                stage: "Survey",
                status: "Completed"
            },

            {
                stage: "Verification",
                status: "Delayed"
            },

            {
                stage: "Award",
                status: "Pending"
            },

            {
                stage: "Compensation",
                status: "Pending"
            },

            {
                stage: "Possession",
                status: "Pending"
            }

        ],

        aiRecommendation:
            "Escalate ownership verification and dispute resolution. The concentration of unresolved titles is creating a systemic bottleneck before award and compensation can progress."

    },


    /* ========================================================
       PROJECT 03
       ======================================================== */

    {
        id: "GJ-AHM-003",

        name: "Ahmedabad Freight Corridor",

        shortName: "Ahmedabad Freight",

        state: "Gujarat",

        district: "Ahmedabad",

        authority: "National Highways Authority",

        projectType: "Freight Infrastructure",

        landCategory: "Agricultural",

        status: "Acquisition in Progress",

        priority: "Medium",

        location: {
            lat: 23.0225,
            lng: 72.5714
        },

        totalLandRequired: 278.2,

        landAcquired: 231.6,

        parcelsRequired: 524,

        parcelsAcquired: 461,

        estimatedValue: 1460,

        compensationPending: 74,

        compensationDisbursed: 1092,

        riskScore: 43,

        confidenceScore: 88,

        predictedDelayDays: 27,

        primaryDelayDriver:
            "Documentation gaps",

        delayDrivers: [

            {
                name: "Documentation gaps",
                percentage: 29
            },

            {
                name: "Compensation pending",
                percentage: 24
            },

            {
                name: "Survey updates",
                percentage: 19
            },

            {
                name: "Stakeholder coordination",
                percentage: 16
            },

            {
                name: "Legal disputes",
                percentage: 12
            }

        ],

        documentCompleteness: 83,

        documentsTotal: 524,

        documentsVerified: 435,

        documentsPending: 89,

        stakeholderResponsiveness: 76,

        departmentCoordination: 82,

        legalDisputes: 6,

        courtCases: 2,

        rrStatus: "On Track",

        rr: {

            familiesAffected: 196,

            familiesRelocated: 164,

            familiesPending: 32,

            housesRequired: 131,

            housesCompleted: 117,

            livelihoodCases: 82,

            livelihoodResolved: 69,

            rrProgress: 84

        },

        timeline: [

            {
                stage: "Notification",
                status: "Completed"
            },

            {
                stage: "Survey",
                status: "Completed"
            },

            {
                stage: "Verification",
                status: "Completed"
            },

            {
                stage: "Award",
                status: "Completed"
            },

            {
                stage: "Compensation",
                status: "In Progress"
            },

            {
                stage: "Possession",
                status: "In Progress"
            }

        ],

        aiRecommendation:
            "Continue routine monitoring. Closing the remaining documentation gaps and pending compensation cases should keep the project within its current trajectory."

    },


    /* ========================================================
       PROJECT 04
       ======================================================== */

    {
        id: "KA-BLR-004",

        name: "Bengaluru Peripheral Highway",

        shortName: "Bengaluru Highway",

        state: "Karnataka",

        district: "Bengaluru Rural",

        authority: "National Highways Authority",

        projectType: "Highway",

        landCategory: "Agricultural",

        status: "Pre-Possession",

        priority: "High",

        location: {
            lat: 13.1986,
            lng: 77.7066
        },

        totalLandRequired: 356.4,

        landAcquired: 301.9,

        parcelsRequired: 648,

        parcelsAcquired: 557,

        estimatedValue: 1875,

        compensationPending: 119,

        compensationDisbursed: 1422,

        riskScore: 69,

        confidenceScore: 89,

        predictedDelayDays: 52,

        primaryDelayDriver:
            "Stakeholder coordination",

        delayDrivers: [

            {
                name: "Stakeholder coordination",
                percentage: 30
            },

            {
                name: "Compensation pending",
                percentage: 25
            },

            {
                name: "R&R implementation",
                percentage: 20
            },

            {
                name: "Documentation gaps",
                percentage: 15
            },

            {
                name: "Legal disputes",
                percentage: 10
            }

        ],

        documentCompleteness: 78,

        documentsTotal: 648,

        documentsVerified: 505,

        documentsPending: 143,

        stakeholderResponsiveness: 46,

        departmentCoordination: 63,

        legalDisputes: 11,

        courtCases: 4,

        rrStatus: "In Progress",

        rr: {

            familiesAffected: 341,

            familiesRelocated: 227,

            familiesPending: 114,

            housesRequired: 214,

            housesCompleted: 153,

            livelihoodCases: 146,

            livelihoodResolved: 93,

            rrProgress: 68

        },

        timeline: [

            {
                stage: "Notification",
                status: "Completed"
            },

            {
                stage: "Survey",
                status: "Completed"
            },

            {
                stage: "Verification",
                status: "Completed"
            },

            {
                stage: "Award",
                status: "Completed"
            },

            {
                stage: "Compensation",
                status: "In Progress"
            },

            {
                stage: "Possession",
                status: "Pending"
            }

        ],

        aiRecommendation:
            "Strengthen coordination between field officers and affected stakeholders before possession. The remaining risk is primarily operational rather than documentation-driven."

    },


    /* ========================================================
       PROJECT 05
       ======================================================== */

    {
        id: "UP-LKO-005",

        name: "Lucknow Outer Bypass",

        shortName: "Lucknow Bypass",

        state: "Uttar Pradesh",

        district: "Lucknow",

        authority: "State Infrastructure Development Authority",

        projectType: "Road Infrastructure",

        landCategory: "Agricultural",

        status: "Notification Stage",

        priority: "Medium",

        location: {
            lat: 26.8467,
            lng: 80.9462
        },

        totalLandRequired: 196.7,

        landAcquired: 74.2,

        parcelsRequired: 403,

        parcelsAcquired: 151,

        estimatedValue: 910,

        compensationPending: 58,

        compensationDisbursed: 214,

        riskScore: 51,

        confidenceScore: 84,

        predictedDelayDays: 39,

        primaryDelayDriver:
            "Survey verification",

        delayDrivers: [

            {
                name: "Survey verification",
                percentage: 32
            },

            {
                name: "Documentation gaps",
                percentage: 25
            },

            {
                name: "Stakeholder coordination",
                percentage: 18
            },

            {
                name: "Ownership verification",
                percentage: 15
            },

            {
                name: "Compensation pending",
                percentage: 10
            }

        ],

        documentCompleteness: 61,

        documentsTotal: 403,

        documentsVerified: 246,

        documentsPending: 157,

        stakeholderResponsiveness: 61,

        departmentCoordination: 69,

        legalDisputes: 8,

        courtCases: 3,

        rrStatus: "Planning",

        rr: {

            familiesAffected: 127,

            familiesRelocated: 0,

            familiesPending: 127,

            housesRequired: 84,

            housesCompleted: 0,

            livelihoodCases: 51,

            livelihoodResolved: 0,

            rrProgress: 8

        },

        timeline: [

            {
                stage: "Notification",
                status: "Completed"
            },

            {
                stage: "Survey",
                status: "In Progress"
            },

            {
                stage: "Verification",
                status: "Pending"
            },

            {
                stage: "Award",
                status: "Pending"
            },

            {
                stage: "Compensation",
                status: "Pending"
            },

            {
                stage: "Possession",
                status: "Pending"
            }

        ],

        aiRecommendation:
            "Complete the survey and establish verified parcel records before accelerating acquisition. Early verification will reduce future ownership and documentation disputes."

    }

];



/* ============================================================
   GLOBAL HELPERS
   ============================================================ */

window.LandTrack.helpers = {


    /* --------------------------------------------------------
       GET PROJECT
       -------------------------------------------------------- */

    getProject(projectId) {

        return window.LandTrack.projects.find(
            project =>
                project.id === projectId
        ) || null;

    },


    /* --------------------------------------------------------
       GET R&R
       -------------------------------------------------------- */

    getProjectRR(projectId) {

        const project =
            this.getProject(projectId);


        if (!project) {

            return {

                familiesAffected: 0,

                familiesRelocated: 0,

                familiesPending: 0,

                housesRequired: 0,

                housesCompleted: 0,

                livelihoodCases: 0,

                livelihoodResolved: 0,

                rrProgress: 0

            };

        }


        return {

            ...project.rr

        };

    },


    /* --------------------------------------------------------
       PORTFOLIO TOTAL
       -------------------------------------------------------- */

    portfolio() {

        const projects =
            window.LandTrack.projects;


        return {

            projects:
                projects.length,

            landRequired:
                projects.reduce(
                    (sum, project) =>
                        sum +
                        Number(
                            project.totalLandRequired
                        ),
                    0
                ),

            landAcquired:
                projects.reduce(
                    (sum, project) =>
                        sum +
                        Number(
                            project.landAcquired
                        ),
                    0
                ),

            parcelsRequired:
                projects.reduce(
                    (sum, project) =>
                        sum +
                        Number(
                            project.parcelsRequired
                        ),
                    0
                ),

            parcelsAcquired:
                projects.reduce(
                    (sum, project) =>
                        sum +
                        Number(
                            project.parcelsAcquired
                        ),
                    0
                ),

            compensationPending:
                projects.reduce(
                    (sum, project) =>
                        sum +
                        Number(
                            project.compensationPending
                        ),
                    0
                ),

            highRisk:
                projects.filter(
                    project =>
                        Number(
                            project.riskScore
                        ) >= 65
                ).length,

            critical:
                projects.filter(
                    project =>
                        Number(
                            project.riskScore
                        ) >= 80
                ).length

        };

    },


    /* --------------------------------------------------------
       LAND ACQUISITION %
       -------------------------------------------------------- */

    acquisitionPercentage(
        project
    ) {

        if (!project) {
            return 0;
        }


        const total =
            Number(
                project.totalLandRequired
            );


        if (!total) {
            return 0;
        }


        return Math.round(
            (
                Number(
                    project.landAcquired
                ) /
                total
            ) * 100
        );

    },


    /* --------------------------------------------------------
       RISK LABEL
       -------------------------------------------------------- */

    riskLabel(
        score
    ) {

        score =
            Number(score) || 0;


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

    },


    /* --------------------------------------------------------
       RISK CLASS
       -------------------------------------------------------- */

    riskClass(
        score
    ) {

        score =
            Number(score) || 0;


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

};



/* ============================================================
   APPLICATION STATE
   ============================================================ */

window.LandTrack.state = {

    selectedProjectId:
        window.LandTrack.projects[0]?.id
        || null,

    currentView:
        "overview",

    searchQuery:
        "",

    lastUpdated:
        new Date(),

    demoMode:
        true

};



/* ============================================================
   DATA READY EVENT
   ============================================================ */

document.dispatchEvent(
    new CustomEvent(
        "landtrack:dataready"
    )
);