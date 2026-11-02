document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initChartInteractivity();
    initPartADecorator();
    initPartBComposite();
    initPartCChain();
    initPartDFlyweight();
    initPartEInterpreter();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const stagePanels = document.querySelectorAll('.stage-tab-content, .stage-panel');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetStageId = item.getAttribute('data-stage');
            if (!targetStageId) return;
            e.preventDefault();

            navItems.forEach(n => n.classList.remove('active'));
            stagePanels.forEach(p => p.classList.remove('active'));

            item.classList.add('active');
            const targetPanel = document.getElementById(targetStageId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }

            if (targetStageId === 'stage-flyweight') {
                renderFlyweightCanvas();
            }
        });
    });
}

function initPartADecorator() {
    const meterSelect = document.getElementById('meterSelect');
    const chkEncryption = document.getElementById('layerEncryption');
    const chkAuth = document.getElementById('layerAuth');
    const chkCompression = document.getElementById('layerCompression');
    const btnTransmit = document.getElementById('btnTransmitStream');
    
    const nodeEncryption = document.getElementById('nodeEncryption');
    const nodeAuth = document.getElementById('nodeAuth');
    const nodeCompression = document.getElementById('nodeCompression');

    const updateLayers = () => {
        if (nodeEncryption && chkEncryption) {
            const tile = chkEncryption.closest('.layer-control-tile');
            if (chkEncryption.checked) {
                nodeEncryption.classList.remove('disabled-layer');
                nodeEncryption.classList.add('active-layer');
                if (tile) tile.classList.add('active-tile');
            } else {
                nodeEncryption.classList.add('disabled-layer');
                nodeEncryption.classList.remove('active-layer');
                if (tile) tile.classList.remove('active-tile');
            }
        }

        if (nodeAuth && chkAuth) {
            const tile = chkAuth.closest('.layer-control-tile');
            if (chkAuth.checked) {
                nodeAuth.classList.remove('disabled-layer');
                nodeAuth.classList.add('active-layer');
                if (tile) tile.classList.add('active-tile');
            } else {
                nodeAuth.classList.add('disabled-layer');
                nodeAuth.classList.remove('active-layer');
                if (tile) tile.classList.remove('active-tile');
            }
        }

        if (nodeCompression && chkCompression) {
            const tile = chkCompression.closest('.layer-control-tile');
            if (chkCompression.checked) {
                nodeCompression.classList.remove('disabled-layer');
                nodeCompression.classList.add('active-layer');
                if (tile) tile.classList.add('active-tile');
            } else {
                nodeCompression.classList.add('disabled-layer');
                nodeCompression.classList.remove('active-layer');
                if (tile) tile.classList.remove('active-tile');
            }
        }

        generateTransformedStream();
    };

    [chkEncryption, chkAuth, chkCompression, meterSelect].forEach(el => {
        if (el) el.addEventListener('change', updateLayers);
    });

    if (btnTransmit) {
        btnTransmit.addEventListener('click', () => {
            btnTransmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing & Transmitting...';
            btnTransmit.disabled = true;
            setTimeout(() => {
                updateLayers();
                btnTransmit.innerHTML = '<i class="fas fa-paper-plane"></i> Transmit Secured Stream';
                btnTransmit.disabled = false;
                showNotification('Stream Secured & Dispatched via Decorator Stack!', 'success');
            }, 500);
        });
    }

    updateLayers();
}

function generateTransformedStream() {
    const meterId = document.getElementById('meterSelect')?.value || 'GRID-MTR-9042';
    const enc = document.getElementById('layerEncryption')?.checked;
    const auth = document.getElementById('layerAuth')?.checked;
    const comp = document.getElementById('layerCompression')?.checked;

    const rawPayload = {
        meterId: meterId,
        timestamp: new Date().toISOString(),
        voltage_V: (230.1 + Math.random() * 2).toFixed(1),
        current_A: (14.2 + Math.random()).toFixed(2),
        active_power_kW: (3.26 + Math.random() * 0.2).toFixed(3),
        total_kwh: (12485.4 + Math.random() * 5).toFixed(1)
    };

    const rawJsonStr = JSON.stringify(rawPayload, null, 2);
    const rawPreview = document.getElementById('rawStreamPreview');
    if (rawPreview) rawPreview.textContent = rawJsonStr;

    let processedText = rawJsonStr;
    let layersApplied = ['RawMeterStream'];

    if (enc) {
        processedText = btoa(unescape(encodeURIComponent(processedText)));
        processedText = "CIPHER::AES-256-GCM[" + processedText.substring(0, 110) + "...==" + "]";
        layersApplied.push('EncryptionDecorator');
    }

    if (auth) {
        const hmac = "HMAC-SHA256::9f86d081884c7d659a2feaa0c55ad015...";
        processedText = "HEADER[" + hmac + "]\n" + processedText;
        layersApplied.push('AuthenticationDecorator');
    }

    if (comp) {
        processedText = "GZIP_BUFFER::[0x1F, 0x8B, " + Math.round(processedText.length * 0.42) + " compressed bytes]";
        layersApplied.push('CompressionDecorator');
    }

    const secPreview = document.getElementById('securedPayloadPreview');
    if (secPreview) {
        secPreview.textContent = "// Pipeline: " + layersApplied.join(" -> ") + "\n\n" + processedText;
    }

    const countEl = document.getElementById('appliedLayersCount');
    if (countEl) countEl.textContent = (layersApplied.length - 1) + ' Layer(s)';
    
    const latencyEl = document.getElementById('streamLatency');
    if (latencyEl) latencyEl.textContent = (14 + (layersApplied.length - 1) * 7) + ' ms';
}

const cityHierarchyData = {
    id: "zone-root",
    name: "Metropolis City",
    type: "City (Composite)",
    powerStatus: true,
    children: [
        {
            id: "dist-downtown",
            name: "Downtown Commercial District",
            type: "District (Composite)",
            powerStatus: true,
            children: [
                {
                    id: "street-silicon",
                    name: "Silicon Boulevard",
                    type: "Street (Composite)",
                    powerStatus: true,
                    children: [
                        { id: "bldg-alpha", name: "Tech Tower Alpha", type: "Building (Leaf)", powerStatus: true, kwh: 1850 },
                        { id: "bldg-beta",  name: "Innovation Hub Beta", type: "Building (Leaf)", powerStatus: true, kwh: 1550 }
                    ]
                },
                {
                    id: "street-broadway",
                    name: "Financial Plaza",
                    type: "Street (Composite)",
                    powerStatus: true,
                    children: [
                        { id: "bldg-bank", name: "Metro Central Bank", type: "Building (Leaf)", powerStatus: true, kwh: 2200 }
                    ]
                }
            ]
        },
        {
            id: "dist-green",
            name: "Green Valley Residential District",
            type: "District (Composite)",
            powerStatus: true,
            children: [
                {
                    id: "street-maple",
                    name: "Maple Garden Way",
                    type: "Street (Composite)",
                    powerStatus: true,
                    children: [
                        { id: "bldg-res-a", name: "Solar Heights A", type: "Building (Leaf)", powerStatus: true, kwh: 1400 },
                        { id: "bldg-res-b", name: "Solar Heights B", type: "Building (Leaf)", powerStatus: true, kwh: 1400 }
                    ]
                }
            ]
        }
    ]
};

let selectedZoneNode = cityHierarchyData;

