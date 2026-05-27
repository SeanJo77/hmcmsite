/* ═══════════════════════════════════════════════════════════
   bCMf FS v0.2.7 — Dashboard App Logic
   Leaflet Map + Markers + Clustering + Interactions
   ═══════════════════════════════════════════════════════════ */

/* ── Mock Data (Simulated API Response) ── */
const MOCK_FEATURES = [
    {
        idx: "S2_1", process_name: "토공", label: "토", plan_type: "명일계획",
        site_detected: "2공구",
        extracted_location: { location1: "본선", station: "STA.2+278" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "본선2구간 천공, 발파암 정리, 암청소, 현장 실수",
        resource_text: {
            equipment_info: { types: ["B/H 1.0", "유압드릴", "살수차"], specs: ["1.0m³", "", "3t"], amounts: ["2", "1", "2"], errors: [] },
            personnel_info: { types: ["작업자", "신호수"], amounts: ["8", "2"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업지휘자"], info: ["박안전 010-1234-5678"], errors: [] } },
        latlng: [36.7950, 126.6180]
    },
    {
        idx: "S2_2", process_name: "토공", label: "토", plan_type: "명일계획",
        site_detected: "2공구",
        extracted_location: { location1: "본선", station: "STA.2+600" },
        rate: { db_val: "S", rate_origin: "[S]" },
        work_content: "절토부 발파 작업 (화약 사용)",
        resource_text: {
            equipment_info: { types: ["B/H 0.8", "덤프트럭", "크레인 50t"], specs: ["0.8m³", "15t", "50t"], amounts: ["1", "3", "1"], errors: [] },
            personnel_info: { types: ["작업자", "신호수", "유도원"], amounts: ["12", "2", "1"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업지휘자", "작업반장"], info: ["김관리 010-2345-6789", "이현장"], errors: [] } },
        latlng: [36.7970, 126.6250]
    },
    {
        idx: "S2_3", process_name: "교량공", label: "교", plan_type: "명일계획",
        site_detected: "2공구",
        extracted_location: { location1: "본선", location2: "사성1교", station_range: "STA.3+100~3+250" },
        rate: { db_val: "A", rate_origin: "[A]" },
        work_content: "사성1교 A1 벽체/날개벽 거푸집 해체 및 면정리",
        resource_text: {
            equipment_info: { types: ["크레인 200t", "펌프카"], specs: ["200t", ""], amounts: ["1", "1"], errors: [] },
            personnel_info: { types: ["목공", "작업자", "외국인"], amounts: ["4", "1", "2"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업반장"], info: ["최교량"], errors: [] } },
        latlng: [36.8010, 126.6350],
        lineCoords: [[36.8010, 126.6340], [36.8015, 126.6345], [36.8020, 126.6350], [36.8025, 126.6355], [36.8030, 126.6360]]
    },
    {
        idx: "S2_4", process_name: "터널공", label: "터", plan_type: "명일계획",
        site_detected: "2공구",
        extracted_location: { location1: "본선", station: "STA.2+338" },
        rate: { db_val: "S", rate_origin: "[S]" },
        work_content: "당진방향 공동구 1차 기계타설 250m³",
        resource_text: {
            equipment_info: { types: ["페이버", "B/H 0.8", "D/T"], specs: ["1", "1", "6"], amounts: ["1", "1", "6"], errors: [] },
            personnel_info: { types: ["작업자", "외국인", "유도원"], amounts: ["3", "3", "1"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업지휘자"], info: ["박장비 010-2345-6789"], errors: [] } },
        latlng: [36.7985, 126.6210]
    },
    {
        idx: "S2_5", process_name: "배수공", label: "배", plan_type: "명일계획",
        site_detected: "2공구",
        extracted_location: { location1: "본선", station: "STA.0+029" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "수로암거 뒷채움 및 다짐",
        resource_text: {
            equipment_info: { types: ["B/H 0.6", "V/R"], specs: ["0.6m³", ""], amounts: ["1", "3"], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["5"], errors: [] }
        },
        admin_text: { admin_info: { positions: [], info: [], errors: [] } },
        latlng: [36.7920, 126.6100]
    },
    {
        idx: "S1_1", process_name: "토공", label: "토", plan_type: "명일계획",
        site_detected: "1공구",
        extracted_location: { location1: "본선", station: "STA.0+800" },
        rate: { db_val: "B", rate_origin: "[B]" },
        work_content: "성토부 다짐 및 정지작업",
        resource_text: {
            equipment_info: { types: ["B/H 1.0", "롤러", "덤프트럭"], specs: ["1.0m³", "10t", "15t"], amounts: ["1", "1", "3"], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["6"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업지휘자"], info: ["홍현장"], errors: [] } },
        latlng: [36.7880, 126.6020]
    },
    {
        idx: "S3_1", process_name: "부대공", label: "부", plan_type: "명일계획",
        site_detected: "3공구",
        extracted_location: { location1: "농도", station: "STA.5+100" },
        rate: { db_val: "A", rate_origin: "[A]" },
        work_content: "농도305호선 A1 용수공급 배관 설치",
        resource_text: {
            equipment_info: { types: ["살수차", "B/H 0.6"], specs: ["3t", "0.6m³"], amounts: ["3", "1"], errors: [] },
            personnel_info: { types: ["작업자", "신호수"], amounts: ["4", "1"], errors: [] }
        },
        admin_text: { admin_info: { positions: [], info: [], errors: [] } },
        latlng: [36.8060, 126.6450]
    },
    {
        idx: "S3_2", process_name: "교량공", label: "교", plan_type: "명일계획",
        site_detected: "3공구",
        extracted_location: { location1: "본선", location2: "대호지교", station: "STA.7+200" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "대호지교 교각 T3 콘크리트 양생",
        resource_text: {
            equipment_info: { types: ["크레인 100t", "펌프카"], specs: ["100t", ""], amounts: ["1", "1"], errors: [] },
            personnel_info: { types: ["작업자", "외국인"], amounts: ["5", "2"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업지휘자"], info: ["전감독"], errors: [] } },
        latlng: [36.8100, 126.6520]
    },
    {
        idx: "S4_1", process_name: "포장공", label: "포", plan_type: "명일계획",
        site_detected: "4공구",
        extracted_location: { location1: "본선", station: "STA.9+500" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "본선구간 기층 포설",
        resource_text: {
            equipment_info: { types: ["피니셔", "롤러", "덤프트럭"], specs: ["", "12t", "15t"], amounts: ["1", "2", "5"], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["8"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업반장"], info: ["강현장"], errors: [] } },
        latlng: [36.8150, 126.6600]
    },
    {
        idx: "S1_2", process_name: "배수공", label: "배", plan_type: "명일계획",
        site_detected: "1공구",
        extracted_location: { location1: "본선", station: "STA.0+600" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "측구 정비 및 배수관 연결",
        resource_text: {
            equipment_info: { types: ["B/H 0.4"], specs: ["0.4m³"], amounts: ["1"], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["4"], errors: [] }
        },
        admin_text: { admin_info: { positions: [], info: [], errors: [] } },
        latlng: [36.7870, 126.6010]
    },
    {
        idx: "S1_3", process_name: "기타", label: "기", plan_type: "명일계획",
        site_detected: "1공구",
        extracted_location: { location1: "본선", station: "STA.1+200" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "현장 사무실 주변 정리 및 안전시설물 점검",
        resource_text: {
            equipment_info: { types: [], specs: [], amounts: [], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["3"], errors: [] }
        },
        admin_text: { admin_info: { positions: [], info: [], errors: [] } },
        latlng: [36.7895, 126.6060]
    },
    {
        idx: "S4_2", process_name: "토공", label: "토", plan_type: "명일계획",
        site_detected: "4공구",
        extracted_location: { location1: "본선", station: "STA.10+100" },
        rate: { db_val: "B", rate_origin: "[B]" },
        work_content: "절토부 뒷다짐 및 성토층 포설",
        resource_text: {
            equipment_info: { types: ["B/H 0.8", "롤러"], specs: ["0.8m³", "10t"], amounts: ["1", "1"], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["5"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업지휘자"], info: ["한감독"], errors: [] } },
        latlng: [36.8160, 126.6620]
    },
    {
        idx: "S4_3", process_name: "부대공", label: "부", plan_type: "명일계획",
        site_detected: "4공구",
        extracted_location: { location1: "본선", station: "STA.10+300" },
        rate: { db_val: "C", rate_origin: "[C]" },
        work_content: "가드레일 설치 및 표지판 보수",
        resource_text: {
            equipment_info: { types: ["카고", "B/H 0.4"], specs: ["5t", "0.4m³"], amounts: ["1", "1"], errors: [] },
            personnel_info: { types: ["작업자"], amounts: ["6"], errors: [] }
        },
        admin_text: { admin_info: { positions: ["작업반장"], info: ["조반장"], errors: [] } },
        latlng: [36.8170, 126.6640]
    }
];

/* ── Work Type Colors ── */
const WORK_COLORS = {
    "토공": "#8D6E63", "토": "#8D6E63",
    "교량공": "#1E88E5", "교": "#1E88E5",
    "부대공": "#4CAF50", "부": "#4CAF50",
    "터널공": "#5D4037", "터": "#5D4037",
    "포장공": "#9E9E9E", "포": "#9E9E9E",
    "배수공": "#00BCD4", "배": "#00BCD4",
    "기타": "#BDBDBD", "기": "#BDBDBD"
};

/* ── Safety Badge Logic ── */
function getSafetyBadge(feature) {
    const types = feature.resource_text?.personnel_info?.types || [];
    const adminPositions = feature.admin_text?.admin_info?.positions || [];
    let badgeHtml = '';

    const hasFlags = types.some(t => t.includes('신호수') || t.includes('유도원')) || adminPositions.some(p => p.includes('신호수'));
    const hasStars = adminPositions.some(p => p.includes('작업지휘자') || p.includes('작업반장'));

    if (hasFlags && hasStars) {
        badgeHtml = `<div class="satellite-badge satellite-badge--shield" title="신호수, 작업지휘자 모두 포함">🛡️</div>`;
    } else if (hasStars) {
        badgeHtml = `<div class="satellite-badge satellite-badge--star" title="작업지휘자">👷</div>`;
    } else if (hasFlags) {
        badgeHtml = `<div class="satellite-badge satellite-badge--flag" title="신호수">🚩</div>`;
    }
    return badgeHtml;
}

/* ── Critical Equipment Check ── */
const CRITICAL_KEYWORDS = ['크레인', '카고', 'C/R', '하이드로', '펌프카', '항타기'];
function hasCriticalEquipment(feature) {
    const types = feature.resource_text?.equipment_info?.types || [];
    return types.some(t => CRITICAL_KEYWORDS.some(kw => t.includes(kw)));
}

/* ── Create Marker HTML ── */
function createMarkerHtml(feature) {
    const rateVal = typeof feature.rate === 'object' ? feature.rate.db_val : feature.rate;
    const color = WORK_COLORS[feature.process_name] || WORK_COLORS[feature.label] || '#666';
    const riskClass = rateVal === 'S' ? 'work-marker--s' : rateVal === 'A' ? 'work-marker--a' : 'work-marker--bc';
    const badgeHtml = getSafetyBadge(feature);

    return `<div class="work-marker ${riskClass}" style="background-color:${color}">
    ${feature.label}
    ${badgeHtml}
  </div>`;
}

/* ── Create Diamond Marker HTML ── */
function createDiamondHtml(equipName) {
    return `<div class="diamond-marker">
    <span class="diamond-marker__label">${equipName.substring(0, 3)}</span>
  </div>`;
}

/* ── Initialize Map ── */
let map, clusterGroup;
const markers = [];
let selectedFeature = null;

function initMap() {
    map = L.map('map', {
        center: [36.8000, 126.6300],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);

    // Smart Clustering (S-03)
    clusterGroup = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        iconCreateFunction: function (cluster) {
            const childMarkers = cluster.getAllChildMarkers();
            const nonDiamondMarkers = childMarkers.filter(m => !m.options.isDiamond);
            const count = nonDiamondMarkers.length; // 핵심장비 마커 제외

            const hasS = childMarkers.some(m => {
                const rate = m.options.featureData?.rate;
                return (typeof rate === 'object' ? rate.db_val : rate) === 'S';
            });
            const hasA = childMarkers.some(m => {
                const rate = m.options.featureData?.rate;
                return (typeof rate === 'object' ? rate.db_val : rate) === 'A';
            });
            const hasDiamond = childMarkers.some(m => m.options.isDiamond);

            let borderColor = '#1F524B';
            let pulseClass = '';
            let prefix = '';

            if (hasS) { borderColor = '#E53935'; pulseClass = 'cluster-pulse'; prefix = '⚠️ '; }
            else if (hasA) { borderColor = '#FFC107'; }
            else if (hasDiamond) { borderColor = '#D05C26'; prefix = '◇ '; }

            // [FB-07] 클러스터 툴팁 추가
            const processes = {};
            let sCount = 0; let aCount = 0; let bcCount = 0;
            nonDiamondMarkers.forEach(m => {
                const f = m.options.featureData;
                if (!f) return;
                const pName = f.process_name || '기타';
                processes[pName] = (processes[pName] || 0) + 1;
                const r = typeof f.rate === 'object' ? f.rate.db_val : f.rate;
                if (r === 'S') sCount++;
                else if (r === 'A') aCount++;
                else bcCount++;
            });

            let ttHtml = '<div style="font-size:12px; line-height:1.4;">';
            ttHtml += '<strong style="color:#d0d0d0;">[공종별]</strong><br>';
            for (const [k, v] of Object.entries(processes)) ttHtml += `${k} ${v}건 / `;
            if (Object.keys(processes).length > 0) ttHtml = ttHtml.slice(0, -2) + '<br>';
            ttHtml += '<strong style="color:#d0d0d0;">[위험등급별]</strong><br>';
            ttHtml += `S: <span style="color:var(--color-s-grade)">${sCount}</span> | A: <span style="color:var(--color-a-grade)">${aCount}</span> | 기타: ${bcCount}`;
            ttHtml += '</div>';

            cluster.bindTooltip(ttHtml, { direction: 'top' });

            return L.divIcon({
                html: `<div class="custom-cluster ${pulseClass}" style="border-color:${borderColor}">${prefix}${count}</div>`,
                className: 'marker-cluster-custom',
                iconSize: L.point(40, 40)
            });
        }
    });

    // Add markers
    MOCK_FEATURES.forEach(feature => {
        const rateVal = typeof feature.rate === 'object' ? feature.rate.db_val : feature.rate;
        const zIndex = rateVal === 'S' ? 1000 : rateVal === 'A' ? 800 : 400;

        // Main work marker
        const icon = L.divIcon({
            html: createMarkerHtml(feature),
            className: '',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });

        const marker = L.marker(feature.latlng, {
            icon: icon,
            zIndexOffset: zIndex,
            featureData: feature
        });

        // [FB-07] 단일 마커 툴팁 추가
        let pAmount = 0; let eAmount = 0;
        if (feature.resource_text?.personnel_info?.amounts) pAmount = feature.resource_text.personnel_info.amounts.reduce((a, b) => a + (parseInt(b) || 0), 0);
        if (feature.resource_text?.equipment_info?.amounts) eAmount = feature.resource_text.equipment_info.amounts.reduce((a, b) => a + (parseInt(b) || 0), 0);

        const rateColor = rateVal === 'S' ? 'var(--color-s-grade)' : rateVal === 'A' ? 'var(--color-a-grade)' : '#999';
        const mHtml = `<div style="font-size:12px; line-height:1.4;">
            <strong style="color:var(--color-main);">${feature.process_name}</strong> 
            (<span style="color:${rateColor}; font-weight:700;">${rateVal}등급</span>)<br>
            ${feature.work_content.substring(0, 25)}${feature.work_content.length > 25 ? '...' : ''}<br>
            <span style="color:#aaa;">인원 ${pAmount}명 / 장비 ${eAmount}대</span>
        </div>`;
        marker.bindTooltip(mHtml, { direction: 'top', offset: [0, -16] });

        marker.on('click', () => showDetail(feature));
        clusterGroup.addLayer(marker);
        markers.push(marker);

        // LineString representation (if range exists)
        if (feature.lineCoords) {
            const lineColor = WORK_COLORS[feature.process_name] || '#666';
            const line = L.polyline(feature.lineCoords, {
                color: lineColor,
                weight: 6,
                opacity: 0.8,
                lineCap: 'round'
            });
            line.on('click', () => showDetail(feature));
            line.addTo(map);
        }

        // Diamond marker for critical equipment
        if (hasCriticalEquipment(feature)) {
            const equipTypes = feature.resource_text.equipment_info.types;
            const criticalEquip = equipTypes.find(t => CRITICAL_KEYWORDS.some(kw => t.includes(kw)));
            if (criticalEquip) {
                const offsetLat = feature.latlng[0] + 0.001;
                const offsetLng = feature.latlng[1] + 0.001;
                const diamondIcon = L.divIcon({
                    html: createDiamondHtml(criticalEquip),
                    className: '',
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });
                const diamondMarker = L.marker([offsetLat, offsetLng], {
                    icon: diamondIcon,
                    zIndexOffset: 600,
                    isDiamond: true,
                    featureData: feature
                });
                diamondMarker.bindTooltip(`◇ ${criticalEquip}`, { direction: 'top', offset: [0, -16] });
                clusterGroup.addLayer(diamondMarker);
            }
        }
    });

    map.addLayer(clusterGroup);

    // Simulated road centerline
    const routeCoords = [
        [36.7850, 126.5950], [36.7880, 126.6020], [36.7920, 126.6100],
        [36.7950, 126.6180], [36.7970, 126.6220], [36.7985, 126.6260],
        [36.8010, 126.6320], [36.8030, 126.6380], [36.8060, 126.6440],
        [36.8100, 126.6520], [36.8130, 126.6560], [36.8150, 126.6600],
        [36.8180, 126.6650]
    ];
    L.polyline(routeCoords, {
        color: '#1F524B',
        weight: 3,
        opacity: 0.5,
        dashArray: '8, 6'
    }).addTo(map);
}

/* ── Show Detail Panel ── */
function showDetail(feature) {
    selectedFeature = feature;
    const rateVal = typeof feature.rate === 'object' ? feature.rate.db_val : feature.rate;
    const color = WORK_COLORS[feature.process_name] || '#666';
    const badge = getSafetyBadge(feature);

    document.getElementById('detail-empty').style.display = 'none';
    document.getElementById('detail-content').style.display = 'block';

    const riskBadge = document.getElementById('detail-risk-badge');
    riskBadge.textContent = rateVal;
    if (rateVal === 'S') {
        riskBadge.style.cssText = 'font-size:10px; padding:2px 6px; background:rgba(229,57,53,0.15); color:#E53935; border:1px solid rgba(229,57,53,0.3); border-radius:4px;';
    } else if (rateVal === 'A') {
        riskBadge.style.cssText = 'font-size:10px; padding:2px 6px; background:rgba(255,193,7,0.15); color:#FFC107; border:1px solid rgba(255,193,7,0.3); border-radius:4px;';
    } else {
        riskBadge.style.cssText = 'font-size:10px; padding:2px 6px; background:rgba(255,255,255,0.08); color:rgba(255,255,255,0.7); border:1px solid rgba(255,255,255,0.2); border-radius:4px;';
    }

    const markerEl = document.getElementById('detail-marker');
    markerEl.textContent = feature.label;
    markerEl.style.backgroundColor = color;
    if (rateVal === 'S') {
        markerEl.style.borderColor = '#E53935';
        markerEl.style.borderWidth = '3px';
        markerEl.style.animation = 'pulse-s 2s infinite';
    } else if (rateVal === 'A') {
        markerEl.style.borderColor = '#FFC107';
        markerEl.style.borderWidth = '2.5px';
        markerEl.style.animation = 'none';
    } else {
        markerEl.style.borderColor = 'rgba(255,255,255,0.15)';
        markerEl.style.borderWidth = '1.5px';
        markerEl.style.animation = 'none';
    }

    document.getElementById('detail-title').textContent = feature.work_content.substring(0, 30);
    document.getElementById('detail-subtitle').textContent = `${feature.site_detected} · ${feature.process_name}`;
    document.getElementById('detail-sta').textContent = feature.extracted_location.station || feature.extracted_location.station_range || '-';
    document.getElementById('detail-location').textContent = [
        feature.extracted_location.location1,
        feature.extracted_location.location2,
        feature.extracted_location.location3
    ].filter(Boolean).join(' > ') || '-';

    // Personnel
    const personnelEl = document.getElementById('detail-personnel');
    let personnelHtml = '';
    const adminPositions = feature.admin_text?.admin_info?.positions || [];
    const adminInfo = feature.admin_text?.admin_info?.info || [];
    adminPositions.forEach((pos, i) => {
        personnelHtml += `<div class="detail-panel__row"><span>${pos}</span><span>${adminInfo[i] || '-'}</span></div>`;
    });
    const pTypes = feature.resource_text?.personnel_info?.types || [];
    const pAmounts = feature.resource_text?.personnel_info?.amounts || [];
    pTypes.forEach((type, i) => {
        personnelHtml += `<div class="detail-panel__row"><span>${type}</span><span>${pAmounts[i] || '-'}명</span></div>`;
    });
    personnelEl.innerHTML = personnelHtml;

    // Equipment
    const equipEl = document.getElementById('detail-equipment');
    let equipHtml = '';
    const eTypes = feature.resource_text?.equipment_info?.types || [];
    const eAmounts = feature.resource_text?.equipment_info?.amounts || [];
    eTypes.forEach((type, i) => {
        equipHtml += `<div class="detail-panel__row"><span>${type}</span><span>${eAmounts[i] || '-'}대</span></div>`;
    });
    equipEl.innerHTML = equipHtml;

    // FS-Loop Status
    const fsloop = document.getElementById('fsloop');
    const status = feature.actionStatus || 'None';
    let fsHtml = '';
    if (status === 'None') {
        fsHtml = `<div class="fsloop__status fsloop__status--none" style="margin-bottom:8px;"><span>지시 없음</span></div>
              <textarea id="fsloop-input" style="width:100%; min-height:60px; padding:8px; border-radius:4px; border:1px solid var(--border-light); background:var(--bg-surface); color:white; font-family:var(--font-sans); font-size:12px; resize:none;" placeholder="조치 지시 내용을 입력하세요..."></textarea>
              <button class="fsloop__btn fsloop__btn--order" style="margin-top:8px; width:100%;" onclick="issueOrder()">🔴 조치 지시 (전송)</button>`;
    } else if (status === 'Pending') {
        fsHtml = `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:4px; margin-bottom:8px; font-size:11px; border-left:3px solid var(--color-s-grade);">
                  <div style="color:var(--text-muted); margin-bottom:4px;">10분 전 · HQ</div>
                  <div style="color:white; line-height:1.4;">${feature.actionMessage || '안전 조치 요망'}</div>
              </div>
              <div class="fsloop__status fsloop__status--pending" style="margin-bottom:8px;"><span>🔴 조치 지시 대기 중</span></div>
              <textarea id="fsloop-reply" style="width:100%; min-height:60px; padding:8px; border-radius:4px; border:1px solid var(--border-light); background:var(--bg-surface); color:white; font-family:var(--font-sans); font-size:12px; resize:none;" placeholder="조치 완료 결과를 보고하세요..."></textarea>
              <button class="fsloop__btn fsloop__btn--complete" style="margin-top:8px; width:100%;" onclick="completeOrder()">✅ 조치 완료 (전송)</button>`;
    } else {
        fsHtml = `<div style="background:rgba(255,255,255,0.05); padding:10px; border-radius:4px; margin-bottom:8px; font-size:11px; border-left:3px solid var(--color-s-grade);">
                  <div style="color:var(--text-muted); margin-bottom:4px;">1시간 전 · HQ</div>
                  <div style="color:white; line-height:1.4;">${feature.actionMessage || '안전 조치 요망'}</div>
              </div>
              <div style="background:rgba(76,175,80,0.05); padding:10px; border-radius:4px; margin-bottom:8px; font-size:11px; border-left:3px solid #4CAF50;">
                  <div style="color:var(--text-muted); margin-bottom:4px;">방금 전 · Field</div>
                  <div style="color:white; line-height:1.4;">${feature.replyMessage || '조치 완료했습니다.'}</div>
              </div>
              <div class="fsloop__status fsloop__status--completed"><span>✅ 조치 완료됨</span></div>`;
    }
    fsloop.innerHTML = fsHtml;
}

function closeDetail() {
    document.getElementById('detail-empty').style.display = 'flex';
    document.getElementById('detail-content').style.display = 'none';
    selectedFeature = null;
}

/* ── FS-Loop Actions ── */
function issueOrder() {
    if (!selectedFeature) return;
    const inputEl = document.getElementById('fsloop-input');
    selectedFeature.actionStatus = 'Pending';
    selectedFeature.actionMessage = inputEl ? inputEl.value : '현장 안전 조치가 필요합니다.';
    showDetail(selectedFeature);
    showToast('🔴 조치 지시가 전달되었습니다');
}

function completeOrder() {
    if (!selectedFeature) return;
    const replyEl = document.getElementById('fsloop-reply');
    selectedFeature.actionStatus = 'Completed';
    selectedFeature.replyMessage = replyEl ? (replyEl.value || '완료했습니다.') : '완료했습니다.';
    showDetail(selectedFeature);
    showToast('✅ 조치 완료 처리되었습니다');
}

/* ── Mode Toggle (S-07) ── */
function initModeToggle() {
    const btnYesterday = document.getElementById('btn-yesterday');
    const btnToday = document.getElementById('btn-today');

    // Set actual dates
    const today = new Date();
    const yest = new Date(today); yest.setDate(yest.getDate() - 1);
    const formatDate = (d) => `(${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')})`;

    document.getElementById('yesterday-date').textContent = formatDate(yest);
    document.getElementById('today-date').textContent = formatDate(today);

    btnYesterday.addEventListener('click', () => {
        btnYesterday.classList.add('mode-toggle__btn--active');
        btnToday.classList.remove('mode-toggle__btn--active');
        document.documentElement.style.setProperty('--color-accent', '#3a6a8a');
        showToast('📋 Yesterday 모드 (실적 복기)');
    });

    btnToday.addEventListener('click', () => {
        btnToday.classList.add('mode-toggle__btn--active');
        btnYesterday.classList.remove('mode-toggle__btn--active');
        document.documentElement.style.setProperty('--color-accent', '#D05C26');
        showToast('🔶 Today 모드 (현장 관제)');
    });
}

/* ── Drawer (S-04) ── */
function initDrawer() {
    const fab = document.getElementById('drawer-fab');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('drawer-close');

    fab.addEventListener('click', () => {
        drawer.classList.add('open');
        overlay.classList.add('active');
    });

    const closeDrawer = () => {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
    };
    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    // Edit buttons → Reassembly modal
    document.querySelectorAll('.drawer__item-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = btn.closest('.drawer__item');
            const title = item.querySelector('.drawer__item-title').textContent;
            openReassemblyModal(item.dataset.id, title);
        });
    });
}

/* ── Reassembly Modal ── */
function openReassemblyModal(id, title) {
    document.getElementById('reassembly-original').textContent = title;
    document.getElementById('reassembly-overlay').classList.add('active');
    document.getElementById('reassembly-modal').classList.add('active');
}

function closeReassemblyModal() {
    document.getElementById('reassembly-overlay').classList.remove('active');
    document.getElementById('reassembly-modal').classList.remove('active');
}

function initReassembly() {
    document.getElementById('reassembly-close').addEventListener('click', closeReassemblyModal);
    document.getElementById('reassembly-cancel').addEventListener('click', closeReassemblyModal);
    document.getElementById('reassembly-overlay').addEventListener('click', closeReassemblyModal);

    document.getElementById('reassembly-save').addEventListener('click', () => {
        const sta = document.getElementById('reassembly-sta').value;
        if (!sta || !sta.includes('STA')) {
            showToast('❌ 유효하지 않은 STA입니다');
            return;
        }
        closeReassemblyModal();
        showToast('✅ 재조립 성공! 마커가 지도 위로 복원됩니다');

        // Simulate fade-in marker restoration
        const count = parseInt(document.getElementById('unmapped-count').textContent);
        if (count > 0) {
            document.getElementById('unmapped-count').textContent = count - 1;
            document.querySelector('.drawer__count').textContent = (count - 1) + '건';
        }
    });
}

/* ── Briefing Board (S-08 / F-12) ── */
function initBriefing() {
    const btn = document.getElementById('btn-briefing');
    const modal = document.getElementById('briefing-modal');
    const overlay = document.getElementById('briefing-overlay');
    const closeBtn = document.getElementById('briefing-close');
    const popout = document.getElementById('briefing-popout');

    btn.addEventListener('click', () => {
        overlay.classList.add('active');
        modal.classList.add('active');
    });

    const closeBriefing = () => {
        overlay.classList.remove('active');
        modal.classList.remove('active');
    };
    closeBtn.addEventListener('click', closeBriefing);
    overlay.addEventListener('click', closeBriefing);

    popout.addEventListener('click', () => {
        showToast('↗️ 새 창으로 열기 (듀얼 모니터 지원)');
    });
}

/* ── Detail Panel Close ── */
function initDetailPanel() {
    document.getElementById('detail-close').addEventListener('click', closeDetail);

    // Report buttons
    document.querySelectorAll('.resource-card__report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            showToast('📑 원본 보고서 뷰어 (F-13) 연결 예정');
        });
    });
}

/* ── Keyword Filter Toggle ── */
function initKeywordFilter() {
    const filterBtn = document.getElementById('btn-equip-filter');
    const filterPanel = document.getElementById('equip-filter-panel');

    if (filterBtn && filterPanel) {
        filterBtn.addEventListener('click', () => {
            const isHidden = filterPanel.style.display === 'none';
            filterPanel.style.display = isHidden ? 'block' : 'none';
        });
    }

    document.querySelectorAll('.keyword-filter__tag').forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('keyword-filter__tag--active');
            const kw = tag.textContent.replace('◇ ', '');
            if (tag.classList.contains('keyword-filter__tag--active')) {
                showToast(`◇ ${kw} 마커 표시`);
            } else {
                showToast(`◇ ${kw} 마커 숨김`);
            }
        });
    });
}

/* ── Progress Modal (FB-06) ── */
function openProgressModal(siteName) {
    const titleEl = document.getElementById('progress-modal-title');
    const modal = document.getElementById('progress-modal');
    const overlay = document.getElementById('progress-overlay');

    if (titleEl) titleEl.textContent = siteName;
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeProgressModal() {
    const modal = document.getElementById('progress-modal');
    const overlay = document.getElementById('progress-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

/* ── Compensation Modal (FB-06) ── */
function openCompensationModal() {
    const modal = document.getElementById('compensation-modal');
    const overlay = document.getElementById('compensation-overlay');
    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
}

function closeCompensationModal() {
    const modal = document.getElementById('compensation-modal');
    const overlay = document.getElementById('compensation-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

/* ── Toast ── */
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 2500);
}

/* ── Action Drawer (FB-09) ── */
function initActionDrawer() {
    const btn = document.getElementById('btn-unresolved-action');
    const drawer = document.getElementById('action-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const closeBtn = document.getElementById('action-drawer-close');

    if (btn) {
        btn.addEventListener('click', () => {
            drawer.classList.add('open');
            overlay.classList.add('active');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

/* ── FB-05: 사이드바 공구 현황 클릭 시 지도 이동 ── */
function moveToSite(siteName) {
    const siteCoords = {
        '1공구': [36.78, 126.60],
        '2공구': [36.79, 126.62],
        '3공구': [36.80, 126.64],
        '4공구': [36.81, 126.66]
    };
    const coord = siteCoords[siteName];
    if (coord && map) {
        map.flyTo(coord, 15, { duration: 1.5 });
        showToast(`📍 ${siteName} 위치로 이동합니다.`);
    }
}

/* ── FB-07, FB-08: 동적 데이터 합산 및 DOM 렌더링 ── */
function updateLegendAndCounts() {
    const siteCounts = { '1공구': 0, '2공구': 0, '3공구': 0, '4공구': 0 };
    const siteSgradeCounts = { '1공구': 0, '2공구': 0, '3공구': 0, '4공구': 0 };
    const processCounts = { '토공': 0, '교량공': 0, '부대공': 0, '터널공': 0, '포장공': 0, '배수공': 0, '기타': 0 };
    let signalmanCount = 0;
    let commanderCount = 0;

    MOCK_FEATURES.forEach(feature => {
        // 1) 공구별 카운트 (전체 및 S등급)
        const site = feature.site_detected;
        if (siteCounts[site] !== undefined) siteCounts[site]++;

        const rVal = typeof feature.rate === 'object' ? feature.rate.db_val : feature.rate;
        if (rVal === 'S' && siteSgradeCounts[site] !== undefined) siteSgradeCounts[site]++;

        // 2) 공종별 카운트
        let pName = feature.process_name === '공종외' ? '기타' : feature.process_name;
        if (processCounts[pName] !== undefined) processCounts[pName]++;

        // 3) 안전인력 카운트
        const pTypes = feature.resource_text?.personnel_info?.types || [];
        const pAmounts = feature.resource_text?.personnel_info?.amounts || [];
        const aPositions = feature.admin_text?.admin_info?.positions || [];

        // 관리/지휘 인력 (작업지휘자, 작업반장)
        if (aPositions.some(p => p.includes('작업지휘자') || p.includes('작업반장'))) {
            commanderCount += 1;
        }

        // 신호수는 보통 personnel_info 에 수량과 함께 명시됨
        const sigIndex = pTypes.findIndex(t => t.includes('신호수') || t.includes('유도원'));
        if (sigIndex > -1 && pAmounts[sigIndex]) {
            signalmanCount += parseInt(pAmounts[sigIndex], 10) || 0;
        } else if (aPositions.includes('신호수')) {
            // amount 배열에 없지만 admin_info 에 찍혀있는 경우 대비 (최소 1)
            signalmanCount += 1;
        }
    });

    // DOM Update: 공구별 건수
    const s1El = document.getElementById('count-s1'); if (s1El) s1El.textContent = `(${siteCounts['1공구']}건) `;
    const s2El = document.getElementById('count-s2'); if (s2El) s2El.textContent = `(${siteCounts['2공구']}건) `;
    const s3El = document.getElementById('count-s3'); if (s3El) s3El.textContent = `(${siteCounts['3공구']}건) `;
    const s4El = document.getElementById('count-s4'); if (s4El) s4El.textContent = `(${siteCounts['4공구']}건) `;

    // DOM Update: 공구별 S등급
    const sg1El = document.getElementById('count-s1-sgrade'); if (sg1El) sg1El.textContent = `${siteSgradeCounts['1공구']}건`;
    const sg2El = document.getElementById('count-s2-sgrade'); if (sg2El) sg2El.textContent = `${siteSgradeCounts['2공구']}건`;
    const sg3El = document.getElementById('count-s3-sgrade'); if (sg3El) sg3El.textContent = `${siteSgradeCounts['3공구']}건`;
    const sg4El = document.getElementById('count-s4-sgrade'); if (sg4El) sg4El.textContent = `${siteSgradeCounts['4공구']}건`;

    // DOM Update: 범례 공종별
    for (const [key, value] of Object.entries(processCounts)) {
        const el = document.getElementById(`legend-count-${key}`);
        if (el) el.textContent = `(${value}건)`;
    }

    // DOM Update: 범례 안전인력
    const sigEl = document.getElementById('legend-count-신호수');
    if (sigEl) sigEl.textContent = `(${signalmanCount}명)`;

    const cmdEl = document.getElementById('legend-count-작업지휘자');
    if (cmdEl) cmdEl.textContent = `(${commanderCount}명)`;
}

/* ── Initialize ── */
document.addEventListener('DOMContentLoaded', () => {
    updateLegendAndCounts();
    initMap();
    initModeToggle();
    initDrawer();
    initActionDrawer();
    initReassembly();
    initBriefing();
    initDetailPanel();
    initKeywordFilter();

    // Add close events for progress modal
    const progClose = document.getElementById('progress-close');
    const progOverlay = document.getElementById('progress-overlay');
    if (progClose) progClose.addEventListener('click', closeProgressModal);
    if (progOverlay) progOverlay.addEventListener('click', closeProgressModal);

    // Add close events for compensation modal
    const compClose = document.getElementById('compensation-close');
    const compOverlay = document.getElementById('compensation-overlay');
    if (compClose) compClose.addEventListener('click', closeCompensationModal);
    if (compOverlay) compOverlay.addEventListener('click', closeCompensationModal);
});
