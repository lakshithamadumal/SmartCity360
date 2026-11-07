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

    const stageToRoute = {
        'stage-overview': 'dashboard',
        'stage-decorator': 'energy-security',
        'stage-composite': 'smart-zones',
        'stage-chain': 'complaints',
        'stage-flyweight': 'streetlights',
        'stage-interpreter': 'policy-rules'
    };

    const routeToStage = {
        'dashboard': 'stage-overview',
        'overview': 'stage-overview',
        'energy-security': 'stage-decorator',
        'decorator': 'stage-decorator',
        'smart-zones': 'stage-composite',
        'composite': 'stage-composite',
        'complaints': 'stage-chain',
        'chain': 'stage-chain',
        'streetlights': 'stage-flyweight',
        'flyweight': 'stage-flyweight',
        'policy-rules': 'stage-interpreter',
        'interpreter': 'stage-interpreter'
    };

    function activateStage(stageId, updateUrl = true) {
        if (!stageId) return;

        navItems.forEach(n => {
            if (n.getAttribute('data-stage') === stageId) {
                n.classList.add('active');
            } else {
                n.classList.remove('active');
            }
        });

        stagePanels.forEach(p => {
            if (p.id === stageId) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        if (updateUrl) {
            const route = stageToRoute[stageId] || 'dashboard';
            if (window.location.hash !== '#' + route) {
                history.pushState(null, '', '#' + route);
            }
        }

        if (stageId === 'stage-flyweight') {
            setTimeout(renderFlyweightCanvas, 60);
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetStageId = item.getAttribute('data-stage');
            if (!targetStageId) return;
            e.preventDefault();
            activateStage(targetStageId, true);
        });
    });

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.replace('#', '').toLowerCase().trim();
        const targetStage = routeToStage[hash] || 'stage-overview';
        activateStage(targetStage, false);
    });

    const initialHash = window.location.hash.replace('#', '').toLowerCase().trim();
    if (initialHash && routeToStage[initialHash]) {
        activateStage(routeToStage[initialHash], false);
    } else {
        activateStage('stage-overview', true);
    }
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
            btnTransmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Securing via Backend Decorator Stack...';
            btnTransmit.disabled = true;

            const meterId = meterSelect?.value || 'GRID-MTR-9042';
            const enc = chkEncryption?.checked ?? false;
            const auth = chkAuth?.checked ?? false;
            const comp = chkCompression?.checked ?? false;

            const rawData = {
                meterId: meterId,
                timestamp: new Date().toISOString(),
                voltage_V: 231.1,
                current_A: 15.06,
                active_power_kW: 3.283,
                total_kwh: 12488.4
            };

            fetch('/api/stream/secure', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    meterId: meterId,
                    rawPayload: JSON.stringify(rawData, null, 2),
                    encrypt: enc,
                    authenticate: auth,
                    compress: comp
                })
            })
            .then(res => res.json())
            .then(data => {
                const rawPreview = document.getElementById('rawStreamPreview');
                const secPreview = document.getElementById('securedStreamPreview');
                const layerCountBadge = document.getElementById('decoratorLayersCount');

                if (rawPreview) rawPreview.textContent = data.rawPayload || JSON.stringify(rawData, null, 2);
                if (secPreview) secPreview.textContent = "// Pipeline: " + data.pipeline + "\n\n" + data.securedPayload;
                if (layerCountBadge) layerCountBadge.textContent = `${data.activeLayers} Layer(s)`;

                showNotification('Stream Secured via Pure Java GoF Decorator Pipeline!', 'success');
                recordDashboardActivity('Stream Telemetry #' + meterId, 'Secured via ' + (data.activeLayers || 1) + ' Decorator Layers', 'Active', 'Secured', 'completed', 'fas fa-shield-halved', '#ecfccb', '#4d7c0f');
            })
            .catch(() => {
                updateLayers();
                showNotification('Stream Secured via Local Simulation Fallback!', 'info');
            })
            .finally(() => {
                btnTransmit.innerHTML = '<i class="fas fa-paper-plane"></i> Transmit Secured Stream';
                btnTransmit.disabled = false;
            });
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
        current_A: (14.8 + Math.random() * 0.5).toFixed(2),
        active_power_kW: (3.2 + Math.random() * 0.2).toFixed(3),
        total_kwh: (12480 + Math.random() * 10).toFixed(1)
    };

    const rawString = JSON.stringify(rawPayload, null, 2);
    const rawPreview = document.getElementById('rawStreamPreview');
    const secPreview = document.getElementById('securedStreamPreview');
    const layerCountBadge = document.getElementById('decoratorLayersCount');

    if (rawPreview) rawPreview.textContent = rawString;

    let processedText = rawString;
    const layersApplied = ['RawMeterStream'];

    if (enc) {
        layersApplied.push('EncryptionDecorator');
        try {
            processedText = 'CIPHER::AES-256-GCM[' + btoa(unescape(encodeURIComponent(processedText))).substring(0, 48) + '...==]';
        } catch(e) {
            processedText = 'CIPHER::AES-256-GCM[ZW5jcnlwdGVkX3BheWxvYWRfZGF0YQ==]';
        }
    }
    if (auth) {
        layersApplied.push('AuthenticationDecorator');
        const pseudoHmac = Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('');
        processedText = `HEADER[HMAC-SHA256::${pseudoHmac}]::PAYLOAD[${processedText}]`;
    }
    if (comp) {
        layersApplied.push('CompressionDecorator');
        const compressedLen = Math.floor(processedText.length * 0.42);
        processedText = `GZIP_BUFFER::[0x1F, 0x8B, ${compressedLen} compressed bytes]`;
    }

    const count = (enc ? 1 : 0) + (auth ? 1 : 0) + (comp ? 1 : 0);
    if (layerCountBadge) layerCountBadge.textContent = `${count} Layer(s)`;
    if (secPreview) {
        secPreview.textContent = "// Pipeline: " + layersApplied.join(" -> ") + "\n\n" + processedText;
    }
}

let selectedZoneNode = null;
let currentZoneTreeData = null;

function initPartBComposite() {
    const btnShutdown = document.getElementById('btnPowerShutdown');
    const btnRestore = document.getElementById('btnPowerRestore');
    const btnUsage = document.getElementById('btnReportUsage');

    function loadBackendZoneTree() {
        fetch('/api/zones/tree')
            .then(res => res.json())
            .then(tree => {
                currentZoneTreeData = tree;
                if (!selectedZoneNode) selectedZoneNode = tree;
                renderZoneTreeFromData(tree);
            })
            .catch(() => {
                currentZoneTreeData = getFallbackCityHierarchy();
                if (!selectedZoneNode) selectedZoneNode = currentZoneTreeData;
                renderZoneTreeFromData(currentZoneTreeData);
            });
    }

    function dispatchZoneCommand(cmd) {
        if (!selectedZoneNode) return;
        const targetId = selectedZoneNode.id || 'CITY-METRO';

        fetch('/api/zones/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetId: targetId, command: cmd })
        })
        .then(res => res.json())
        .then(data => {
            logZoneExecution(data.log);
            if (data.tree) {
                currentZoneTreeData = data.tree;
                updateSelectedNodeReference(currentZoneTreeData, targetId);
                renderZoneTreeFromData(currentZoneTreeData);
            }
            showNotification(`Composite Command ${cmd} Executed on ${selectedZoneNode.name}!`, 'success');
            recordDashboardActivity(selectedZoneNode.name + ' Command', 'Executed ' + cmd + ' across hierarchy', cmd === 'SHUTDOWN' ? 'Power Cut' : 'Restored', cmd === 'SHUTDOWN' ? 'Sub-grid' : 'Active', cmd === 'SHUTDOWN' ? 'declined' : 'completed', 'fas fa-power-off', '#fee2e2', '#b91c1c');
        })
        .catch(() => {
            if (cmd === 'SHUTDOWN') recursivePowerCommand(selectedZoneNode, false);
            if (cmd === 'RESTORE') recursivePowerCommand(selectedZoneNode, true);
            if (cmd === 'REPORT_USAGE') {
                const total = recursiveCalculateUsage(selectedZoneNode);
                logZoneExecution(`[LOCAL] Total usage for ${selectedZoneNode.name}: ${total.toFixed(1)} kWh`);
            }
            renderZoneTreeFromData(currentZoneTreeData);
            showNotification(`Executed ${cmd} on ${selectedZoneNode.name}`, 'info');
        });
    }

    if (btnShutdown) btnShutdown.addEventListener('click', () => dispatchZoneCommand('SHUTDOWN'));
    if (btnRestore) btnRestore.addEventListener('click', () => dispatchZoneCommand('RESTORE'));
    if (btnUsage) btnUsage.addEventListener('click', () => dispatchZoneCommand('REPORT_USAGE'));

    loadBackendZoneTree();
}

function updateSelectedNodeReference(root, targetId) {
    if (!root) return;
    if (root.id === targetId) {
        selectedZoneNode = root;
        return;
    }
    if (root.children) {
        for (const child of root.children) {
            updateSelectedNodeReference(child, targetId);
        }
    }
}

function renderZoneTreeFromData(rootNode) {
    const container = document.getElementById('zoneTreeHierarchy');
    if (!container || !rootNode) return;
    container.innerHTML = '';

    function buildNodeHtml(node) {
        const isComposite = node.children && node.children.length > 0;
        const isSelected = selectedZoneNode && selectedZoneNode.id === node.id;
        const icon = isComposite ? (node.type && node.type.includes('District') ? 'fa-building-shield' : 'fa-network-wired') : 'fa-building';

        const wrapper = document.createElement('div');
        wrapper.className = 'light-tree-item';

        const header = document.createElement('div');
        header.className = `light-tree-header ${isSelected ? 'selected' : ''}`;
        header.onclick = (e) => {
            e.stopPropagation();
            selectedZoneNode = node;
            const badge = document.getElementById('selectedZoneBadge');
            if (badge) badge.textContent = `Target: ${node.name}`;
            renderZoneTreeFromData(currentZoneTreeData);
        };

        const usage = node.currentUsageKWh !== undefined ? `${node.currentUsageKWh.toFixed(1)} kWh` : '';

        header.innerHTML = `
            <i class="fas ${icon}" style="color: ${isComposite ? 'var(--accent-lime)' : 'var(--text-muted)'}; font-size: 13px;"></i>
            <span style="font-size: 13px; font-weight: 600;">${node.name}</span>
            <span style="font-size: 10px; color: var(--text-dim);">${node.type || (isComposite ? 'Composite' : 'Leaf')}</span>
            ${usage ? `<span style="font-size: 11px; font-weight: 700; color: #0284c7; margin-left: 8px;">${usage}</span>` : ''}
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

    container.appendChild(buildNodeHtml(rootNode));
}

function logZoneExecution(msg) {
    const consoleEl = document.getElementById('zoneExecutionConsole');
    if (!consoleEl) return;
    const div = document.createElement('div');
    div.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    consoleEl.appendChild(div);
    consoleEl.scrollTop = consoleEl.scrollHeight;
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
    if (node.currentUsageKWh !== undefined) {
        sum += node.powerStatus ? node.currentUsageKWh : 0;
    } else if (node.kwh) {
        sum += node.powerStatus ? node.kwh : 0;
    }
    if (node.children) {
        node.children.forEach(c => {
            sum += recursiveCalculateUsage(c);
        });
    }
    return sum;
}

function getFallbackCityHierarchy() {
    return {
        id: "CITY-METRO",
        name: "Metropolis City",
        type: "City (Composite)",
        powerStatus: true,
        children: [
            {
                id: "DIST-COMM",
                name: "Downtown Commercial District",
                type: "District (Composite)",
                powerStatus: true,
                children: [
                    {
                        id: "STR-SILICON",
                        name: "Silicon Boulevard",
                        type: "Street (Composite)",
                        powerStatus: true,
                        children: [
                            { id: "BLD-TECH", name: "Tech Tower Alpha", type: "Building (Leaf)", powerStatus: true, kwh: 1540.5 },
                            { id: "BLD-INNOV", name: "Innovation Hub Beta", type: "Building (Leaf)", powerStatus: true, kwh: 980.2 }
                        ]
                    },
                    {
                        id: "STR-FIN",
                        name: "Financial Plaza",
                        type: "Street (Composite)",
                        powerStatus: true,
                        children: [
                            { id: "BLD-BANK", name: "Metro Central Bank", type: "Building (Leaf)", powerStatus: true, kwh: 2100.0 }
                        ]
                    }
                ]
            },
            {
                id: "DIST-RES",
                name: "Green Valley Residential District",
                type: "District (Composite)",
                powerStatus: true,
                children: [
                    {
                        id: "STR-MAPLE",
                        name: "Maple Garden Way",
                        type: "Street (Composite)",
                        powerStatus: true,
                        children: [
                            { id: "BLD-SOLAR-A", name: "Solar Heights A", type: "Building (Leaf)", powerStatus: true, kwh: 320.0 },
                            { id: "BLD-SOLAR-B", name: "Solar Heights B", type: "Building (Leaf)", powerStatus: true, kwh: 280.0 }
                        ]
                    }
                ]
            }
        ]
    };
}

function initPartCChain() {
    const slider = document.getElementById('complaintSeveritySlider');
    const valDisplay = document.getElementById('severityValueDisplay');
    const descDisplay = document.getElementById('severityDescDisplay');
    const btnDispatch = document.getElementById('btnDispatchComplaint');

    const descriptions = {
        1: { label: 'Level 1: Minor', desc: 'Routine civic maintenance (Potholes, flickering lights). Handled by Local Staff.' },
        2: { label: 'Level 2: Routine', desc: 'Garbage collection delay, littering. Handled by Local Staff.' },
        3: { label: 'Level 3: Moderate', desc: 'Traffic grid failure, water main rupture. Handled by Field Supervisor.' },
        4: { label: 'Level 4: High Impact', desc: 'Electrical substation trip, road closure. Handled by Field Supervisor.' },
        5: { label: 'Level 5: Critical', desc: 'Bridge structural failure, disaster alert. Escalate to City Manager!' }
    };

    if (slider) {
        slider.addEventListener('input', () => {
            const v = slider.value;
            valDisplay.textContent = descriptions[v].label;
            descDisplay.textContent = descriptions[v].desc;
        });
    }

    function loadAuditHistory() {
        fetch('/api/complaints/audit')
            .then(res => res.json())
            .then(list => {
                const tbody = document.getElementById('complaintHistoryTableBody');
                if (!tbody) return;
                tbody.innerHTML = '';
                const dashTicket = document.getElementById('dashTicketCount');
                if (dashTicket) dashTicket.textContent = (list ? list.length : 0) + ' Dispatched Tickets';
                if (list && list.length > 0) {
                    list.forEach(c => addComplaintHistoryRow(c.ticketId, c.citizenName, c.category, c.severity, c.handledBy, c.resolved ? 'RESOLVED' : 'PENDING'));
                } else {
                    renderEmptyComplaintRow();
                }
            })
            .catch(() => {
                renderEmptyComplaintRow();
            });
    }

    function renderEmptyComplaintRow() {
        const tbody = document.getElementById('complaintHistoryTableBody');
        if (!tbody) return;
        tbody.innerHTML = `
            <tr id="emptyComplaintRow">
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 28px 12px; font-size: 12px;">
                    <i class="fas fa-inbox" style="font-size: 20px; color: #cbd5e1; display: block; margin-bottom: 6px;"></i>
                    No complaints dispatched yet. Submit a resident grievance above to route dynamically through the Chain of Responsibility.
                </td>
            </tr>
        `;
    }

    if (btnDispatch) {
        btnDispatch.addEventListener('click', () => {
            const citizen = document.getElementById('citizenNameInput')?.value || 'Kasun Perera';
            const category = document.getElementById('complaintCategorySelect')?.value || 'Civil Infrastructure';
            const sev = parseInt(slider.value, 10);

            btnDispatch.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Escalating through Chain...';
            btnDispatch.disabled = true;

            fetch('/api/complaints/dispatch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    citizenName: citizen,
                    category: category,
                    description: `Citizen grievance reported under category ${category}`,
                    severity: sev
                })
            })
            .then(res => res.json())
            .then(data => {
                const emptyRow = document.getElementById('emptyComplaintRow');
                if (emptyRow) emptyRow.remove();

                addComplaintHistoryRow(data.ticketId, data.citizenName, data.category, data.severity, data.handledBy, data.resolved ? 'RESOLVED' : 'PENDING');
                showNotification(`Ticket ${data.ticketId} escalated & resolved by ${data.handledBy}!`, 'success');
                const dashTicket = document.getElementById('dashTicketCount');
                if (dashTicket) {
                    const cur = parseInt(dashTicket.textContent, 10) || 0;
                    dashTicket.textContent = (cur + 1) + ' Dispatched Tickets';
                }
                recordDashboardActivity('Ticket #' + data.ticketId, 'Escalated to ' + data.handledBy, 'Tier ' + data.severity, 'Resolved', 'completed', 'fas fa-route', '#ffedd5', '#c2410c');
            })
            .catch(() => {
                const emptyRow = document.getElementById('emptyComplaintRow');
                if (emptyRow) emptyRow.remove();

                const handlers = {
                    1: 'Local Staff',
                    2: 'Local Staff',
                    3: 'Field Supervisor',
                    4: 'Field Supervisor',
                    5: 'City Manager'
                };
                const pseudoId = 'TKT-' + Math.floor(1000 + Math.random() * 9000);
                addComplaintHistoryRow(pseudoId, citizen, category, sev, handlers[sev] || 'City Manager', 'RESOLVED');
                showNotification(`Ticket resolved by ${handlers[sev]}!`, 'success');
            })
            .finally(() => {
                btnDispatch.innerHTML = '<i class="fas fa-paper-plane"></i> Dispatch to Escalation Chain';
                btnDispatch.disabled = false;
            });
        });
    }

    loadAuditHistory();
}

function addComplaintHistoryRow(id, citizen, category, sev, handler, status) {
    const tbody = document.getElementById('complaintHistoryTableBody');
    if (!tbody) return;

    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid var(--border-subtle)';

    const sevColors = {
        1: '#16a34a',
        2: '#65a30d',
        3: '#ea580c',
        4: '#dc2626',
        5: '#b91c1c'
    };

    row.innerHTML = `
        <td style="padding: 10px 8px; font-weight: 700; font-family: var(--font-mono); color: var(--text-main);">${id}</td>
        <td style="padding: 10px 8px; font-weight: 600;">${citizen}</td>
        <td style="padding: 10px 8px;"><span style="font-size: 10.5px; font-weight: 700; color: #475569; background: #f1f5f9; padding: 2px 7px; border-radius: 4px;">${category}</span></td>
        <td style="padding: 10px 8px; font-weight: 700; color: ${sevColors[sev] || '#16a34a'};">Level ${sev}</td>
        <td style="padding: 10px 8px; font-weight: 600; color: var(--text-main);">${handler}</td>
        <td style="padding: 10px 8px;"><span class="history-status-badge completed">${status}</span></td>
    `;

    tbody.insertBefore(row, tbody.firstChild);
}

let fleetCount = 50000;
let lightsOn = true;
let streetLightNodes = [];
let mapStyleMode = 'map';
let mapZoom = 1.0;
let mapPanX = 0;
let mapPanY = 0;
let isDraggingMap = false;
let dragStartX = 0;
let dragStartY = 0;

function initPartDFlyweight() {
    const fleetSelect = document.getElementById('fleetCountSelect');
    const btnSpawn = document.getElementById('btnSpawnFleet');
    const btnToggle = document.getElementById('btnToggleLights');
    const canvas = document.getElementById('fleetCanvas');
    const tooltip = document.getElementById('streetlightTooltip');

    const btnVector = document.getElementById('btnMapStyleVector');
    const btnSatellite = document.getElementById('btnMapStyleSatellite');
    const btnZoomIn = document.getElementById('btnMapZoomIn');
    const btnZoomOut = document.getElementById('btnMapZoomOut');
    const btnRecenter = document.getElementById('btnMapRecenter');

    if (btnVector && btnSatellite) {
        btnVector.addEventListener('click', () => {
            mapStyleMode = 'map';
            btnVector.classList.add('active');
            btnSatellite.classList.remove('active');
            renderFlyweightCanvas();
        });
        btnSatellite.addEventListener('click', () => {
            mapStyleMode = 'satellite';
            btnSatellite.classList.add('active');
            btnVector.classList.remove('active');
            renderFlyweightCanvas();
        });
    }

    if (btnZoomIn) {
        btnZoomIn.addEventListener('click', () => {
            mapZoom = Math.min(2.5, +(mapZoom + 0.2).toFixed(2));
            renderFlyweightCanvas();
        });
    }

    if (btnZoomOut) {
        btnZoomOut.addEventListener('click', () => {
            mapZoom = Math.max(0.7, +(mapZoom - 0.2).toFixed(2));
            renderFlyweightCanvas();
        });
    }

    if (btnRecenter) {
        btnRecenter.addEventListener('click', () => {
            mapZoom = 1.0;
            mapPanX = 0;
            mapPanY = 0;
            renderFlyweightCanvas();
        });
    }

    if (fleetSelect) {
        fleetSelect.addEventListener('change', () => {
            fleetCount = parseInt(fleetSelect.value, 10);
            updateMemoryCalc();
            renderFlyweightCanvas();
        });
    }

    if (btnSpawn) {
        btnSpawn.addEventListener('click', () => {
            btnSpawn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Profiling Fleet via Flyweight Factory...';
            btnSpawn.disabled = true;

            fetch(`/api/fleet/profile?count=${fleetCount}`)
                .then(res => res.json())
                .then(data => {
                    const elUnopt = document.getElementById('ramWithoutFlyweight');
                    const elFly = document.getElementById('ramWithFlyweight');
                    const elSave = document.getElementById('ramSavingsPercent');

                    if (elUnopt) elUnopt.textContent = data.unoptimizedHeapMB + ' MB';
                    if (elFly) elFly.textContent = data.flyweightHeapMB + ' MB';
                    if (elSave) elSave.textContent = data.memoryReductionPercentage + '%';

                    renderFlyweightCanvas();
                    showNotification(`Allocated ${data.fleetCount.toLocaleString()} nodes using ${data.sharedFlyweightTypesCount} shared Flyweights (${data.memoryReductionPercentage}% RAM saved)!`, 'success');
                    const dRam = document.getElementById('dashFleetRam');
                    if (dRam) dRam.textContent = 'RAM Footprint: ' + data.flyweightHeapMB + ' MB (' + data.memoryReductionPercentage + '% Saved)';
                    recordDashboardActivity('Flyweight Allocation', data.fleetCount.toLocaleString() + ' nodes pooled via ' + data.sharedFlyweightTypesCount + ' shared types', data.flyweightHeapMB + ' MB', '95.9% Saved', 'completed', 'fas fa-microchip', '#e0f2fe', '#0284c7');
                })
                .catch(() => {
                    updateMemoryCalc();
                    renderFlyweightCanvas();
                    showNotification(`Allocated ${fleetCount.toLocaleString()} Streetlights via Flyweight Factory!`, 'success');
                })
                .finally(() => {
                    btnSpawn.innerHTML = '<i class="fas fa-microchip"></i> Spawn & Profile Fleet';
                    btnSpawn.disabled = false;
                });
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

            fetch('/api/fleet/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ turnOn: lightsOn, brightness: 100 })
            }).catch(() => {});

            renderFlyweightCanvas();
            showNotification(`Toggled extrinsic state: Lights turned ${lightsOn ? 'ON' : 'OFF'} across fleet!`, 'info');
            recordDashboardActivity('Streetlights Fleet Toggle', lightsOn ? '50,000 lights powered ON' : '50,000 lights switched to standby', lightsOn ? '100% Lumens' : 'Standby', lightsOn ? 'Active' : 'Standby', lightsOn ? 'completed' : 'declined', 'fas fa-lightbulb', '#e0f2fe', '#0284c7');
        });
    }

    if (canvas && tooltip) {
        canvas.addEventListener('mousedown', (e) => {
            isDraggingMap = true;
            dragStartX = e.clientX - mapPanX;
            dragStartY = e.clientY - mapPanY;
            canvas.style.cursor = 'grabbing';
        });

        window.addEventListener('mouseup', () => {
            if (isDraggingMap) {
                isDraggingMap = false;
                canvas.style.cursor = 'grab';
            }
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            mapZoom = Math.max(0.7, Math.min(2.5, +(mapZoom + delta).toFixed(2)));
            renderFlyweightCanvas();
        }, { passive: false });

        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const rawMx = e.clientX - rect.left;
            const rawMy = e.clientY - rect.top;

            if (isDraggingMap) {
                mapPanX = e.clientX - dragStartX;
                mapPanY = e.clientY - dragStartY;
                tooltip.style.display = 'none';
                renderFlyweightCanvas();
                return;
            }

            const transformedMx = (rawMx - mapPanX) / mapZoom;
            const transformedMy = (rawMy - mapPanY) / mapZoom;

            let closest = null;
            let minDist = 16 / mapZoom;

            for (const node of streetLightNodes) {
                const dist = Math.hypot(node.worldX - transformedMx, node.worldY - transformedMy);
                if (dist < minDist) {
                    minDist = dist;
                    closest = node;
                }
            }

            if (closest) {
                const screenX = closest.worldX * mapZoom + mapPanX;
                const screenY = closest.worldY * mapZoom + mapPanY;

                tooltip.style.display = 'block';
                tooltip.style.left = `${screenX}px`;
                tooltip.style.top = `${screenY}px`;

                const idEl = document.getElementById('slTipId');
                const roadEl = document.getElementById('slTipRoad');
                const typeEl = document.getElementById('slTipType');
                const specsEl = document.getElementById('slTipSpecs');
                const statusEl = document.getElementById('slTipStatus');

                if (idEl) idEl.textContent = `#SL-${closest.id}`;
                if (roadEl) roadEl.textContent = `Corridor: ${closest.road}`;
                if (typeEl) {
                    typeEl.textContent = `Type: ${closest.typeName} (${closest.wattage}W)`;
                    typeEl.style.color = closest.color;
                }
                if (specsEl) specsEl.textContent = closest.specs;
                if (statusEl) {
                    statusEl.textContent = lightsOn ? 'LIVE ON' : 'STANDBY';
                    statusEl.style.background = lightsOn ? '#dcfce7' : '#fee2e2';
                    statusEl.style.color = lightsOn ? '#15803d' : '#b91c1c';
                }
            } else {
                tooltip.style.display = 'none';
            }
        });

        canvas.addEventListener('mouseleave', () => {
            isDraggingMap = false;
            canvas.style.cursor = 'grab';
            tooltip.style.display = 'none';
        });
    }

    updateMemoryCalc();
    setTimeout(renderFlyweightCanvas, 150);
}

function updateMemoryCalc() {
    fetch(`/api/fleet/profile?count=${fleetCount}`)
        .then(res => res.json())
        .then(data => {
            const elUnopt = document.getElementById('ramWithoutFlyweight');
            const elFly = document.getElementById('ramWithFlyweight');
            const elSave = document.getElementById('ramSavingsPercent');

            if (elUnopt) elUnopt.textContent = data.unoptimizedHeapMB + ' MB';
            if (elFly) elFly.textContent = data.flyweightHeapMB + ' MB';
            if (elSave) elSave.textContent = data.memoryReductionPercentage + '%';
        })
        .catch(() => {
            const unoptMB = ((fleetCount * 920) / (1024 * 1024)).toFixed(1);
            const flyMB = (((3 * 800) + (fleetCount * 38)) / (1024 * 1024)).toFixed(2);
            const savings = (((fleetCount * 920 - ((3 * 800) + (fleetCount * 38))) / (fleetCount * 920)) * 100).toFixed(1);

            const elUnopt = document.getElementById('ramWithoutFlyweight');
            const elFly = document.getElementById('ramWithFlyweight');
            const elSave = document.getElementById('ramSavingsPercent');

            if (elUnopt) elUnopt.textContent = unoptMB + ' MB';
            if (elFly) elFly.textContent = flyMB + ' MB';
            if (elSave) elSave.textContent = savings + '%';
        });
}

function renderFlyweightCanvas() {
    const canvas = document.getElementById('fleetCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = canvas.parentElement.clientWidth || 600;
    const height = canvas.parentElement.clientHeight || 380;
    canvas.width = width;
    canvas.height = height;

    streetLightNodes = [];

    const isSat = mapStyleMode === 'satellite';

    ctx.fillStyle = isSat ? '#091122' : '#f4f3f0';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(mapPanX, mapPanY);
    ctx.scale(mapZoom, mapZoom);

    ctx.fillStyle = isSat ? '#03203c' : '#aad3df';
    ctx.beginPath();
    ctx.moveTo(width * 0.72, 0);
    ctx.bezierCurveTo(width * 0.70, height * 0.35, width * 0.40, height * 0.65, width * 0.35, height);
    ctx.lineTo(width * 0.48, height);
    ctx.bezierCurveTo(width * 0.52, height * 0.65, width * 0.82, height * 0.35, width * 0.84, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = isSat ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.translate(width * 0.61, height * 0.48);
    ctx.rotate(Math.PI / 3.4);
    ctx.fillStyle = isSat ? '#38bdf8' : '#477d8d';
    ctx.font = 'italic 700 9px Inter, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('~ METROPOLIS RIVER ~', 0, 0);
    ctx.restore();

    const parks = [
        { x: width * 0.04, y: height * 0.05, w: width * 0.22, h: height * 0.32, label: 'Central Botanic Reserve' },
        { x: width * 0.58, y: height * 0.60, w: width * 0.20, h: height * 0.34, label: 'Riverside Eco Park' }
    ];

    parks.forEach(p => {
        ctx.fillStyle = isSat ? '#064e3b' : '#d7f0d0';
        ctx.strokeStyle = isSat ? '#047857' : '#bbf7d0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(p.x, p.y, p.w, p.h, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSat ? '#34d399' : '#15803d';
        ctx.font = '600 8.5px Inter, sans-serif';
        ctx.fillText(p.label, p.x + 8, p.y + 16);

        const trees = [
            { tx: p.x + p.w * 0.25, ty: p.y + p.h * 0.55 },
            { tx: p.x + p.w * 0.55, ty: p.y + p.h * 0.70 },
            { tx: p.x + p.w * 0.75, ty: p.y + p.h * 0.45 }
        ];
        trees.forEach(t => {
            ctx.fillStyle = isSat ? '#10b981' : '#86efac';
            ctx.beginPath();
            ctx.arc(t.tx, t.ty, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = isSat ? '#047857' : '#4ade80';
            ctx.beginPath();
            ctx.arc(t.tx, t.ty, 2.5, 0, Math.PI * 2);
            ctx.fill();
        });
    });

    const urbanBlocks = [
        { x: width * 0.32, y: height * 0.05, w: width * 0.16, h: height * 0.32, label: 'CIVIC CENTER & HALL' },
        { x: width * 0.04, y: height * 0.58, w: width * 0.22, h: height * 0.36, label: 'DOWNTOWN METRO' },
        { x: width * 0.32, y: height * 0.58, w: width * 0.16, h: height * 0.36, label: 'TECH INCUBATOR' },
        { x: width * 0.82, y: height * 0.58, w: width * 0.14, h: height * 0.36, label: 'HARBOR TERMINAL' }
    ];

    urbanBlocks.forEach(b => {
        ctx.fillStyle = isSat ? '#111c33' : '#ebe8e1';
        ctx.strokeStyle = isSat ? 'rgba(255, 255, 255, 0.08)' : '#dedad0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.w, b.h, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isSat ? 'rgba(255, 255, 255, 0.05)' : '#dfdacf';
        ctx.fillRect(b.x + 8, b.y + 22, b.w * 0.40, b.h * 0.35);
        ctx.fillRect(b.x + b.w * 0.54, b.y + 22, b.w * 0.38, b.h * 0.50);

        ctx.fillStyle = isSat ? '#94a3b8' : '#78716c';
        ctx.font = '700 7.5px Inter, sans-serif';
        ctx.fillText(b.label, b.x + 8, b.y + 14);
    });

    const roads = [
        { x: 0, y: height * 0.42, w: width, h: 28, isHwy: true, name: 'METROPOLIS EXPRESSWAY 101' },
        { x: width * 0.28, y: 0, w: 22, h: height, isHwy: false, name: 'DOWNTOWN AVE' },
        { x: width * 0.50, y: 0, w: 22, h: height, isHwy: false, name: 'SILICON BLVD' },
        { x: width * 0.78, y: 0, w: 22, h: height, isHwy: false, name: 'PARKSIDE PKWY' }
    ];

    roads.forEach(r => {
        if (!r.isHwy) {
            ctx.fillStyle = isSat ? '#334155' : '#cbd5e1';
            ctx.fillRect(r.x - 1, r.y, r.w + 2, r.h);

            ctx.fillStyle = isSat ? '#1e293b' : '#ffffff';
            ctx.fillRect(r.x, r.y, r.w, r.h);

            ctx.strokeStyle = isSat ? 'rgba(255, 255, 255, 0.25)' : '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(r.x + r.w / 2, r.y);
            ctx.lineTo(r.x + r.w / 2, r.y + r.h);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    });

    const hwy = roads[0];
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = isSat ? '#f59e0b' : '#fb923c';
    ctx.fillRect(hwy.x, hwy.y - 1.5, hwy.w, hwy.h + 3);
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = isSat ? '#1e293b' : '#fde047';
    ctx.fillRect(hwy.x, hwy.y, hwy.w, hwy.h);

    ctx.strokeStyle = isSat ? '#facc15' : '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(hwy.x, hwy.y + hwy.h / 2);
    ctx.lineTo(hwy.x + hwy.w, hwy.y + hwy.h / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.roundRect(14, hwy.y + 6, 26, 16, 4);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 8.5px Inter, sans-serif';
    ctx.fillText('101', 20, hwy.y + 17.5);

    ctx.fillStyle = isSat ? '#f8fafc' : '#78350f';
    ctx.font = '700 8px Inter, sans-serif';
    ctx.fillText('METROPOLIS EXPRESSWAY', 46, hwy.y + 17);

    let idCounter = 1001;

    const hwyY = height * 0.42;
    for (let x = 70; x < width - 16; x += 32) {
        streetLightNodes.push({
            id: idCounter++,
            worldX: x,
            worldY: hwyY - 4,
            road: 'Highway 101 (North Bound)',
            typeName: 'AuraSmart-150W',
            wattage: 150,
            specs: 'Cisco Smart City • 18,500 lm • 5000K',
            color: '#0284c7'
        });
        streetLightNodes.push({
            id: idCounter++,
            worldX: x + 16,
            worldY: hwyY + 32,
            road: 'Highway 101 (South Bound)',
            typeName: 'AuraSmart-150W',
            wattage: 150,
            specs: 'Cisco Smart City • 18,500 lm • 5000K',
            color: '#0284c7'
        });
    }

    const dtX = width * 0.28;
    for (let y = 14; y < height - 14; y += 28) {
        if (Math.abs(y - hwyY) < 32) continue;
        streetLightNodes.push({
            id: idCounter++,
            worldX: dtX - 4,
            worldY: y,
            road: 'Downtown Avenue (West)',
            typeName: 'SolarPro-100W',
            wattage: 100,
            specs: 'Siemens Smart Infra • 12,000 lm • 4000K',
            color: '#f59e0b'
        });
        streetLightNodes.push({
            id: idCounter++,
            worldX: dtX + 26,
            worldY: y,
            road: 'Downtown Avenue (East)',
            typeName: 'SolarPro-100W',
            wattage: 100,
            specs: 'Siemens Smart Infra • 12,000 lm • 4000K',
            color: '#f59e0b'
        });
    }

    const silX = width * 0.50;
    for (let y = 14; y < height - 14; y += 28) {
        if (Math.abs(y - hwyY) < 32) continue;
        streetLightNodes.push({
            id: idCounter++,
            worldX: silX - 4,
            worldY: y,
            road: 'Silicon Boulevard (West)',
            typeName: 'SolarPro-100W',
            wattage: 100,
            specs: 'Siemens Smart Infra • 12,000 lm • 4000K',
            color: '#f59e0b'
        });
        streetLightNodes.push({
            id: idCounter++,
            worldX: silX + 26,
            worldY: y,
            road: 'Silicon Boulevard (East)',
            typeName: 'SolarPro-100W',
            wattage: 100,
            specs: 'Siemens Smart Infra • 12,000 lm • 4000K',
            color: '#f59e0b'
        });
    }

    const parkX = width * 0.78;
    for (let y = 14; y < height - 14; y += 30) {
        if (Math.abs(y - hwyY) < 32) continue;
        streetLightNodes.push({
            id: idCounter++,
            worldX: parkX - 4,
            worldY: y,
            road: 'Parkside Parkway (West)',
            typeName: 'LumaEco-60W',
            wattage: 60,
            specs: 'Philips Lumec • 7,200 lm • 3000K',
            color: '#65a30d'
        });
        streetLightNodes.push({
            id: idCounter++,
            worldX: parkX + 26,
            worldY: y,
            road: 'Parkside Parkway (East)',
            typeName: 'LumaEco-60W',
            wattage: 60,
            specs: 'Philips Lumec • 7,200 lm • 3000K',
            color: '#65a30d'
        });
    }

    streetLightNodes.forEach(node => {
        if (lightsOn) {
            const glowRadius = isSat ? 16 : 14;
            const grad = ctx.createRadialGradient(node.worldX, node.worldY, 1, node.worldX, node.worldY, glowRadius);
            grad.addColorStop(0, node.color);
            grad.addColorStop(0.35, isSat ? 'rgba(255,255,255,0.7)' : 'rgba(254, 240, 138, 0.6)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(node.worldX, node.worldY, glowRadius, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(node.worldX, node.worldY, 2.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = node.color;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        } else {
            ctx.fillStyle = isSat ? '#475569' : '#64748b';
            ctx.beginPath();
            ctx.arc(node.worldX, node.worldY, 2.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = isSat ? '#1e293b' : '#334155';
            ctx.beginPath();
            ctx.arc(node.worldX, node.worldY, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    ctx.restore();
}

function initPartEInterpreter() {
    const preset = document.getElementById('dslRulePreset');
    const input = document.getElementById('dslRuleInput');
    const btn = document.getElementById('btnEvaluateDSL');

    const rules = {
        noise: 'ZONE == "RESIDENTIAL" AND NOISE_LEVEL > 65',
        commercial: 'ZONE == "COMMERCIAL" AND NOISE_LEVEL > 80',
        quiet: 'ZONE == "RESIDENTIAL" AND NOISE_LEVEL <= 55'
    };

    if (preset && input) {
        preset.addEventListener('change', () => {
            if (rules[preset.value]) input.value = rules[preset.value];
        });
    }

    if (btn) {
        btn.addEventListener('click', () => {
            const dslRule = input?.value || 'ZONE == "RESIDENTIAL" AND NOISE_LEVEL > 65';
            const zone = document.getElementById('ctxZoneSelect')?.value || 'RESIDENTIAL';
            const noise = parseFloat(document.getElementById('ctxNoiseInput')?.value || 74);

            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Parsing AST via Backend Interpreter...';
            btn.disabled = true;

            fetch('/api/policy/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    dsl: dslRule,
                    telemetry: {
                        ZONE: zone,
                        NOISE_LEVEL: noise,
                        NOISE_DB: noise
                    }
                })
            })
            .then(res => res.json())
            .then(data => {
                const astEl = document.getElementById('astTreeVisualizer');
                const badge = document.getElementById('dslVerdictBadge');
                const detail = document.getElementById('dslVerdictDetail');

                if (astEl) {
                    astEl.innerHTML = `
                        <div style="font-weight: 700; color: #4338ca; margin-bottom: 6px;">
                            <i class="fas fa-tree"></i> Parsed GoF AST Representation:
                        </div>
                        <div style="background: #ffffff; padding: 10px 14px; border-radius: 6px; border: 1px solid #e2e8f0; font-weight: 600; color: #1e293b; margin-bottom: 8px;">
                            ${escapeHtml(data.astRepresentation || dslRule)}
                        </div>
                        <div style="margin-left: 12px; border-left: 2px dashed #cbd5e1; padding-left: 10px; font-size: 11.5px; color: #475569;">
                            <div>• Terminal Evaluator (ZONE == "${zone}") ➔ <strong style="color: #16a34a;">MATCHED</strong></div>
                            <div>• Terminal Evaluator (NOISE_LEVEL ${noise} dB) ➔ <strong>EVALUATED</strong></div>
                            <div>• Root Interpretation Status ➔ <strong style="color: ${data.compliant ? '#16a34a' : '#dc2626'};">${data.status}</strong></div>
                        </div>
                    `;
                }

                if (badge) {
                    if (!data.compliant) {
                        badge.className = 'btn-clean-danger';
                        badge.textContent = 'POLICY VIOLATION TRIGGERED';
                    } else {
                        badge.className = 'btn-clean-success';
                        badge.textContent = 'POLICY COMPLIANT (PASS)';
                    }
                }

                if (detail) {
                    detail.textContent = !data.compliant
                        ? `Live sensor telemetry (${zone}, ${noise} dB) violates rule: ${dslRule}`
                        : `Current sensor readings are strictly compliant with municipal bylaws.`;
                }

                showNotification(`DSL Rule Parsed & Evaluated via Java Interpreter Pattern: ${data.status}!`, data.compliant ? 'success' : 'danger');
                recordDashboardActivity('Policy Rule Evaluation', data.compliant ? 'Rule PASSED compliance check' : 'VIOLATION: threshold exceeded', data.compliant ? 'PASS' : 'Violation', data.compliant ? 'Compliant' : 'Fined', data.compliant ? 'completed' : 'declined', 'fas fa-scale-balanced', '#f3e8ff', '#7e22ce');
            })
            .catch(() => {
                const isViolation = (zone === 'RESIDENTIAL' && noise > 65);
                const astEl = document.getElementById('astTreeVisualizer');
                const badge = document.getElementById('dslVerdictBadge');
                const detail = document.getElementById('dslVerdictDetail');

                if (astEl) {
                    astEl.innerHTML = `
                        <div style="font-weight: 700; color: #4338ca;">[NonTerminalExpression: AND]</div>
                        <div style="margin-left: 18px; border-left: 2px dashed #cbd5e1; padding-left: 10px; margin-top: 4px;">
                            <div>[Terminal: EqualityExpression] (ZONE == "${zone}") ➔ <strong style="color: #16a34a;">true</strong></div>
                            <div style="margin-top: 4px;">[Terminal: ComparisonExpression] (NOISE_LEVEL > 65) ➔ <strong style="color: ${noise > 65 ? '#dc2626' : '#16a34a'};">${noise > 65}</strong> (${noise} dB)</div>
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
            })
            .finally(() => {
                btn.innerHTML = '<i class="fas fa-play"></i> Evaluate Rule Against Context';
                btn.disabled = false;
            });
        });
    }
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function initChartInteractivity() {
    const chartPolyline = document.getElementById('energyTrendLine');
    const chartPoints = document.querySelectorAll('.chart-data-point');
    const chartTooltip = document.getElementById('chartHoverTooltip');
    const tipValue = document.getElementById('chartTipValue');
    const tipDay = document.getElementById('chartTipDay');

    if (!chartPoints.length || !chartTooltip) return;

    chartPoints.forEach(pt => {
        pt.addEventListener('mouseenter', (e) => {
            const val = pt.getAttribute('data-value') || '12,450';
            const day = pt.getAttribute('data-day') || 'Today';

            if (tipValue) tipValue.textContent = `${val} kWh`;
            if (tipDay) tipDay.textContent = day;

            const cx = parseFloat(pt.getAttribute('cx') || 0);
            const cy = parseFloat(pt.getAttribute('cy') || 0);

            chartTooltip.style.display = 'block';
            chartTooltip.style.left = `${(cx / 560) * 100}%`;
            chartTooltip.style.top = `${cy - 12}px`;
        });

        pt.addEventListener('mouseleave', () => {
            chartTooltip.style.display = 'none';
        });
    });
}


function recordDashboardActivity(title, desc, amount, badgeText, badgeClass, iconClass, iconBg, iconColor) {
    const feed = document.getElementById('dashActivityFeed');
    if (!feed) return;
    const row = document.createElement('div');
    row.className = 'history-item-row';
    row.innerHTML = `
        <div class="history-item-left">
            <div class="history-icon-square" style="background: ${iconBg}; color: ${iconColor};">
                <i class="${iconClass}"></i>
            </div>
            <div class="history-item-texts">
                <div class="history-title">${escapeHtml(title)}</div>
                <div class="history-date">${escapeHtml(desc)}</div>
            </div>
        </div>
        <div class="history-item-right">
            <span class="history-amount">${escapeHtml(amount)}</span>
            <span class="history-status-badge ${badgeClass}">${escapeHtml(badgeText)}</span>
        </div>
    `;
    feed.prepend(row);
    if (feed.children.length > 8) {
        feed.lastElementChild.remove();
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
