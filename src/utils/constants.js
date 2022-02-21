export const DEFAULT_BED_DATA = {
  bed: "",
  lastName: "",
  firstName: "",
  teamNumber: "",
  oneLiner: "",
  contingencies: [],
  contentType: "simple",
  simpleContent: "",
  nestedContent: [],
  bottomText: "",
};

export const DEFAULT_SETTINGS = {
  document_cols_per_page: 4,
  document_title: "",
  export_filename: "grid",
  contingencyOptions: [
    "Critical Airway",
    "Critical Brain",
    "Difficult Airway",
    "ORL STAT",
    "Anesthesia STAT",
    "No ECMO",
    "DNR/DNI",
    "Modified DNR",
    "Comfort measures only",
    "Pulm HTN",
  ],
  show_demoBox: false,
};

export const TEST_GRID_DATA = [
  {
    bed: "4",
    lastName: "Leffingwell",
    firstName: "Keira",
    teamNumber: "2",
    oneLiner:
      "3yo ex 23 wk F with CLD, Pulm vein stenosis, SGS, Trach, nocturnal vent, here with hypoxemia, worse PVS, and pulm HTN and RV dysfunction",
    contingencies: ["Pulm HTN"],
    contentType: "simple",
    simpleContent:
      "R - baseline Trach collar 1-2 L, night time PSV 10/7\nCV - acute on chronic pulm HTN, sildenafil\n   [ ] Plan for cath intervention\nGI - Gtube feeds\nID - none\nH - home ASA\nSocial - parents moved to Boston, no housing",
    nestedContent: [],
    bottomText: "",
  },
  {
    bed: "15",
    lastName: "Alemadi",
    firstName: "Ali",
    teamNumber: "2",
    oneLiner:
      "13yoM w/ MEGDEL syndrome, chronic resp failure, RLD, scoliosis, s/p PSF 9/10 complicated by cecal volvulus needing diverting ileostomy, c/b metabolic stroke post-op, reanastamosed, now with neurologic injury and abnormal neural respiratory drive. Now FRESH tracheostomy on 1/18",
    contingencies: ["Critical Airway"],
    contentType: "nested",
    simpleContent: "",
    nestedContent: [
      {
        id: "section-8673",
        title: "N",
        top: "Metabolism/Neuro following\nIntermittent anisocoria",
        items: [
          {
            id: "item-1337",
            value: "Dex gtt",
          },
        ],
      },
      {
        id: "section-8674",
        title: "R",
        top: "Int/MV",
        items: [
          {
            id: "item-1472",
            value: "CAPE team following",
          },
        ],
      },
      {
        id: "section-8675",
        title: "CV",
        top: "Clonidine for HTN, PRN hydral/labetalol",
        items: [],
      },
      {
        id: "section-8676",
        title: "F",
        top: "GJ feeds\nCarnitine - metab",
        items: [],
      },
      {
        id: "section-8677",
        title: "ID",
        top: "AF, No Abx",
        items: [],
      },
      {
        id: "section-8678",
        title: "H",
        top: "Rt IJ thrombus (prior CVL) - Treatment Lovenox, goal 0.5-1, x3months",
        items: [],
      },
      {
        id: "section-8832",
        title: "OPTHO",
        top: "Anisocoria, optic nerve atrophy, exposure keratopathy",
        items: [],
      },
      {
        id: "section-8680",
        title: "ACC",
        top: "PIV, GJ",
        items: [],
      },
    ],
    bottomText: "",
  },
];
