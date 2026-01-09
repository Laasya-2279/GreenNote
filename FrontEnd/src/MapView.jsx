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
    const center = [9.9930419, 76.3017048]; // Jln stadium is what i gave
    const [selectedHospital, setSelectedHospital] = useState(null);


    // Default route
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

    ]

    const routeRennai = [
        
    ]

    const hospitalRoutes = [
        { id: "H1", name: "Lisie Hospital", route: routeLisie },
        // { id: "H2", name: "PVS Memorial Hospital", route: [] },
        { id: "H3", name: "Aster Medcity", route: routeAsterMedcity },
        // { id: "H4", name: "KIMS Hospital", route: [] },
        { id: "H5", name: "Renai Medicity", route: routeRennai }
    ];

    const [route, setRoute] = useState(defaultRoute); // Track current active route
    const [segmentIndex, setsegmentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(center);
    const [criticality, setCriticality] = useState("CRITICAL");
    const [signalState, setsignalState] = useState("RED");
    const signalpos = [9.9933433, 76.3017846];

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


    useEffect(() => {
        if (!route || route.length < 2) return;
        const speed = 0.02;
        const interval = setInterval(() => {
            if (segmentIndex >= route.length - 1) return;

            const [lat1, lng1] = route[segmentIndex];
            const [lat2, lng2] = route[segmentIndex + 1];

            const newProgress = progress + speed;
            let lat, lng;

            if (newProgress >= 1) {
                if (segmentIndex < route.length - 2) {
                    setsegmentIndex(segmentIndex + 1);
                    setProgress(0);
                    setCurrentPosition(route[segmentIndex + 1]);
                    [lat, lng] = route[segmentIndex + 1];
                }
                else {
                    clearInterval(interval);
                    return;
                }
            }
            else {
                setProgress(newProgress);
                lat = lat1 + (lat2 - lat1) * newProgress;
                lng = lng1 + (lng2 - lng1) * newProgress;
                setCurrentPosition([lat, lng]);
            }

            const distanceToSignal = getDistanceInMeters(lat, lng, signalpos[0], signalpos[1]);
            const threshold = getThresholdDistance();
            setsignalState(distanceToSignal <= threshold ? "GREEN" : "RED");
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

    const ETAseconds = () => {
        const remainingDistance = getDistance();
        const travelTime = remainingDistance / AMBULANCE_SPEED;
        const signalAhead = segmentIndex < route.length / 2 ? 1 : 0;
        return Math.max(0, Math.round(travelTime + (signalAhead * geDelayTime())));
    }

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
        let minDistance = Infinity;
        setsignalState("RED");

        hospitalRoutes.forEach(hospital => {
            const distance = getHospitalDistance(hospital);
            if (distance < minDistance) {
                minDistance = distance;
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
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
        }}>
            <button onClick={() => setCriticality("STABLE")}>STABLE</button>
            <button onClick={() => setCriticality("CRITICAL")}>CRITICAL</button>
            <button onClick={() => setCriticality("VERY CRITICAL")}>VERY CRITICAL</button>

            <div style={{ color: "black", marginTop: "10px", fontWeight: "bold", borderTop: "1px solid #ddd", paddingTop: "5px" }}>
                ETA: {formETA(ETAseconds())}
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

            <Marker position={signalpos} icon={signalEmoji(signalState)}>
                <Popup><b>Traffic Signal</b><br />State: {signalState}</Popup>
            </Marker>
        </MapContainer>
    </div>
)
}

export default MapView;