function initPartBComposite() {
    renderZoneTree();

    const btnShutdown = document.getElementById('btnZoneShutdown');
    const btnRestore = document.getElementById('btnZoneRestore');
    const btnReport = document.getElementById('btnZoneReport');

    if (btnShutdown) {
        btnShutdown.addEventListener('click', () => {
            logZoneExecution(`[COMMAND: SHUTDOWN_POWER] -> Target: "${selectedZoneNode.name}" (${selectedZoneNode.type})`);
            recursivePowerCommand(selectedZoneNode, false);
            renderZoneTree();
            showNotification(`Shutdown command executed on ${selectedZoneNode.name}!`, 'danger');
        });
    }

    if (btnRestore) {
        btnRestore.addEventListener('click', () => {
            logZoneExecution(`[COMMAND: RESTORE_POWER] -> Target: "${selectedZoneNode.name}" (${selectedZoneNode.type})`);
            recursivePowerCommand(selectedZoneNode, true);
            renderZoneTree();
            showNotification(`Power restored to ${selectedZoneNode.name}!`, 'success');
        });
    }

    if (btnReport) {
        btnReport.addEventListener('click', () => {
            logZoneExecution(`[COMMAND: REPORT_USAGE] Aggregating usage recursively for "${selectedZoneNode.name}"`);
            const total = recursiveCalculateUsage(selectedZoneNode);
            logZoneExecution(`--> Total aggregated usage = ${total.toLocaleString()} kWh`);
            showNotification(`Total Usage: ${total.toLocaleString()} kWh`, 'info');
        });
    }
}

function renderZoneTree() {
    const container = document.getElementById('zoneTreeContainer');
    if (!container) return;
    container.innerHTML = '';

    function buildNodeHtml(node) {
        const isSelected = selectedZoneNode && selectedZoneNode.id === node.id;
        const isComposite = node.children && node.children.length > 0;
        const icon = isComposite ? 'fa-folder-tree' : 'fa-building';

        const wrapper = document.createElement('div');
        wrapper.className = 'light-tree-item';

        const header = document.createElement('div');
        header.className = `light-tree-header ${isSelected ? 'selected' : ''}`;
        header.onclick = (e) => {
            e.stopPropagation();
            selectedZoneNode = node;
            const badge = document.getElementById('selectedZoneBadge');
            if (badge) badge.textContent = `Target: ${node.name}`;
            renderZoneTree();
        };

        header.innerHTML = `
            <i class="fas ${icon}" style="color: ${isComposite ? 'var(--accent-lime)' : 'var(--text-muted)'}; font-size: 13px;"></i>
            <span style="font-size: 13px; font-weight: 600;">${node.name}</span>
            <span style="font-size: 10px; color: var(--text-dim);">(${isComposite ? 'Composite' : 'Leaf'})</span>
            <span class="history-status-badge ${node.powerStatus ? 'completed' : 'declined'}" style="margin-left: auto;">
                ${node.powerStatus ? 'ONLINE' : 'CUT OFF'}
            </span>
        `;
        wrapper.appendChild(header);

        if (isComposite) {
            const childContainer = document.createElement('div');
            childContainer.className = 'light-tree-children';
            node.children.forEach(c => childContainer.appendChild(buildNodeHtml(c)));
            wrapper.appendChild(childContainer);
        }

        return wrapper;
    }

    container.appendChild(buildNodeHtml(cityHierarchyData));
}

function recursivePowerCommand(node, status) {
    node.powerStatus = status;
    logZoneExecution(`  └─ [${node.name}] -> setPower(${status ? 'ON' : 'OFF'})`);
    if (node.children) {
        node.children.forEach(c => recursivePowerCommand(c, status));
    }
}

function recursiveCalculateUsage(node) {
    let sum = 0;
    if (node.kwh) {
        sum += node.kwh;
        logZoneExecution(`    [Leaf: ${node.name}] -> reportUsage(): ${node.kwh} kWh`);
    } else if (node.children) {
        node.children.forEach(c => {
            sum += recursiveCalculateUsage(c);
        });
        logZoneExecution(`  [Composite: ${node.name}] -> subtotal: ${sum} kWh`);
    }
    return sum;
}

function logZoneExecution(msg) {
    const consoleEl = document.getElementById('zoneExecutionConsole');
    if (!consoleEl) return;
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    consoleEl.appendChild(div);
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

function initPartCChain() {
    const slider = document.getElementById('complaintSeveritySlider');
    const valDisplay = document.getElementById('severityValueDisplay');
    const descDisplay = document.getElementById('severityDescDisplay');
    const btnDispatch = document.getElementById('btnDispatchComplaint');

    const descriptions = {
        1: { label: 'Level 1: Minor', desc: 'Cosmetic damage, pothole. Handled by Local Staff.' },
        2: { label: 'Level 2: Routine', desc: 'Garbage collection delay. Handled by Local Staff.' },
        3: { label: 'Level 3: Moderate', desc: 'Traffic light outage. Handled by Field Supervisor.' },
        4: { label: 'Level 4: High Impact', desc: 'Water main rupture. Handled by Field Supervisor.' },
        5: { label: 'Level 5: Critical', desc: 'Bridge failure, emergency. Escalate to City Manager!' }
    };

    if (slider) {
        slider.addEventListener('input', () => {
            const v = slider.value;
            valDisplay.textContent = descriptions[v].label;
            descDisplay.textContent = descriptions[v].desc;
        });
    }

    if (btnDispatch) {
        btnDispatch.addEventListener('click', () => {
            const citizen = document.getElementById('citizenNameInput')?.value || 'Kasun Perera';
            const category = document.getElementById('complaintCategorySelect')?.value || 'INFRASTRUCTURE';
            const sev = parseInt(slider.value, 10);

            dispatchComplaintThroughChain(citizen, category, sev);
        });
    }

    addComplaintHistoryRow('Nimal Silva', 'INFRASTRUCTURE', 1, 'Local Staff', 'RESOLVED');
    addComplaintHistoryRow('Dilshan Fernando', 'POWER_GRID', 4, 'Field Supervisor', 'RESOLVED');
}

function dispatchComplaintThroughChain(citizen, category, sev) {
    const stnStaff = document.getElementById('stationStaff');
    const stnSupervisor = document.getElementById('stationSupervisor');
    const stnManager = document.getElementById('stationManager');

    [stnStaff, stnSupervisor, stnManager].forEach(s => {
        if (s) s.style.boxShadow = 'none';
    });

    if (stnStaff) stnStaff.style.boxShadow = '0 0 0 2px var(--accent-lime)';

    setTimeout(() => {
        if (sev <= 2) {
            addComplaintHistoryRow(citizen, category, sev, 'Local Staff Handler', 'RESOLVED');
            showNotification(`Severity ${sev} handled locally by Local Staff!`, 'success');
        } else {
            if (stnStaff) stnStaff.style.boxShadow = 'none';
            if (stnSupervisor) stnSupervisor.style.boxShadow = '0 0 0 2px var(--accent-yellow)';
            setTimeout(() => {
                if (sev <= 4) {
                    addComplaintHistoryRow(citizen, category, sev, 'Field Supervisor Handler', 'RESOLVED');
                    showNotification(`Severity ${sev} escalated and resolved by Field Supervisor!`, 'success');
                } else {
                    if (stnSupervisor) stnSupervisor.style.boxShadow = 'none';
                    if (stnManager) stnManager.style.boxShadow = '0 0 0 2px var(--accent-orange)';
                    setTimeout(() => {
                        addComplaintHistoryRow(citizen, category, sev, 'City Manager Handler', 'EXECUTIVE ACTION');
                        showNotification(`Level 5 Emergency handled directly by City Manager!`, 'danger');
                    }, 500);
                }
            }, 500);
        }
    }, 450);
}

function addComplaintHistoryRow(citizen, cat, sev, handler, status) {
    const tbody = document.getElementById('complaintHistoryTableBody');
    if (!tbody) return;
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-card)';
    tr.innerHTML = `
        <td style="padding: 8px; font-family: var(--font-mono); font-size: 11px;">#TKT-${Math.floor(1000 + Math.random()*9000)}</td>
        <td style="padding: 8px; font-weight: 600;">${citizen}</td>
        <td style="padding: 8px;"><span class="history-status-badge pending">${cat}</span></td>
        <td style="padding: 8px; font-weight: 700; color: ${sev >= 4 ? 'var(--accent-orange)' : 'var(--accent-lime)'};">Level ${sev}</td>
        <td style="padding: 8px; font-size: 12px; color: var(--text-body);">${handler}</td>
        <td style="padding: 8px;"><span class="history-status-badge completed">${status}</span></td>
    `;
    tbody.insertBefore(tr, tbody.firstChild);
}

let fleetCount = 50000;
let streetLightNodes = [];
let lightsOn = true;

function initPartDFlyweight() {
    const fleetSelect = document.getElementById('fleetCountSelect');
    const btnSpawn = document.getElementById('btnSpawnFleet');
    const btnToggle = document.getElementById('btnToggleLights');
    const canvas = document.getElementById('fleetCanvas');
    const tooltip = document.getElementById('streetlightTooltip');

    if (fleetSelect) {
        fleetSelect.addEventListener('change', () => {
            fleetCount = parseInt(fleetSelect.value, 10);
            updateMemoryCalc();
            renderFlyweightCanvas();
        });
    }

    if (btnSpawn) {
        btnSpawn.addEventListener('click', () => {
            btnSpawn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Spawning...';
            setTimeout(() => {
                updateMemoryCalc();
                renderFlyweightCanvas();
                btnSpawn.innerHTML = '<i class="fas fa-microchip"></i> Spawn & Profile Fleet';
                showNotification(`Allocated ${fleetCount.toLocaleString()} Streetlights via Flyweight Factory!`, 'success');
            }, 400);
        });
    }

    if (btnToggle) {
        btnToggle.addEventListener('click', () => {
            lightsOn = !lightsOn;
            const badge = document.getElementById('fleetStatusBadge');
            if (badge) {
                badge.textContent = lightsOn ? 'All Lights ON (100% Lumens)' : 'All Lights OFF (Standby)';
                badge.className = `history-status-badge ${lightsOn ? 'completed' : 'declined'}`;
            }
            renderFlyweightCanvas();
            showNotification(`Toggled extrinsic state: Lights turned ${lightsOn ? 'ON' : 'OFF'} across fleet!`, 'info');
        });
    }

    if (canvas && tooltip) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            let closest = null;
            let minDist = 18;

            for (const node of streetLightNodes) {
                const dist = Math.hypot(node.x - mx, node.y - my);
                if (dist < minDist) {
                    minDist = dist;
                    closest = node;
                }
            }

            if (closest) {
                tooltip.style.display = 'block';
                tooltip.style.left = `${closest.x}px`;
                tooltip.style.top = `${closest.y}px`;

                const idEl = document.getElementById('slTipId');
                const roadEl = document.getElementById('slTipRoad');
                const typeEl = document.getElementById('slTipType');

                if (idEl) idEl.textContent = `#SL-${closest.id}`;
                if (roadEl) roadEl.textContent = `Corridor: ${closest.road}`;
                if (typeEl) {
                    typeEl.textContent = `Type: ${closest.typeName} (${closest.wattage}W)`;
                    typeEl.style.color = closest.color;
                }
            } else {
                tooltip.style.display = 'none';
            }
        });

        canvas.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }

    updateMemoryCalc();
    setTimeout(renderFlyweightCanvas, 150);
}

function updateMemoryCalc() {
    const unoptMB = ((fleetCount * 920) / (1024 * 1024)).toFixed(1);
    const flyMB = (((3 * 800) + (fleetCount * 38)) / (1024 * 1024)).toFixed(2);
    const savings = (((fleetCount * 920 - ((3 * 800) + (fleetCount * 38))) / (fleetCount * 920)) * 100).toFixed(1);

    const elUnopt = document.getElementById('ramWithoutFlyweight');
    const elFly = document.getElementById('ramWithFlyweight');
    const elSave = document.getElementById('ramSavingsPercent');

    if (elUnopt) elUnopt.textContent = unoptMB + ' MB';
    if (elFly) elFly.textContent = flyMB + ' MB';
    if (elSave) elSave.textContent = savings + '%';
}

