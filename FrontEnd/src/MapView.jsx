import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
//Mapcontainer "is the main frame whole frame like a painting frame"
//TitleLayer "this is used to fetch the streets and its labels like location"
//Marker "this is used to mark a specific location on the map"
//Popup "this is used to show the info of particular location when we click on the marker"
//all these are componets provided by react-leaflet library think react-leaftlet as a box and inside box we get mapcontainer and all etc.
import "leaflet/dist/leaflet.css" //import things from nodemodules->leafletfolder->dist->leaflet.css tell how to preoply put marker where 
import L from 'leaflet' //importing leaflet library as L do all deep logic work
import { useState, useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const signalEmoji = (state) => L.divIcon({
    html: `<div style="font-size: 30px;">${state === "GREEN" ? "🟢" : "🔴"}</div>`,
    className: 'dummy',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const ambulanceEmoji = L.divIcon({
    html: `<div style="font-size: 30px;">🚑</div>`,
    className: 'dummy',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});


function MapView() {
    const defaultRoute = [
        [9.9908649, 76.3021516],
        [9.9911956, 76.3021332],
        [9.9916629, 76.3020623],
        [9.9922232, 76.3019409],
        [9.9923517, 76.3019267],
        [9.9930340, 76.3018243],
        [9.9933433, 76.3017846],
        [9.9944848, 76.3016587],
        [9.9954740, 76.3014861],
        [9.9960327, 76.3013843],
    ];
    const center = [9.9930419, 76.3017048]; // Jln stadium is what i gave
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [initialETA, setInitialETA] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [etaLogged, setEtaLogged] = useState(false);
    // const [etaBias, setEtaBias] = useState(0);
    const [etaBias, setEtaBias] = useState({
        morning: 0,
        afternoon: 0,
        night: 0
    });
    const ARRIVAL_THRESHOLD_METERS = 15;
    const [arrived, setArrived] = useState(false);
    const [route, setRoute] = useState(defaultRoute); // Track current active route
    const [segmentIndex, setsegmentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(center);
    const [criticality, setCriticality] = useState("CRITICAL");
    const [signals, setSignals] = useState([
        { id: 1, position: [9.994999, 76.292152], state: "RED" },
        { id: 2, position: [9.992308, 76.289544], state: "RED" },
        { id: 3, position: [9.9954740, 76.3014861], state: "RED" },
        // { id: 4, position: [9.994999, 76.292152], state: "RED"},
        { id: 4, position: [9.985764, 76.281511], state: "RED" },
    ]);
    const [hospitalETAs, setHospitalETAs] = useState([]);



    // const signalpos = [...];

    // Default route

    const routeAsterMedcity = [
        [9.9908649, 76.3021516],
        [9.9911956, 76.3021332],
        [9.9916629, 76.3020623],
        [9.9922232, 76.3019409],
        [9.9923517, 76.3019267],
        [9.9930340, 76.3018243],
        [9.9933433, 76.3017846],
        [9.9944848, 76.3016587],
        [9.9954740, 76.3014861],
        [9.9960327, 76.3013843],
        [9.995973, 76.301241],
        [9.995963, 76.301214],
        [9.995957, 76.301160],
        [9.995954, 76.301126],
        [9.995947, 76.301098],
        [9.995938, 76.301007],
        [9.995940, 76.300937],
        [9.995943, 76.300862],
        [9.995975, 76.300737],
        [9.996001, 76.300630],
        [9.996027, 76.300562],
        [9.996060, 76.300474],
        [9.996099, 76.300396],
        [9.996152, 76.300282],
        [9.996258, 76.300154],
        [9.996390, 76.300036],
        [9.996571, 76.299932],
        [9.996725, 76.299852],
        [9.996978, 76.299766],
        [9.997132, 76.299710],
        [9.997241, 76.299688],
        [9.997338, 76.299678],
        [9.997422, 76.299675],
        [9.997549, 76.299680],
        [9.997626, 76.299700],
        [9.997669, 76.299527],
        [9.997681, 76.299336],
        [9.997701, 76.299305],
        [9.997768, 76.299258],
        [9.997869, 76.299213],
        [9.998130, 76.299111],
        [9.998263, 76.299057],
        [9.998409, 76.298972],
        [9.998501, 76.298918],
        [9.998602, 76.298824],
        [9.998727, 76.298755],
        [9.998778, 76.298734],
        [9.998950, 76.298693],
        [9.999119, 76.298645],
        [9.999381, 76.298588],
        [9.999492, 76.298561],
        [9.999607, 76.298531],
        [9.999712, 76.298512],
        [9.999794, 76.298494],
        [9.999826, 76.298451],
        [9.999855, 76.298408],
        [9.999808, 76.298342],
        [9.999746, 76.298248],
        [9.999528, 76.297943],
        [9.999337, 76.297679],
        [9.999101, 76.297378],
        [9.998917, 76.297163],
        [9.998740, 76.296965],
        [9.998561, 76.296770],
        [9.998494, 76.296696],
        [9.998507, 76.296683],
        [9.998588, 76.296650],
        [9.998729, 76.296607],
        [9.998892, 76.296555],
        [9.999062, 76.296497],
        [9.999384, 76.296373],
        [9.999436, 76.296349],
        [9.999647, 76.296322],
        [9.999875, 76.296260],
        [10.000172, 76.296213],
        [10.000423, 76.296091],
        [10.000639, 76.296009],
        [10.000863, 76.295947],
        [10.000937, 76.295912],
        [10.001167, 76.295885],
        [10.001415, 76.295845],
        [10.001792, 76.295754],
        [10.002133, 76.295626],
        [10.002310, 76.295628],
        [10.002335, 76.295647],
        [10.002329, 76.295624],
        [10.002231, 76.295363],
        [10.002038, 76.294930],
        [10.001884, 76.294505],
        [10.001765, 76.294058],
        [10.001567, 76.293608],
        [10.001252, 76.292792],
        [10.001254, 76.292714],
        [10.001395085329914, 76.29260892399078],
        [10.001520, 76.292552],
        [10.001553, 76.292492],
        [10.001657, 76.292419],
        [10.001594, 76.292375],
        [10.001487, 76.292070],
        [10.001387, 76.291746],
        [10.001325, 76.291517],
        [10.001288, 76.291309],
        [10.001236, 76.290979],
        [10.001180, 76.290622],
        [10.001179, 76.290551],
        [10.001125, 76.290239],
        [10.001331, 76.290162],
        [10.001564, 76.290078],
        [10.001781, 76.290003],
        [10.002097, 76.289886],
        [10.002721, 76.289666],
        [10.003021, 76.289564],
        [10.003530, 76.289446],
        [10.004355, 76.289260],
        [10.004797, 76.289139],
        [10.005143, 76.289062],
        [10.005214, 76.289037],
        [10.005076, 76.288680],
        [10.004787, 76.287812],
        [10.004702, 76.287479],
        [10.004602, 76.286970],
        [10.004496, 76.286605],
        [10.004317, 76.286079],
        [10.004005, 76.285543],
        [10.003688, 76.285001],
        [10.003461, 76.284438],
        [10.003213, 76.283794],
        [10.003102, 76.283526],
        [10.003059, 76.283247],
        [10.002922, 76.282818],
        [10.002662, 76.282402],
        [10.002714, 76.282389],
        [10.002951, 76.282205],
        [10.003005, 76.282142],
        [10.003218, 76.282060],
        [10.003398, 76.281952],
        [10.003659, 76.281827],
        [10.003823, 76.281738],
        [10.003995, 76.281646],
        [10.004086, 76.281549],
        [10.004255, 76.281466],
        [10.004548, 76.281326],
        [10.004654, 76.281273],
        [10.004778, 76.281221],
        [10.004824, 76.281197],
        [10.004812, 76.281185],
        [10.004768, 76.281075],
        [10.004721, 76.280931],
        [10.004707, 76.280884],
        [10.004674, 76.280803],
        [10.004626, 76.280697],
        [10.004556, 76.280547],
        [10.004573, 76.280527],
        [10.004608, 76.280509],
        [10.004564, 76.280413],
        [10.004508, 76.280301],
        [10.004480, 76.280225],
        [10.004476, 76.280189],
        [10.004495, 76.280124],
        [10.004525, 76.280005],
        [10.004538, 76.279988],
        [10.004505, 76.279876],
        [10.004490, 76.279702],
        [10.004484, 76.279588],
        [10.004467, 76.279523],
        [10.004794, 76.279322],
        [10.005202, 76.279104],
        [10.005297, 76.279025],
        [10.005424, 76.278916],
        [10.005537, 76.278795],
        [10.005661, 76.278678],
        [10.005713, 76.278656],
        [10.005998, 76.278592],
        [10.006814, 76.278378],
        [10.007312, 76.278283],
        [10.007745, 76.278178],
        [10.008228, 76.278069],
        [10.008702, 76.277983],
        [10.008858, 76.277927],
        [10.009587, 76.277793],
        [10.009730, 76.277763],
        [10.010064, 76.277660],
        [10.010849, 76.277507],
        [10.011791, 76.277369],
        [10.012436, 76.277226],
        [10.012782, 76.277231],
        [10.012976, 76.277247],
        [10.013177296237467, 76.27724251078473],
        [10.013288, 76.277184],
        [10.013399, 76.277017],
        [10.013626, 76.276974],
        [10.013986, 76.276899],
        [10.014297, 76.276679],
        [10.015084, 76.276486],
        [10.015581, 76.276384],
        [10.015961, 76.276352],
        [10.016331, 76.276341],
        [10.016546, 76.276385],
        [10.016896, 76.276269],
        [10.017641, 76.276030],
        [10.018395837748182, 76.27590409651592],
        [10.018718, 76.275793],
        [10.018850, 76.275546],
        [10.018946, 76.275419],
        [10.018961, 76.275033],
        [10.01901419380142, 76.27487160268377],
        [10.019368128541094, 76.27465702595937],
        [10.019489628437302, 76.27464093270505],
        [10.020034, 76.274475],
        [10.020425, 76.274346],
        [10.020812826446008, 76.2742238356154],
        [10.021093, 76.274149],
        [10.021558, 76.274074],
        [10.022186, 76.273993],
        [10.022614, 76.273956],
        [10.023047, 76.273977],
        [10.023585, 76.273896],
        [10.024119, 76.273949],
        [10.026057, 76.274439],
        [10.026494, 76.274596],
        [10.027247, 76.274851],
        [10.027698, 76.275001],
        [10.028326750833692, 76.27527899394404],
        [10.029256, 76.275311],
        [10.029900919844541, 76.27539701114246],
        [10.030302, 76.275247],
        [10.031148, 76.274903],
        [10.031961, 76.274775],
        [10.032120, 76.274667],
        [10.032975, 76.274110],
        [10.033382, 76.274147],
        [10.033373, 76.275570],
        [10.033382, 76.276011],
        [10.033533, 76.276150],
        [10.033606380706297, 76.27613863776018],
        [10.034033, 76.276036],
        [10.034309, 76.275980],
        [10.034434, 76.275932],
        [10.034606, 76.275787],
        [10.034841, 76.275709],
        [10.035079, 76.275709],
        [10.036007, 76.275523],
        [10.036915, 76.275397],
        [10.037411, 76.275252],
        [10.037596214174643, 76.27520418736034],
        [10.037908, 76.275322],
        [10.038055774642903, 76.2753436622312],
        [10.038362, 76.275258],
        [10.039809, 76.274882],
        [10.041986, 76.274507],
        [10.043211, 76.274104],
        [10.043824, 76.273992],
        [10.043816, 76.274046],
        [10.043889, 76.274380],
        [10.043990, 76.274882],
        [10.044037, 76.275026],
        [10.044016, 76.275016],
        [10.043976, 76.275024],
        [10.043928, 76.275044],
        [10.043906, 76.275057],
        [10.043883, 76.275125],
        [10.043865, 76.275194],
        [10.043873, 76.275228],
        [10.043896, 76.275266],
        [10.043919, 76.275300],
        [10.043940, 76.275320],
        [10.043928, 76.275343], [10.043922, 76.275380], [10.043917, 76.275415], [10.043917, 76.275490], [10.043920, 76.275575],
        [10.043922, 76.275661],
        [10.043938, 76.275750],
        [10.043965, 76.275878],
        [10.043971, 76.275937],
        [10.043970, 76.275976],
        [10.043956, 76.276110],
        [10.043946, 76.276191],
        [10.043941, 76.276245],
        [10.043942, 76.276347],
        [10.043948, 76.276426],
        [10.043952, 76.276458]
    ];

    const routeLisie = [
        [9.9908649, 76.3021516],
        [9.9911956, 76.3021332],
        [9.9916629, 76.3020623],
        [9.9922232, 76.3019409],
        [9.9923517, 76.3019267],
        [9.9930340, 76.3018243],
        [9.9933433, 76.3017846],
        [9.9944848, 76.3016587],
        [9.9954740, 76.3014861],
        [9.9960327, 76.3013843],
        [9.995949, 76.301045],
        [9.995984, 76.300702],
        [9.996049, 76.300507],
        [9.996170, 76.300286],
        [9.996393, 76.300069],
        [9.996601, 76.299934],
        [9.996774, 76.299817],
        [9.996932, 76.299788],
        [9.997055, 76.299734],
        [9.997190, 76.299701],
        [9.997459, 76.299668],
        [9.997637, 76.299723],
        [9.997809, 76.299777],
        [9.997974, 76.299850],
        [9.998127, 76.299928],
        [9.998211, 76.300093],
        [9.998417, 76.300106],
        [9.998593, 76.300155],
        [9.998847, 76.300200],
        [9.999005, 76.300155],
        [9.999190, 76.300075],
        [9.999422, 76.300012],
        [9.999607, 76.299932],
        [9.999767, 76.299871],
        [10.000012, 76.299828],
        [10.000273, 76.299730],
        [10.000505, 76.299541],
        [10.000501, 76.299491],
        [10.000501, 76.299449],
        [10.000494, 76.299395],
        [10.000481, 76.299358],
        [10.000428, 76.299286],
        [10.000388, 76.299206],
        [10.000339, 76.299124],
        [10.000291, 76.299052],
        [10.000237, 76.298974],
        [10.000187, 76.298901],
        [10.000127, 76.298830],
        [10.000082, 76.298750],
        [10.000044, 76.298720],
        [9.999999, 76.298640],
        [9.999942, 76.298569],
        [9.999890, 76.298492],
        [9.999840, 76.298418],
        [9.999800, 76.298350],
        [9.999752, 76.298277],
        [9.999709, 76.298195],
        [9.999653, 76.298121],
        [9.999604, 76.298046],
        [9.999553, 76.297969],
        [9.999494, 76.297899],
        [9.999440, 76.297826],
        [9.999388, 76.297754],
        [9.999338, 76.297684],
        [9.999308, 76.297643],
        [9.999050, 76.297395],
        [9.998701, 76.296933],
        [9.998461, 76.296715],
        [9.998151, 76.296272],
        [9.997899, 76.295942],
        [9.997535, 76.295483],
        [9.997184, 76.295091],
        [9.996841, 76.294657],
        [9.996584, 76.294248],
        [9.996214, 76.293760],
        [9.995830, 76.293217],
        [9.995488, 76.292784],
        [9.995261, 76.292505],
        [9.994999, 76.292152], //junction
        [9.994522, 76.291710],
        [9.994255, 76.291447],
        [9.993959, 76.291144],
        [9.993594, 76.290828],
        [9.993282, 76.290505],
        [9.992954, 76.290205],
        [9.992637, 76.289848],
        [9.992308, 76.289544], //juntion
        [9.992013, 76.289158],
        [9.991697, 76.288828],
        [9.991345, 76.288409],
        [9.991167, 76.288159],
        [9.990960, 76.287916],
        [9.990943, 76.287892],
        [9.990926, 76.287882],
        [9.990900, 76.287883],
        [9.990806, 76.287930],
        [9.990567, 76.288044],
        [9.990142, 76.288229],
        [9.989760, 76.288393],
        [9.989333, 76.288536],
        [9.989032, 76.288637],
        [9.989014, 76.288632],
        [9.988995, 76.288633],
        [9.988975, 76.288592],
        [9.988939, 76.288533],
        [9.988925, 76.288512],
        [9.988907, 76.288507],
        [9.988893, 76.288516],
        [9.988881, 76.288513],
        [9.988870, 76.288516],
        [9.988857, 76.288509],
        [9.988844, 76.288454],
        [9.988841, 76.288397],
        [9.988836, 76.288385],
        [9.988826, 76.288375],
        [9.988078, 76.288166]

    ]

    const routeRennai = [
        [9.9908649, 76.3021516],
        [9.9911956, 76.3021332],
        [9.9916629, 76.3020623],
        [9.9922232, 76.3019409],
        [9.9923517, 76.3019267],
        [9.9930340, 76.3018243],
        [9.9933433, 76.3017846],
        [9.9944848, 76.3016587],
        [9.9954740, 76.3014861],
        [9.9960327, 76.3013843],
        [9.995963, 76.301266],
        [9.995954, 76.301249],
        [9.995961, 76.301227],
        [9.995958, 76.301195],
        [9.995948, 76.301154],
        [9.995940, 76.301109],
        [9.995929, 76.301016],
        [9.995930, 76.300971],
        [9.995936, 76.300918],
        [9.995930, 76.300875],
        [9.995936, 76.300845],
        [9.995949, 76.300790],
        [9.995962, 76.300726],
        [9.995982, 76.300656],
        [9.996002, 76.300610],
        [9.996013, 76.300565],
        [9.996028, 76.300528],
        [9.996051, 76.300481],
        [9.996051, 76.300481],
        [9.996117, 76.300335],
        [9.996162, 76.300264],
        [9.996207, 76.300202],
        [9.996271, 76.300136],
        [9.996338, 76.300073],
        [9.996416, 76.300022],
        [9.996491, 76.299975],
        [9.996567, 76.299922],
        [9.996648, 76.299893],
        [9.996732, 76.299852],
        [9.996811, 76.299814],
        [9.996901, 76.299786],
        [9.996985, 76.299753],
        [9.997069, 76.299727],
        [9.997154, 76.299698],
        [9.997244, 76.299682],
        [9.997333, 76.299668],
        [9.997428, 76.299667],
        [9.997514, 76.299677],
        [9.997559, 76.299682],
        [9.997601, 76.299693],
        [9.997648, 76.299703],
        [9.997689, 76.299712],
        [9.997734, 76.299731],
        [9.997778, 76.299739],
        [9.997821, 76.299757],
        [9.997860, 76.299770],
        [9.997898, 76.299801],
        [9.997941, 76.299819],
        [9.997986, 76.299846],
        [9.998019, 76.299863],
        [9.998054, 76.299888],
        [9.998084, 76.299917],
        [9.998124, 76.299949],
        [9.998159, 76.299972],
        [9.998188, 76.300013],
        [9.998217, 76.300046],
        [9.998249, 76.300074],
        [9.998271, 76.300115],
        [9.998278, 76.300109],
        [9.998298, 76.300122],
        [9.998313, 76.300121],
        [9.998363, 76.300124],
        [9.998411, 76.300135],
        [9.998498, 76.300153],
        [9.998591, 76.300169],
        [9.998676, 76.300183],
        [9.998769, 76.300196],
        [9.998845, 76.300217],
        [9.998864, 76.300223],
        [9.998900, 76.300218],
        [9.998927, 76.300211],
        [9.998946, 76.300210],
        [9.999035, 76.300181],
        [9.999120, 76.300149],
        [9.999202, 76.300124],
        [9.999298, 76.300092],
        [9.999370, 76.300072],
        [9.999464, 76.300034],
        [9.999464, 76.300034],
        [9.999667, 76.299967],
        [9.999719, 76.299944],
        [9.999796, 76.299918],
        [9.999886, 76.299890],
        [9.999970, 76.299856],
        [10.000049, 76.299828],
        [10.000143, 76.299803],
        [10.000237, 76.299781],
        [10.000318, 76.299737],
        [10.000388, 76.299685],
        [10.000474, 76.299617],
        [10.000463, 76.299557],
        [10.000483, 76.299525],
        [10.000502, 76.299479],
        [10.000481, 76.299412],
        [10.000484, 76.299384],
        [10.000425, 76.299296],
        [9.999999, 76.298640],
        [9.999942, 76.298569],
        [9.999890, 76.298492],
        [9.999840, 76.298418],
        [9.999800, 76.298350],
        [9.999752, 76.298277],
        [9.999709, 76.298195],
        [9.999653, 76.298121],
        [9.999604, 76.298046],
        [9.999553, 76.297969],
        [9.999494, 76.297899],
        [9.999440, 76.297826],
        [9.999388, 76.297754],
        [9.999338, 76.297684],
        [9.999308, 76.297643],
        [9.999050, 76.297395],
        [9.998701, 76.296933],
        [9.998461, 76.296715],
        [9.998151, 76.296272],
        [9.997899, 76.295942],
        [9.997535, 76.295483],
        [9.997184, 76.295091],
        [9.996841, 76.294657],
        [9.996584, 76.294248],
        [9.996214, 76.293760],
        [9.995830, 76.293217],
        [9.995488, 76.292784],
        [9.995261, 76.292505],
        [9.994999, 76.292152], //JUNCTION
        [9.994522, 76.291710],
        [9.994255, 76.291447],
        [9.993959, 76.291144],
        [9.993594, 76.290828],
        [9.993282, 76.290505],
        [9.992954, 76.290205],
        [9.992637, 76.289848],
        [9.992308, 76.289544], //JUNCTION
        [9.991996, 76.289173],
        [9.991709, 76.288791],
        [9.991365, 76.288431],
        [9.991089, 76.288091],
        [9.990843, 76.287778],
        [9.990505, 76.287428],
        [9.990138, 76.287158],
        [9.989808, 76.286920],
        [9.989458, 76.286691],
        [9.989130, 76.286491],
        [9.988678, 76.286236],
        [9.988290, 76.285981],
        [9.987926, 76.285686],
        [9.987529, 76.285359],
        [9.987529, 76.285359],
        [9.986929, 76.284685],
        [9.986638, 76.284240],
        [9.986403, 76.283789],
        [9.986222, 76.283185],
        [9.986157, 76.282853],
        [9.985928, 76.282288],
        [9.985764, 76.281511], //JUNCTION
        [9.985640, 76.280920],
        [9.985581, 76.280302],
        [9.985352, 76.279817],
        [9.985175, 76.279173],
        [9.985090, 76.278449],
        [9.985162, 76.277911],
        [9.985077, 76.277379],
        [9.984992, 76.276921],
        [9.984763, 76.276277],
        [9.984793, 76.276200],
        [9.985131, 76.276093],
        [9.985578, 76.275929],
        [9.985961, 76.275789],
        [9.986404, 76.275674],
        [9.986847, 76.275550],
        [9.987075, 76.275484],
        [9.987313, 76.275535],
        [9.987799, 76.275664],
        [9.988284, 76.275798],
        [9.988731, 76.276005],
        [9.989140, 76.276110],
        [9.989510, 76.276273],
        [9.989861, 76.276328],
        [9.990338, 76.276462],
        [9.990599, 76.276547],
        [9.991029, 76.276698],
        [9.991465, 76.276854],
        [9.991927, 76.277002],
        [9.992312, 76.277110],
        [9.992759, 76.277235],
        [9.993175, 76.277364],
        [9.993590, 76.277435],
        [9.993629, 76.277423],
        [9.993654, 76.277399],
        [9.993785, 76.277229],
        [9.993857, 76.277221],
        [9.993973, 76.277245],
        [9.994419, 76.277406],
        [9.994849, 76.277517],
        [9.995274, 76.277631],
        [9.995703, 76.277751],
        [9.996163, 76.277949],
        [9.996163, 76.277949],
        [9.996988, 76.278173],
        [9.997423, 76.278315],
        [9.997824, 76.278397],
        [9.998405, 76.278533],
        [9.998846, 76.278716],
        [9.999296, 76.278847],
        [9.999761, 76.278955],
        [10.000191, 76.279120],
        [10.000633, 76.279218],
        [10.000994, 76.279321],
        [10.001322, 76.279389],
        [10.001338, 76.279359],
        [10.001300, 76.279171],
        [10.001191, 76.278711],
        [10.001063, 76.278249],
        [10.000984, 76.277993],
        [10.001006, 76.277979],
        [10.001144, 76.277947],
        [10.001612, 76.277843],
        [10.002012, 76.277731],
        [10.002463, 76.277627],
        [10.002917, 76.277539],
        [10.003352, 76.277412],
        [10.003809, 76.277280],
        [10.004189, 76.277041],
        [10.004346, 76.276991],
        [10.004454, 76.276947],
        [10.004612, 76.276866],
        [10.005080, 76.276736],
        [10.005331, 76.276664],
        [10.005664, 76.276563],
        [10.005687, 76.276581],
        [10.005846, 76.277028],
        [10.005975, 76.277394],
        [10.006062, 76.277609],
        [10.006291, 76.278146],
        [10.006487, 76.278222],
        [10.006650, 76.278186],
        [10.006674, 76.278093],
        [10.0066809, 76.2774219],
    ]

    useEffect(() => {
        if (!route.length || arrived) return;
        if (hasArrived()) {
            setArrived(true);
        }
    }, [currentPosition, route, arrived]);

    useEffect(() => {
        if (!arrived || etaLogged || !startTime || initialETA === null) return;

        const actualTime = Math.round((Date.now() - startTime) / 1000);
        const error = actualTime - initialETA;

        const learningRate = 0.2;
        const bucket = getTimeBucket();

        setEtaBias(prev => {
            const updated = {
                ...prev,
                [bucket]: prev[bucket] + learningRate * error
            };

            const global =
                JSON.parse(localStorage.getItem("globalModel")) || {
                    morning: 0,
                    afternoon: 0,
                    night: 0,
                    samples: { morning: 0, afternoon: 0, night: 0 }
                };

            global[bucket] =
                (global[bucket] * global.samples[bucket] + updated[bucket])
                / (global.samples[bucket] + 1);

            global.samples[bucket] += 1;
            localStorage.setItem("globalModel", JSON.stringify(global));

            return updated;
        });

        setEtaLogged(true);

        console.log({ initialETA, actualTime, error, bucket });
    }, [arrived]);



    const hospitalRoutes = [
        { id: "H1", name: "Lisie Hospital", route: routeLisie },
        // { id: "H2", name: "PVS Memorial Hospital", route: [] },
        { id: "H3", name: "Aster Medcity", route: routeAsterMedcity },
        // { id: "H4", name: "KIMS Hospital", route: [] },
        { id: "H5", name: "Renai Medicity", route: routeRennai }
    ];



    const getThresholdDistance = () => {
        if (criticality === "STABLE") return 40;
        if (criticality === "CRITICAL") return 80;
        if (criticality === "VERY CRITICAL") return 200;
        return 60;
    }

    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const hasArrived = () => {
        if (!route || route.length === 0) return false;

        const [endLat, endLng] = route[route.length - 1];
        const [curLat, curLng] = currentPosition;

        return getDistanceInMeters(curLat, curLng, endLat, endLng) <= ARRIVAL_THRESHOLD_METERS;
    };



    useEffect(() => {
        if (!route || route.length < 2) return;
        const speed = 0.15;
        const interval = setInterval(() => {
            if (hasArrived()) {
                clearInterval(interval);
                return;
            }

            const [lat1, lng1] = route[segmentIndex];
            const [lat2, lng2] = route[segmentIndex + 1];

            const newProgress = progress + speed;
            let lat, lng;

            if (newProgress >= 1) {
                setsegmentIndex(segmentIndex + 1);
                setProgress(0);
                setCurrentPosition(route[segmentIndex + 1]);
                [lat, lng] = route[segmentIndex + 1];
            }
            else {
                setProgress(newProgress);
                lat = lat1 + (lat2 - lat1) * newProgress;
                lng = lng1 + (lng2 - lng1) * newProgress;
                setCurrentPosition([lat, lng]);
            }

            setSignals(prevSignals =>
                prevSignals.map(signal => {
                    const distance = getDistanceInMeters(
                        lat,
                        lng,
                        signal.position[0],
                        signal.position[1]
                    );

                    const threshold = getThresholdDistance();

                    return {
                        ...signal,
                        state: distance <= threshold ? "GREEN" : "RED"
                    };
                })
            );
        }, 100);

        return () => clearInterval(interval);
    }, [segmentIndex, progress, criticality, route]);

    const getCorridorConfig = () => {
        if (criticality === "STABLE") return { color: "blue" };
        if (criticality === "CRITICAL") return { color: "orange" };
        if (criticality === "VERY CRITICAL") return { color: "red" };
        return null;
    }

    const getCorridorPoints = () => {
        const points = [currentPosition];
        for (let i = segmentIndex + 1; i < route.length; i++) {
            points.push(route[i]);
        }
        return points;
    };

    const AMBULANCE_SPEED = 12;

    const geDelayTime = () => {
        if (criticality === "STABLE") return 10;
        if (criticality === "CRITICAL") return 5;
        if (criticality === "VERY CRITICAL") return 2;
        return 8;
    }

    const getDistance = () => {
        let distance = 0;
        if (segmentIndex < route.length - 1) {
            distance += getDistanceInMeters(currentPosition[0], currentPosition[1], route[segmentIndex + 1][0], route[segmentIndex + 1][1]);
        }
        for (let i = segmentIndex + 1; i < route.length - 1; i++) {
            distance += getDistanceInMeters(route[i][0], route[i][1], route[i + 1][0], route[i + 1][1]);
        }
        return distance;
    }

    const getRedSignalsAheadCount = () => {
        let count = 0;
        const remainingDistance = getDistance();

        signals.forEach(signal => {
            const distanceToSignal = getDistanceInMeters(
                currentPosition[0], currentPosition[1],
                signal.position[0], signal.position[1]
            );

            if (distanceToSignal <= remainingDistance && signal.state === "RED") {
                count++;
            }
        });
        return count;
    };

    const ETAseconds = () => {
        const remainingDistance = getDistance();
        const travelTime = remainingDistance / AMBULANCE_SPEED;

        const redSignalsAhead = getRedSignalsAheadCount();
        const signalDelay = redSignalsAhead * geDelayTime();

        const bucket = getTimeBucket();

        return Math.max(
            0,
            Math.round(travelTime + signalDelay + etaBias[bucket])
        );
    };



    const formETA = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins} mins ${secs} secs`;
    }

    const getHospitalDistance = (hospital) => {
        if (!hospital.route || hospital.route.length === 0) return Infinity;
        const [hLat, hLng] = hospital.route[hospital.route.length - 1];
        const [aLat, aLng] = currentPosition;
        return getDistanceInMeters(hLat, hLng, aLat, aLng);
    }

    const autoSelectNearestHospital = () => {
        let nearestHospital = null;
        let bestETA = Infinity;
        const global = JSON.parse(localStorage.getItem("globalModel"));
        const biasToUse = global ? {
            morning: global.morning,
            afternoon: global.afternoon,
            night: global.night
        } : etaBias;

        if (global) {
            setEtaBias(biasToUse);
        }

        const etaList = hospitalRoutes.map(h => ({
            id: h.id,
            name: h.name,
            eta: computeETAForRoute(h.route, biasToUse)
        }));
        setHospitalETAs(etaList);

        hospitalRoutes.forEach(hospital => {
            const eta = computeETAForRoute(hospital.route, biasToUse);
            if (eta < bestETA) {
                bestETA = eta;
                nearestHospital = hospital;
            }
        });

        if (!nearestHospital || nearestHospital.route.length < 2) {
            alert("No valid hospital routes found.");
            return;
        }

        setSelectedHospital(nearestHospital);
        setRoute(nearestHospital.route);
        setsegmentIndex(0);
        setProgress(0);
        setCurrentPosition(nearestHospital.route[0]);

        let totalD = 0;
        for (let i = 0; i < nearestHospital.route.length - 1; i++) {
            totalD += getDistanceInMeters(
                nearestHospital.route[i][0], nearestHospital.route[i][1],
                nearestHospital.route[i + 1][0], nearestHospital.route[i + 1][1]
            );
        }

        const initialTravelTime = totalD / AMBULANCE_SPEED;
        setInitialETA(Math.round(initialTravelTime));
        setStartTime(Date.now());
        setArrived(false);
        setEtaLogged(false);
    };

    const computeETAForRoute = (testRoute, bias = etaBias) => {
        if (!testRoute || testRoute.length < 2) return Infinity;

        let distance = 0;
        for (let i = 0; i < testRoute.length - 1; i++) {
            distance += getDistanceInMeters(
                testRoute[i][0], testRoute[i][1],
                testRoute[i + 1][0], testRoute[i + 1][1]
            );
        }

        const travelTime = distance / AMBULANCE_SPEED;
        const signalDelay =
            signals.filter(s => s.state === "RED").length * geDelayTime();

        const bucket = getTimeBucket();
        return Math.round(travelTime + signalDelay + bias[bucket]);
    };

    const getTimeBucket = () => {
        const h = new Date().getHours();
        if (h < 10) return "morning";
        if (h < 18) return "afternoon";
        return "night";
    };




    return (
        <div style={{ position: "relative" }}>
            <div style={{
                position: 'absolute',
                top: 40,
                left: 50,
                zIndex: 1000,
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                maxHeight: "90vh",
                overflowY: "auto"
            }}>
                <button onClick={() => setCriticality("STABLE")}>STABLE</button>
                <button onClick={() => setCriticality("CRITICAL")}>CRITICAL</button>
                <button onClick={() => setCriticality("VERY CRITICAL")}>VERY CRITICAL</button>

                <div style={{ color: "black", marginTop: "10px", fontWeight: "bold", borderTop: "1px solid #ddd", paddingTop: "5px" }}>
                    ETA: {formETA(ETAseconds())}
                </div>
                {hospitalETAs.length > 0 && (
                    <div style={{ marginTop: "10px", fontSize: "13px" }}>
                        <b>Hospital ETAs</b>
                        {hospitalETAs.map(h => (
                            <div
                                key={h.id}
                                style={{
                                    color: selectedHospital?.id === h.id ? "green" : "black",
                                    fontWeight: selectedHospital?.id === h.id ? "bold" : "normal"
                                }}
                            >
                                {h.name}: {formETA(h.eta)}
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ fontSize: "12px", marginTop: "5px", color:'black'}}>
                    Time bucket: {getTimeBucket()}
                </div>


                <button
                    style={{ background: "#1976d2", color: "white", fontWeight: "bold", marginTop: "5px", cursor: "pointer" }}
                    onClick={autoSelectNearestHospital}
                >
                    AUTO SELECT NEAREST
                </button>
            </div>

            <MapContainer center={center} zoom={15} style={{ height: "100vh", width: "100vw" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />

                {getCorridorConfig() && (
                    <Polyline positions={getCorridorPoints()} pathOptions={{ color: getCorridorConfig().color, weight: 6, opacity: 1 }} />
                )}

                <Marker position={currentPosition} icon={ambulanceEmoji}>
                    <Popup><b>Ambulance</b><br />Criticality: {criticality}</Popup>
                </Marker>

                {signals.map(signal => (
                    <Marker
                        key={signal.id}
                        position={signal.position}
                        icon={signalEmoji(signal.state)}
                    >
                        <Popup>
                            <b>Traffic Signal</b><br />
                            State: {signal.state}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapView;