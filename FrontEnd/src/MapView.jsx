import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import "leaflet/dist/leaflet.css"
import L from 'leaflet'
import { useState, useEffect, useRef } from 'react';

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

const carIcon = L.divIcon({
    html: `<div style="font-size: 25px;">🚗</div>`,
    className: 'dummy',
    iconSize: [25, 25],
    iconAnchor: [12, 12]
});

function MapView() {
    const defaultRoute = [];

    const center = [9.9930419, 76.3017048];
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [initialETA, setInitialETA] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [etaLogged, setEtaLogged] = useState(false);
    const [etaBias, setEtaBias] = useState({
        morning: 0,
        afternoon: 0,
        night: 0
    });
    const ARRIVAL_THRESHOLD_METERS = 15;
    const [arrived, setArrived] = useState(false);
    const [route, setRoute] = useState(defaultRoute);
    const [segmentIndex, setsegmentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [currentPosition, setCurrentPosition] = useState(center);
    const [criticality, setCriticality] = useState("CRITICAL");
    const [signals, setSignals] = useState([
        { id: 1, position: [9.9954740, 76.3014861], state: "RED" },
        { id: 2, position: [9.992308, 76.289544], state: "RED" },
        { id: 3, position: [9.9954740, 76.3014861], state: "RED" },
        { id: 4, position: [9.994999, 76.292152], state: "RED" },
        { id: 5, position: [9.985764, 76.281511], state: "RED" },
    ]);
    const [hospitalETAs, setHospitalETAs] = useState([]);
    const audioContextRef = useRef(null);

    const [cars, setCars] = useState([
        { id: 1, position: [9.995211, 76.301557], moving: false },
        { id: 2, position: [9.995467, 76.292663], moving: false },
        { id: 3, position: [9.992654, 76.289889], moving: false },
        { id: 4, position: [9.985862, 76.281859], moving: false }
    ]);

    const beepIntervalRef = useRef(null);

    const routeAsterMedcity = [];
    const routeLisie = [[9.9908649, 76.3021516],
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
    [9.988078, 76.288166]];
    const routeRennai = [];

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
        { id: "H3", name: "Aster Medcity", route: routeAsterMedcity },
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

            if (segmentIndex >= route.length - 1) {
                return;
            }

            const [lat1, lng1] = route[segmentIndex];
            const [lat2, lng2] = route[segmentIndex + 1];

            const newProgress = progress + speed;
            let lat, lng;

            if (newProgress >= 1) {
                setsegmentIndex(segmentIndex + 1);
                setProgress(0);
                [lat, lng] = route[segmentIndex + 1];
                setCurrentPosition([lat, lng]);
            } else {
                lat = lat1 + (lat2 - lat1) * newProgress;
                lng = lng1 + (lng2 - lng1) * newProgress;
                setProgress(newProgress);
                setCurrentPosition([lat, lng]);
            }

            setSignals(prev =>
                prev.map(signal => {
                    const d = getDistanceInMeters(
                        lat, lng,
                        signal.position[0],
                        signal.position[1]
                    );
                    return {
                        ...signal,
                        state: d <= getThresholdDistance() ? "GREEN" : "RED"
                    };
                })
            );

            setCars(prev =>
                prev.map(car => {
                    const d = getDistanceInMeters(
                        lat, lng,
                        car.position[0],
                        car.position[1]
                    );

                    if (d < 80 && !car.movedAside) {
                        return {
                            ...car,
                            position: [
                                car.position[0] - 0.00008,
                                car.position[1] + 0.00008
                            ],
                            movedAside: true
                        };
                    }

                    return car;
                })
            );

            // In your useEffect, replace the beep section with this:

            const threshold = getThresholdDistance();

            const signalDistances = signals.map(signal => ({
                id: signal.id,
                distance: getDistanceInMeters(
                    lat, lng,
                    signal.position[0],
                    signal.position[1]
                )
            }));

            let shouldBeep = false;
            signalDistances.forEach(({ distance, id }) => {
                if (distance < threshold && distance > 10) {
                    shouldBeep = true;
                }
            });

            if (shouldBeep && !beepIntervalRef.current) {
                console.log('Starting beep interval');
                console.log('Calling triggerBeep immediately');
                triggerBeep();
                const intervalId = setInterval(() => {
                    console.log('BEEPING NOW - calling triggerBeep');
                    triggerBeep();
                }, 500);
                beepIntervalRef.current = intervalId;
                console.log('Interval created with ID:', intervalId);
            }

            if (!shouldBeep && beepIntervalRef.current) {
                console.log('STOPPING BEEP - clearing interval:', beepIntervalRef.current);
                clearInterval(beepIntervalRef.current);
                beepIntervalRef.current = null;
            }
        }, 100);

        return () => {
            clearInterval(interval);
            if (beepIntervalRef.current) {
                clearInterval(beepIntervalRef.current);
                beepIntervalRef.current = null;
            }
        };
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

    const autoSelectNearestHospital = () => {
        if (beepIntervalRef.current) {
            clearInterval(beepIntervalRef.current);
            beepIntervalRef.current = null;
        }

        setCars([
            { id: 1, position: [9.995211, 76.301557], movedAside: false },
            { id: 2, position: [9.995467, 76.292663], movedAside: false },
            { id: 3, position: [9.992654, 76.289889], movedAside: false },
            { id: 4, position: [9.985862, 76.281859], movedAside: false }
        ]);

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

    const resetLearning = () => {
        localStorage.removeItem("globalModel");
        setEtaBias({
            morning: 0,
            afternoon: 0,
            night: 0
        });
        setEtaLogged(false);
        setArrived(false);
        console.log("Federated learning reset");
    };

    const triggerBeep = () => {
        // Method 1: Web Audio API
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;

            // Resume context if suspended (common in Chrome)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);

            console.log('🔊 Beep attempted - AudioContext state:', audioContext.state);
        } catch (error) {
            console.error('Web Audio API failed:', error);

            // Method 2: Fallback to HTML5 Audio with data URI
            try {
                const beepSound = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCx+zPDTgjMGHm7A7+OZSA0PWqzn7Kx');
                beepSound.play();
                console.log('🔊 HTML5 Audio beep attempted');
            } catch (e) {
                console.error('HTML5 Audio also failed:', e);
            }
        }
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
                <button
                    style={{ background: "#d32f2f", color: "white", fontWeight: "bold" }}
                    onClick={async () => {
                        try {
                            if (!audioContextRef.current) {
                                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                            }

                            // Force resume if suspended
                            if (audioContextRef.current.state === 'suspended') {
                                await audioContextRef.current.resume();
                            }

                            triggerBeep();
                            console.log('Audio context state:', audioContextRef.current.state);
                            alert("Driver alerts enabled! Audio state: " + audioContextRef.current.state);
                        } catch (error) {
                            console.error('Audio init error:', error);
                            alert("Audio initialization failed - check console");
                        }
                    }}
                >
                    ENABLE DRIVER ALERTS
                </button>

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
                <div style={{ fontSize: "12px", marginTop: "5px", color: 'black' }}>
                    Time bucket: {getTimeBucket()}
                </div>

                <button
                    style={{ background: "#1976d2", color: "white", fontWeight: "bold", marginTop: "5px", cursor: "pointer" }}
                    onClick={autoSelectNearestHospital}
                >
                    AUTO SELECT NEAREST
                </button>
                <button
                    style={{ background: "#d32f2f", color: "white", marginTop: "5px" }}
                    onClick={resetLearning}
                >
                    RESET LEARNING
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
                {cars.map(car => (
                    <Marker
                        key={car.id}
                        position={car.position}
                        icon={carIcon}
                    >
                        <Popup>Normal Vehicle</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapView;