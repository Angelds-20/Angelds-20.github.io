document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       SPA TAB ROUTING SYSTEM
       ========================================================================== */
    const tabLinks = document.querySelectorAll('.tab-link');
    
    function initRouter() {
        let hash = window.location.hash.replace('#', '');
        if (!hash || !['inicio', 'proyectos', 'competencias', 'consola', 'sobre-mi', 'contacto'].includes(hash)) {
            hash = 'inicio';
        }
        switchTab(hash);
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        const targetTab = document.getElementById('tab-' + tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        tabLinks.forEach(link => {
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        if (tabId === 'consola') {
            setTimeout(() => {
                const termInput = document.getElementById('terminal-input');
                if (termInput) termInput.focus();
            }, 100);
        }
    }

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const tabId = link.getAttribute('data-tab');
            window.location.hash = tabId;
        });
    });

    window.addEventListener('hashchange', initRouter);
    initRouter();


    /* ==========================================================================
       LIVE SYSTEM MONITOR
       ========================================================================== */
    const uptimeVal = document.getElementById('monitor-uptime');
    const cpuText = document.getElementById('monitor-cpu-text');
    const cpuBar = document.getElementById('monitor-cpu-bar');
    const memText = document.getElementById('monitor-mem-text');
    const memBar = document.getElementById('monitor-mem-bar');

    let startTime = Date.now();
    let uptimeOffset = 18 * 24 * 3600 + 5 * 3600 + 43 * 60 + 12;

    function updateUptime() {
        let elapsed = Math.floor((Date.now() - startTime) / 1000) + uptimeOffset;
        let days = Math.floor(elapsed / (24 * 3600));
        let hours = Math.floor((elapsed % (24 * 3600)) / 3600);
        let minutes = Math.floor((elapsed % 3600) / 60);
        let seconds = elapsed % 60;
        
        if (uptimeVal) {
            uptimeVal.textContent = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        }
    }

    function updateStats() {
        let cpu = (Math.random() * 15.0 + 3.0).toFixed(1);
        let mem = (Math.random() * 1.5 + 38.0).toFixed(1);

        if (cpuText && cpuBar) {
            cpuText.textContent = `${cpu}%`;
            cpuBar.style.width = `${cpu}%`;
        }
        if (memText && memBar) {
            memText.textContent = `${mem}%`;
            memBar.style.width = `${mem}%`;
        }
    }

    setInterval(updateUptime, 1000);
    setInterval(updateStats, 2000);
    updateUptime();
    updateStats();


    /* ==========================================================================
       PROJECTS PAGINATION & FILTERING LOGIC
       ========================================================================== */
    const projectsContainer = document.getElementById('projects-container');
    const paginationControls = document.getElementById('pagination-controls');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let allProjectCards = [];
    let currentPage = 1;
    let currentFilter = 'all';
    const PROJECTS_PER_PAGE = 4;

    // Load static HTML project cards into memory on load
    if (projectsContainer) {
        const cards = projectsContainer.querySelectorAll('.project-card');
        cards.forEach(card => {
            allProjectCards.push(card);
        });
        
        // Initial render
        updateProjectsView();
    }

    // Filter handlers
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentFilter = btn.getAttribute('data-filter');
            currentPage = 1; // Reset to page 1 on filter
            updateProjectsView();
        });
    });

    function updateProjectsView() {
        if (!projectsContainer) return;

        // Clear container
        projectsContainer.innerHTML = '';

        // Filter cards in memory
        const filteredCards = allProjectCards.filter(card => {
            if (currentFilter === 'all') return true;
            return card.getAttribute('data-category') === currentFilter;
        });

        // Calculate pages
        const totalPages = Math.ceil(filteredCards.length / PROJECTS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }

        // Slice cards
        const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
        const endIndex = startIndex + PROJECTS_PER_PAGE;
        const pageCards = filteredCards.slice(startIndex, endIndex);

        // Append to UI
        if (pageCards.length === 0) {
            projectsContainer.innerHTML = '<div class="no-projects-message">No se encontraron proyectos en esta categoría.</div>';
        } else {
            pageCards.forEach(card => {
                projectsContainer.appendChild(card);
            });
        }

        // Render Pagination Controls
        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        if (!paginationControls) return;
        paginationControls.innerHTML = '';

        if (totalPages <= 1) return; // No pagination needed

        // Prev Button
        const prevBtn = document.createElement('button');
        prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fa-solid fa-angle-left"></i>';
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateProjectsView();
                window.scrollTo({ top: document.getElementById('tab-proyectos').offsetTop - 20, behavior: 'smooth' });
            }
        });
        paginationControls.appendChild(prevBtn);

        // Page Number Buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                updateProjectsView();
                window.scrollTo({ top: document.getElementById('tab-proyectos').offsetTop - 20, behavior: 'smooth' });
            });
            paginationControls.appendChild(pageBtn);
        }

        // Next Button
        const nextBtn = document.createElement('button');
        nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fa-solid fa-angle-right"></i>';
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateProjectsView();
                window.scrollTo({ top: document.getElementById('tab-proyectos').offsetTop - 20, behavior: 'smooth' });
            }
        });
        paginationControls.appendChild(nextBtn);
    }


    /* ==========================================================================
       INTERACTIVE TERMINAL SIMULATOR
       ========================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('terminal-body');
    const terminalClearBtn = document.getElementById('terminal-clear-btn');

    if (terminalBody) {
        terminalBody.addEventListener('click', () => {
            if (terminalInput) terminalInput.focus();
        });
    }

    if (terminalClearBtn) {
        terminalClearBtn.addEventListener('click', () => {
            if (terminalHistory) terminalHistory.innerHTML = '';
        });
    }

    const commandResponses = {
        help: `Comandos disponibles:
  <span class="cli-accent">about</span>    - Resume el perfil profesional.
  <span class="cli-accent">projects</span> - Lista los proyectos principales.
  <span class="cli-accent">skills</span>   - Detalla las habilidades y stack técnico.
  <span class="cli-accent">contact</span>  - Canales de contacto directo.
  <span class="cli-accent">github</span>   - Abre mi perfil de GitHub en una pestaña nueva.
  <span class="cli-accent">systemctl status portfolio</span> - Muestra estadísticas del portafolio.
  <span class="cli-accent">neofetch</span> - Muestra la información del sistema simulado.
  <span class="cli-accent">clear</span>    - Limpia la pantalla de la terminal.`,
        neofetch: `               <span class="cli-accent">/\\</span>          <span class="cli-success">angel@servidor</span>
              <span class="cli-accent">/  \\</span>         <span class="cli-success">--------------</span>
             <span class="cli-accent">/\\   \\</span>        OS: Debian GNU/Linux x86_64
            <span class="cli-accent">/  __  \\</span>       Kernel: 6.1.0-21-amd64
           <span class="cli-accent">/  (  )  \\</span>      Uptime: ${uptimeVal ? uptimeVal.textContent : '18d 05h 43m'}
          <span class="cli-accent">/  /    \\  \\</span>     Shell: bash 5.2.15
         <span class="cli-accent">/  /      \\  \\</span>    Server: Nginx / Gunicorn
        <span class="cli-accent">/_ /        \\ _\\</span>   Terminal: Web-Console (JS)
                           CPU: Intel(R) Core(TM) i5 (Dev Server)
                           RAM: 6.2 GiB / 16.0 GiB (38%)`,
        about: `<span class="cli-yellow">[Perfil de Ángel Noriega]</span>
Estudiante de Ingeniería en Informática con sólida formación en desarrollo Full-Stack,
despliegues de servidores Linux y telemetría de sistemas embebidos (ESP32).
Busca crear soluciones integrales combinando interfaces de usuario fluidas en el Frontend
con lógica eficiente y segura en el Backend.`,
        projects: `<span class="cli-yellow">[Proyectos Principales]</span>
  1. <span class="cli-accent">Punto de Venta</span>      - React SPA, Django backend y barcode control.
  2. <span class="cli-accent">Fundación Bon Sens</span>  - DevOps, Docker y Compose local.
  3. <span class="cli-accent">Telemetry Dashboard</span> - React, Node.js y flujos WebSockets en vivo.
  4. <span class="cli-accent">ClearDose (IoT)</span>     - C++ ESP32 interrupt firmware &amp; Android Kotlin App.
  5. <span class="cli-accent">QRSend</span>              - Go socket file streams en red LAN.
  6. <span class="cli-accent">Netscan</span>             - Bash script auditor de routers locales.`,
        skills: `<span class="cli-yellow">[Stack &amp; Habilidades]</span>
  - <span class="cli-accent">Frontend</span>: React, JavaScript ES6, HTML5, CSS3 responsive.
  - <span class="cli-accent">Backend</span>: Django REST framework, Go (Golang), Node.js, PHP, Postgres.
  - <span class="cli-accent">DevOps</span>: Docker, Docker Compose, Linux, Bash Scripting, Systemd.
  - <span class="cli-accent">IoT</span>: C++ (ESP32/Arduino), Android (Kotlin), Bluetooth Serial.`,
        contact: `<span class="cli-yellow">[Canales de Comunicación]</span>
  - Email:    <a href="mailto:3N63L@proton.me" class="cli-accent">3N63L@proton.me</a>
  - LinkedIn: <a href="https://linkedin.com/in/angel-noriega-42b122373" target="_blank" class="cli-accent">linkedin.com/in/angel-noriega-42b122373</a>
  - GitHub:   <a href="https://github.com/Angelds-20" target="_blank" class="cli-accent">github.com/Angelds-20</a>`,
        github: `Abriendo perfil de GitHub <a href="https://github.com/Angelds-20" target="_blank" class="cli-accent">github.com/Angelds-20</a> en pestaña nueva...`,
        sudo: `[sudo] password for angel: 
Sorry, try again.
sudo: 1 incorrect password attempt`
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandText = terminalInput.value.trim();
                const cleanCmd = commandText.toLowerCase();

                const promptLine = document.createElement('div');
                promptLine.className = 'terminal-line';
                promptLine.innerHTML = `<span class="terminal-prompt">angel@servidor:~$</span> ${commandText}`;
                terminalHistory.appendChild(promptLine);

                if (cleanCmd !== '') {
                    const responseLine = document.createElement('div');
                    responseLine.className = 'terminal-line';

                    if (cleanCmd === 'clear') {
                        terminalHistory.innerHTML = '';
                    } else if (cleanCmd === 'uptime') {
                        responseLine.innerHTML = `Servidor Uptime: ${uptimeVal ? uptimeVal.textContent : 'Calculando...'}`;
                        terminalHistory.appendChild(responseLine);
                    } else if (cleanCmd === 'github') {
                        responseLine.innerHTML = commandResponses['github'];
                        terminalHistory.appendChild(responseLine);
                        window.open('https://github.com/Angelds-20', '_blank');
                    } else if (cleanCmd === 'systemctl status portfolio' || cleanCmd === 'systemctl status') {
                        responseLine.innerHTML = `● portfolio.service - Portafolio de Angel Noriega
     Loaded: loaded (/etc/systemd/system/portfolio.service; enabled; vendor preset: enabled)
     Active: <span class="cli-success">active (running)</span> since Mon 2026-06-22 00:00:00 UTC; 5h ago
   Main PID: 24890 (node)
      Tasks: 11
     Memory: 48.2M
     CGroup: /system.slice/portfolio.service
             └─24890 node server.js

<span class="cli-yellow">MÉTRICAS DE EXPERIENCIA:</span>
  - Proyectos completados:  <span class="cli-accent">15</span>
  - Contenedores Docker:    <span class="cli-accent">5</span>
  - Módulos IoT activos:    <span class="cli-accent">3</span>
  - OS de Servidor:         <span class="cli-accent">Debian Linux</span>`;
                        terminalHistory.appendChild(responseLine);
                    } else if (commandResponses[cleanCmd]) {
                        responseLine.innerHTML = commandResponses[cleanCmd];
                        terminalHistory.appendChild(responseLine);
                    } else {
                        responseLine.innerHTML = `bash: comando no encontrado: <span class="cli-red">${commandText}</span>. Escribe <span class="cli-accent">help</span> para opciones.`;
                        terminalHistory.appendChild(responseLine);
                    }
                }

                terminalInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }


    /* ==========================================================================
       TECHNICAL PROJECT MODAL (DRAWER) DATA & DELEGATION
       ========================================================================== */
    const projectDetails = {
        pos: {
            stack: "Django &bull; React &bull; SQLite &bull; Python",
            title: "Punto de Venta e Inventarios",
            text: "Aplicación web integrada que maneja ventas y alertas de existencias en tiempo real. Dispone de un frontend de usuario rápido en React y un backend transaccional seguro programado en Django.",
            codeHeader: "views.py (Django REST Framework - Stock Alertas)",
            code: `# -*- coding: utf-8 -*-
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product

@api_view(['POST'])
def registrar_venta(request, product_id):
    producto = get_object_or_404(Product, pk=product_id)
    cantidad = int(request.data.get('cantidad', 1))
    
    # Validar existencias críticas
    if producto.stock - cantidad <= producto.limite_critico:
        producto.alerta_stock = True
        
    producto.stock -= cantidad
    producto.save()
    
    return Response({
        'status': 'success',
        'producto': producto.nombre,
        'nuevo_stock': producto.stock,
        'alerta': producto.alerta_stock
    })`
        },
        bonsens: {
            stack: "Docker &bull; Compose &bull; PostgreSQL &bull; PHP",
            title: "Fundación Bon Sens",
            text: "Orquestación de infraestructura local para la plataforma web transaccional de la fundación. Utiliza Docker para compilar contenedores aislados que simulan el entorno exacto de producción, con volumes persistentes.",
            codeHeader: "docker-compose.yml (Definición de Servicios)",
            code: `version: '3.8'

services:
  # Servidor Apache y PHP
  web:
    image: php:8.2-apache
    container_name: bonsens_web
    ports:
      - "8080:80"
    volumes:
      - ./src:/var/www/html
    depends_on:
      - db
    restart: always

  # Motor PostgreSQL de Base de Datos
  db:
    image: postgres:15-alpine
    container_name: bonsens_db
    environment:
      POSTGRES_DB: bonsens_db
      POSTGRES_USER: angel
      POSTGRES_PASSWORD: password123
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  pgdata:`
        },
        dashboard_iot: {
            stack: "React &bull; Node.js &bull; WebSockets &bull; Tailwind",
            title: "Dashboard de Telemetría Real-time",
            text: "Plataforma web para monitorear el caudal hídrico registrado por sensores físicos. Emplea WebSockets para inyectar flujos binarios al gráfico reactivo del Frontend sin retraso.",
            codeHeader: "TelemetryView.jsx (Consumo WebSocket en React)",
            code: `import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function TelemetryView() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Abrir canal de datos directo al servidor local
    const ws = new WebSocket('ws://192.168.1.50:8080/telemetry');
    
    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      // Mantener solo los últimos 20 puntos en el gráfico
      setData(prev => [...prev.slice(-19), {
        time: new Date().toLocaleTimeString(),
        flow: payload.flowRate
      }]);
    };
    
    return () => ws.close();
  }, []);

  return (
    <div className="chart-panel">
      <h3>Flujo en Tiempo Real (L/min)</h3>
      <LineChart width={500} height={240} data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="flow" stroke="#38bdf8" dot={false} />
      </LineChart>
    </div>
  );
}`
        },
        cleardose: {
            stack: "C++ (Arduino) &bull; Bluetooth &bull; ESP32 Interrupts",
            title: "Automatización de Caudal IoT",
            text: "Firmware desarrollado en C++ utilizando rutinas de interrupción por hardware para contar los pulsos mecánicos del caudalímetro, permitiendo cortar el paso de agua con relés cuando se alcanza la meta de mililitros.",
            codeHeader: "flow_sensor.ino (Lógica de Interrupción ESP32)",
            code: `// Medición de flujo usando interrupciones
#include "BluetoothSerial.h"

BluetoothSerial ESP_BT;
const byte FLOW_PIN = 18;      // Pin de interrupción
const byte RELAY_PIN = 19;     // Control relé solenoide
volatile long pulsoCount = 0;
long targetPulsos = 0;

void IRAM_ATTR countPulses() {
  pulsoCount++;
}

void setup() {
  pinMode(FLOW_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_PIN), countPulses, FALLING);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Electroválvula apagada
  
  ESP_BT.begin("ESP32_Caudal");
}

void loop() {
  if (ESP_BT.available()) {
    String cmd = ESP_BT.readStringUntil('\\n');
    if (cmd.startsWith("START:")) {
      long ml = cmd.substring(6).toInt();
      targetPulsos = ml * 2.25; // Constante de calibración
      pulsoCount = 0;
      digitalWrite(RELAY_PIN, HIGH); // Abrir paso
    }
  }
  
  if (targetPulsos > 0 && pulsoCount >= targetPulsos) {
    digitalWrite(RELAY_PIN, LOW); // Cerrar paso automáticamente
    ESP_BT.println("STATUS:COMPLETE");
    targetPulsos = 0;
  }
}`
        },
        qrsend: {
            stack: "Go (Golang) &bull; WebSockets &bull; LAN Networking",
            title: "QRSend (Servidor LAN)",
            text: "Servicio compilado en un binario portable autocontenido de Go. Genera un servidor web y actualiza bloques de datos binarios por WebSockets en red de área local para transferencias rápidas sin salida a internet.",
            codeHeader: "stream.go (WebSocket Stream Handler en Go)",
            code: `package main

import (
	"net/http"
	"os"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  65536,
	WriteBufferSize: 65536,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func handleFileStream(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	// Abrir archivo para ir adjuntando los bytes entrantes
	file, _ := os.OpenFile("received_file", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	defer file.Close()

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if messageType == websocket.BinaryMessage {
			file.Write(p) // Escribir chunk directo
		}
	}
}`
        },
        netscan: {
            stack: "Bash Script &bull; Nmap Auditor &bull; CLI Tools",
            title: "Netscan Security Tool",
            text: "Script escrito en Bash shell. Automatiza el descubrimiento de subredes locales, escaneo selectivo de puertos críticos y filtrado de cabeceras HTTP de cámaras IP vulnerables expuestas.",
            codeHeader: "netscan.sh (Escaneo Modular)",
            code: `#!/bin/bash
# Netscan - Escaneo rápido y modular de cámaras locales y routers

# Detectar subred por defecto
GET_GW=$(ip route | grep default | awk '{print $3}')
SUBNET=$(echo $GET_GW | cut -d. -f1-3)".0/24"

echo -e "\\e[1;34m[*] Detectada puerta de enlace: $GET_GW\\e[0m"
echo -e "\\e[1;34m[*] Escaneando segmento LAN: $SUBNET\\e[0m"

# Buscar puertos específicos de administración / streaming de video
nmap -p 80,8080,554 --open -sV $SUBNET | awk '
/Nmap scan report for/ {printf "\\n\\e[1;32m[+] Dispositivo: %s\\e[0m\\n", $5}
/open/ {printf "    -> Puerto: %s | %s\\n", $1, $3}
'
echo -e "\\n\\e[1;33m[+] Escaneo finalizado.\\e[0m"`
        }
    };

    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalStack = document.getElementById('modal-project-stack');
    const modalBody = document.getElementById('modal-project-body');

    function openModal(projectId) {
        const data = projectDetails[projectId];
        if (!data || !modal) return;

        modalStack.innerHTML = data.stack;
        modalTitle.textContent = data.title;

        modalBody.innerHTML = `
            <p class="modal-text">${data.text}</p>
            <div class="modal-code-wrapper">
                <div class="modal-section-title">${data.codeHeader}</div>
                <pre class="modal-code-block"><code>${escapeHTML(data.code)}</code></pre>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Dynamic Event Delegation for "Detalles Técnicos" buttons
    if (projectsContainer) {
        projectsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.card-detail-btn');
            if (btn) {
                const projId = btn.getAttribute('data-project');
                openModal(projId);
            }
        });
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }


    /* ==========================================================================
       CONTACT FORM SUBMITTER
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('c-name').value;
            const email = document.getElementById('c-email').value;
            const message = document.getElementById('c-message').value;
            const submitBtn = document.getElementById('btn-submit');

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            fetch('https://formsubmit.co/ajax/3N63L@proton.me', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    Nombre: name,
                    Email: email,
                    Mensaje: message
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Error al enviar.');
            })
            .then(data => {
                formFeedback.textContent = '¡Mensaje enviado con éxito! Recibirás una respuesta en tu correo pronto.';
                formFeedback.className = 'form-feedback success';
                contactForm.reset();
                
                setTimeout(() => {
                    formFeedback.textContent = '';
                    formFeedback.className = 'form-feedback';
                }, 6000);
            })
            .catch(error => {
                formFeedback.textContent = 'Error al enviar por AJAX. Escribe directamente a 3N63L@proton.me';
                formFeedback.className = 'form-feedback error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            });
        });
    }
});