function renderFlyweightCanvas() {
    const canvas = document.getElementById('fleetCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.parentElement.clientWidth || 600;
    const height = canvas.parentElement.clientHeight || 320;
    canvas.width = width;
    canvas.height = height;

    streetLightNodes = [];

    ctx.fillStyle = '#0b1120';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#0f172a';
    const blocks = [
        { x: 12, y: 12, w: width * 0.22, h: height * 0.38, label: "COMMERCIAL ZONE A" },
        { x: width * 0.30, y: 12, w: width * 0.18, h: height * 0.38, label: "CIVIC CENTER" },
        { x: width * 0.56, y: 12, w: width * 0.18, h: height * 0.38, label: "TECH DISTRICT" },
        { x: width * 0.82, y: 12, w: width * 0.16, h: height * 0.38, label: "NORTH PARK" },
        { x: 12, y: height * 0.54, w: width * 0.22, h: height * 0.42, label: "METRO RESIDENTIAL" },
        { x: width * 0.30, y: height * 0.54, w: width * 0.18, h: height * 0.42, label: "DOWNTOWN SOUTH" },
        { x: width * 0.56, y: height * 0.54, w: width * 0.18, h: height * 0.42, label: "INNOVATION HUB" },
        { x: width * 0.82, y: height * 0.54, w: width * 0.16, h: height * 0.42, label: "GREEN VALLEY PARK" }
    ];

    blocks.forEach(b => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.strokeRect(b.x, b.y, b.w, b.h);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.25)';
        ctx.font = '8px Inter, sans-serif';
        ctx.fillText(b.label, b.x + 8, b.y + 16);
    });

    const roads = [

        { x: 0, y: height * 0.44, w: width, h: 26, isHwy: true, name: "METROPOLIS HIGHWAY 101" },

        { x: width * 0.24, y: 0, w: 22, h: height, name: "DOWNTOWN AVE", type: "downtown" },

        { x: width * 0.50, y: 0, w: 22, h: height, name: "SILICON BLVD", type: "downtown" },

        { x: width * 0.76, y: 0, w: 22, h: height, name: "PARKSIDE PKWY", type: "parkway" }
    ];

    roads.forEach(r => {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(r.x, r.y, r.w, r.h);

        ctx.strokeStyle = r.isHwy ? 'rgba(250, 204, 21, 0.45)' : 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        if (r.w > r.h) {
            ctx.moveTo(r.x, r.y + r.h / 2);
            ctx.lineTo(r.x + r.w, r.y + r.h / 2);
        } else {
            ctx.moveTo(r.x + r.w / 2, r.y);
            ctx.lineTo(r.x + r.w / 2, r.y + r.h);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.font = '7.5px "JetBrains Mono", monospace';
        if (r.isHwy) {
            ctx.fillText(r.name, 18, r.y + 16);
        }
    });

    let idCounter = 1001;

    const hwyY = height * 0.44;
    for (let x = 16; x < width - 16; x += 28) {
        streetLightNodes.push({
            id: idCounter++,
            x: x,
            y: hwyY - 4,
            road: "Highway 101 (North Bound)",
            typeName: "LED-150W-WHITE",
            wattage: 150,
            color: '#38bdf8'
        });
        streetLightNodes.push({
            id: idCounter++,
            x: x + 14,
            y: hwyY + 30,
            road: "Highway 101 (South Bound)",
            typeName: "LED-150W-WHITE",
            wattage: 150,
            color: '#38bdf8'
        });
    }

    const dtX = width * 0.24;
    for (let y = 14; y < height - 14; y += 26) {
        if (Math.abs(y - hwyY) < 30) continue; // skip intersection center
        streetLightNodes.push({
            id: idCounter++,
            x: dtX - 4,
            y: y,
            road: "Downtown Avenue",
            typeName: "LED-90W-WARM",
            wattage: 90,
            color: '#facc15'
        });
        streetLightNodes.push({
            id: idCounter++,
            x: dtX + 26,
            y: y,
            road: "Downtown Avenue",
            typeName: "LED-90W-WARM",
            wattage: 90,
            color: '#facc15'
        });
    }

    const silX = width * 0.50;
    for (let y = 14; y < height - 14; y += 26) {
        if (Math.abs(y - hwyY) < 30) continue;
        streetLightNodes.push({
            id: idCounter++,
            x: silX - 4,
            y: y,
            road: "Silicon Boulevard",
            typeName: "LED-90W-WARM",
            wattage: 90,
            color: '#facc15'
        });
        streetLightNodes.push({
            id: idCounter++,
            x: silX + 26,
            y: y,
            road: "Silicon Boulevard",
            typeName: "LED-90W-WARM",
            wattage: 90,
            color: '#facc15'
        });
    }

    const parkX = width * 0.76;
    for (let y = 14; y < height - 14; y += 28) {
        if (Math.abs(y - hwyY) < 30) continue;
        streetLightNodes.push({
            id: idCounter++,
            x: parkX - 4,
            y: y,
            road: "Parkside Parkway",
            typeName: "SOLAR-60W-ECO",
            wattage: 60,
            color: '#84cc16'
        });
        streetLightNodes.push({
            id: idCounter++,
            x: parkX + 26,
            y: y,
            road: "Parkside Parkway",
            typeName: "SOLAR-60W-ECO",
            wattage: 60,
            color: '#84cc16'
        });
    }

    streetLightNodes.forEach(node => {
        if (lightsOn) {

            ctx.shadowBlur = 8;
            ctx.shadowColor = node.color;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 3.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
        } else {

            ctx.shadowBlur = 0;
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    ctx.shadowBlur = 0;
}

function initPartEInterpreter() {
    const preset = document.getElementById('dslRulePreset');
    const input = document.getElementById('dslRuleInput');
    const btn = document.getElementById('btnEvaluateDSL');

    const rules = {
        noise: 'IF (ZONE == "RESIDENTIAL" AND NOISE_LEVEL > 65) THEN VIOLATION',
        parking: 'IF (TIME >= "22:00" AND PARKING_STATUS == "OCCUPIED") THEN FINE',
        environmental: 'IF (AIR_QUALITY_INDEX > 150 OR TEMPERATURE > 40) THEN ALERT_HEALTH'
    };

    if (preset && input) {
        preset.addEventListener('change', () => {
            if (rules[preset.value]) input.value = rules[preset.value];
        });
    }

    if (btn) {
        btn.addEventListener('click', () => {
            const rule = input?.value || '';
            const zone = document.getElementById('ctxZoneSelect')?.value || 'RESIDENTIAL';
            const noise = parseFloat(document.getElementById('ctxNoiseInput')?.value || 74);

            const isViolation = (zone === 'RESIDENTIAL' && noise > 65);
            const astEl = document.getElementById('astTreeVisualizer');
            const badge = document.getElementById('dslVerdictBadge');
            const detail = document.getElementById('dslVerdictDetail');

            if (astEl) {
                astEl.innerHTML = `
                    <div style="font-weight: 700; color: #4338ca;">[NonTerminalExpression: AND]</div>
                    <div style="margin-left: 18px; border-left: 2px dashed #cbd5e1; padding-left: 10px; margin-top: 4px;">
                        <div>[Terminal: EqualityExpression] (ZONE == "RESIDENTIAL") ➔ <strong style="color: #16a34a;">${zone === 'RESIDENTIAL'}</strong></div>
                        <div style="margin-top: 4px;">[Terminal: GreaterThanExpression] (NOISE_LEVEL > 65) ➔ <strong style="color: ${noise > 65 ? '#dc2626' : '#16a34a'};">${noise > 65}</strong> (${noise} dB)</div>
                    </div>
                `;
            }

            if (badge) {
                if (isViolation) {
                    badge.className = 'btn-clean-danger';
                    badge.textContent = 'POLICY VIOLATION TRIGGERED';
                } else {
                    badge.className = 'btn-clean-success';
                    badge.textContent = 'POLICY COMPLIANT (PASS)';
                }
            }

            if (detail) {
                detail.textContent = isViolation 
                    ? `Noise level of ${noise} dB in ${zone} exceeds 65 dB municipal threshold.`
                    : `Current sensor readings are compliant with city policy.`;
            }
        });
    }
}

function showNotification(msg, type = 'info') {
    const existing = document.querySelector('.clean-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `clean-toast`;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 28px;
        background: #ffffff;
        color: #0f172a;
        padding: 12px 18px;
        border-radius: 12px;
        border: 1px solid ${type === 'danger' ? '#fca5a5' : (type === 'success' ? '#86efac' : '#e2e8f0')};
        box-shadow: 0 10px 25px rgba(0,0,0,0.08);
        z-index: 9999;
        font-size: 13px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    const icon = type === 'danger' ? 'fa-triangle-exclamation' : (type === 'success' ? 'fa-circle-check' : 'fa-circle-info');
    const color = type === 'danger' ? '#dc2626' : (type === 'success' ? '#16a34a' : '#0284c7');
    toast.innerHTML = `<i class="fas ${icon}" style="color: ${color};"></i> <span>${msg}</span>`;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3200);
}

function initChartInteractivity() {
    const container = document.getElementById('energyChartContainer');
    const tooltip = document.getElementById('chartTooltip');
    const arrow = document.getElementById('tooltipArrow');
    if (!container || !tooltip) return;

    const columns = container.querySelectorAll('.bar-day-column');
    const dateEl = document.getElementById('tooltipDate');
    const resEl = document.getElementById('tooltipResidential');
    const commEl = document.getElementById('tooltipCommercial');
    const indEl = document.getElementById('tooltipIndustrial');
    const indRow = document.getElementById('tooltipIndustrialRow');
    const totalEl = document.getElementById('tooltipTotal');

    function updateTooltip(col) {
        if (!col) return;
        const colRect = col.getBoundingClientRect();
        const contRect = container.getBoundingClientRect();

        const colCenter = (colRect.left - contRect.left) + (colRect.width / 2);

        const tipWidth = tooltip.offsetWidth || 185;
        const halfWidth = tipWidth / 2;
        const contWidth = contRect.width;

        const minLeft = halfWidth + 12;
        const maxLeft = contWidth - halfWidth - 12;
        const clampedLeft = Math.max(minLeft, Math.min(maxLeft, colCenter));
        
        tooltip.style.left = `${clampedLeft}px`;

        if (arrow) {
            const arrowOffset = colCenter - clampedLeft;
            arrow.style.left = `calc(50% + ${arrowOffset}px)`;
        }

        if (dateEl) dateEl.textContent = col.getAttribute('data-date') || '';
        if (resEl) resEl.textContent = col.getAttribute('data-res') || '0 kWh';
        if (commEl) commEl.textContent = col.getAttribute('data-comm') || '0 kWh';

        const indVal = col.getAttribute('data-ind');
        if (indRow && indEl) {
            if (indVal && indVal !== '0 kWh') {
                indRow.style.display = 'flex';
                indEl.textContent = indVal;
            } else {
                indRow.style.display = 'none';
            }
        }

        if (totalEl) totalEl.textContent = col.getAttribute('data-total') || '';
        tooltip.style.opacity = '1';

        columns.forEach(c => {
            c.classList.remove('active');
            const track = c.querySelector('.bar-track');
            if (track) track.classList.remove('active-day');
        });

        col.classList.add('active');
        const activeTrack = col.querySelector('.bar-track');
        if (activeTrack) activeTrack.classList.add('active-day');
    }

    columns.forEach(col => {
        col.addEventListener('mouseenter', () => updateTooltip(col));
        col.addEventListener('click', () => updateTooltip(col));
    });

    const defaultCol = container.querySelector('.bar-day-column[data-day="Wed"]') || columns[3];
    if (defaultCol) {
        setTimeout(() => updateTooltip(defaultCol), 150);
    }

    container.addEventListener('mouseleave', () => {
        if (defaultCol) {
            updateTooltip(defaultCol);
        }
    });

    window.addEventListener('resize', () => {
        const activeCol = container.querySelector('.bar-day-column.active') || defaultCol;
        if (activeCol) updateTooltip(activeCol);
    });
}
