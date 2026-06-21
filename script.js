document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       SPA TAB ROUTING SYSTEM
       ========================================================================== */
    const tabLinks = document.querySelectorAll('.tab-link');
    
    function initRouter() {
        // Read hash from URL, default to 'inicio'
        let hash = window.location.hash.replace('#', '');
        if (!hash || !['inicio', 'proyectos', 'competencias', 'consola', 'sobre-mi', 'contacto'].includes(hash)) {
            hash = 'inicio';
        }
        switchTab(hash);
    }

    function switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show active tab
        const targetTab = document.getElementById('tab-' + tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Update active class on nav links
        tabLinks.forEach(link => {
            if (link.getAttribute('data-tab') === tabId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Auto-focus terminal input if entering consola
        if (tabId === 'consola') {
            setTimeout(() => {
                const termInput = document.getElementById('terminal-input');
                if (termInput) termInput.focus();
            }, 100);
        }
    }

    // Handle clicks on tab links
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Let normal anchor hashing work, router will pick it up
            const tabId = link.getAttribute('data-tab');
            window.location.hash = tabId;
        });
    });

    // Listen to hash changes in browser
    window.addEventListener('hashchange', initRouter);
    // Trigger router on initial load
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
    // Pre-load uptime offset: 18 days, 5 hours, 43 mins, 12 seconds
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
        // Fluctuate CPU between 4.5% and 26.8%
        let cpu = (Math.random() * 22.3 + 4.5).toFixed(1);
        // Fluctuate MEM between 42.1% and 44.5%
        let mem = (Math.random() * 2.4 + 42.1).toFixed(1);

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
       INTERACTIVE TERMINAL SIMULATOR
       ========================================================================== */
    const terminalInput = document.getElementById('terminal-input');
    const terminalHistory = document.getElementById('terminal-history');
    const terminalBody = document.getElementById('terminal-body');
    const terminalClearBtn = document.getElementById('terminal-clear-btn');

    // Keep input focused when clicking inside terminal window
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
  <span class="cli-accent">neofetch</span> - Muestra la información del sistema.
  <span class="cli-accent">about</span>    - Lee el extracto del perfil profesional.
  <span class="cli-accent">projects</span> - Lista los proyectos de ingeniería destacados.
  <span class="cli-accent">skills</span>   - Muestra las competencias agrupadas.
  <span class="cli-accent">contact</span>  - Datos de contacto y redes sociales.
  <span class="cli-accent">uptime</span>   - Tiempo de actividad del servidor local.
  <span class="cli-accent">clear</span>    - Limpia la pantalla.`,
        neofetch: `               <span class="cli-accent">/\\</span>          <span class="cli-success">angel@archlinux</span>
              <span class="cli-accent">/  \\</span>         <span class="cli-success">---------------</span>
             <span class="cli-accent">/\\   \\</span>        OS: Arch Linux x86_64
            <span class="cli-accent">/  __  \\</span>       Kernel: 6.8.9-arch1-1
           <span class="cli-accent">/  (  )  \\</span>      Uptime: ${uptimeVal ? uptimeVal.textContent : '18d 05h 43m'}
          <span class="cli-accent">/  /    \\  \\</span>     Shell: bash 5.2.26
         <span class="cli-accent">/  /      \\  \\</span>    WM: Hyprland (Wayland)
        <span class="cli-accent">/_ /        \\ _\\</span>   Terminal: Web-TTY (JavaScript)
                           CPU: ESP32 &amp; Server Core-i5
                           RAM: 4.8 GiB / 16.0 GiB (30%)`,
        about: `<span class="cli-yellow">[Perfil de Ángel Noriega]</span>
Estudiante de Ingeniería en Informática con foco en SysAdmin, DevOps y redes.
Concibo el desarrollo como una vía para automatizar procesos locales y orquestar infraestructuras seguras.
Sistemas de cabecera: Arch Linux diario, entornos de terminal modular.`,
        projects: `<span class="cli-yellow">[Proyectos Destacados]</span>
  1. <span class="cli-accent">Fundación Bon Sens</span>  - Dockerizacion e infraestructura transaccional local.
  2. <span class="cli-accent">Punto de Venta</span>      - Backend e integración barcode USB.
  3. <span class="cli-accent">ClearDose (IoT)</span>     - Firmware C++ en ESP32 para telemetría hídrica.
  4. <span class="cli-accent">QRSend</span>              - Transmisor de datos TCP en Go por red local.
  5. <span class="cli-accent">Netscan</span>             - Auditor de red y escáner modular en Bash.`,
        skills: `<span class="cli-yellow">[Áreas de Especialidad]</span>
  - <span class="cli-accent">Administración</span>: Arch Linux, Bash scripting, Systemd, gestión TWM.
  - <span class="cli-accent">Cloud &amp; DevOps</span>: Docker, Compose, PostgreSQL, VPS deployments.
  - <span class="cli-accent">Seguridad</span>: Auditorías de puertos (Nmap), sockets de datos, auditorías UPnP.
  - <span class="cli-accent">IoT &amp; Backend</span>: C++ para microcontroladores, binarios Go, Django APIs.`,
        contact: `<span class="cli-yellow">[Canales de Comunicación]</span>
  - Correo Electrónico: <a href="mailto:4N63L@proton.me" class="cli-accent">4N63L@proton.me</a>
  - LinkedIn:           <a href="https://linkedin.com/in/angel-noriega-42b122373" target="_blank" class="cli-accent">linkedin.com/in/angel-noriega-42b122373</a>
  - GitHub:             <a href="https://github.com/Angelds-20" target="_blank" class="cli-accent">github.com/Angelds-20</a>`,
        sudo: `[sudo] password for angel: 
Sorry, try again.
Sorry, try again.
sudo: 3 incorrect password attempts`
    };

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const commandText = terminalInput.value.trim();
                const cleanCmd = commandText.toLowerCase();

                // Add prompt + input to history
                const promptLine = document.createElement('div');
                promptLine.className = 'terminal-line';
                promptLine.innerHTML = `<span class="terminal-prompt">angel@archlinux:~$</span> ${commandText}`;
                terminalHistory.appendChild(promptLine);

                if (cleanCmd !== '') {
                    const responseLine = document.createElement('div');
                    responseLine.className = 'terminal-line';

                    if (cleanCmd === 'clear') {
                        terminalHistory.innerHTML = '';
                    } else if (cleanCmd === 'uptime') {
                        responseLine.innerHTML = `Uptime del sistema: ${uptimeVal ? uptimeVal.textContent : 'Calculando...'}`;
                        terminalHistory.appendChild(responseLine);
                    } else if (commandResponses[cleanCmd]) {
                        responseLine.innerHTML = commandResponses[cleanCmd];
                        terminalHistory.appendChild(responseLine);
                    } else {
                        responseLine.innerHTML = `bash: comando no encontrado: <span class="cli-red">${commandText}</span>. Escribe <span class="cli-accent">help</span> para ver las opciones.`;
                        terminalHistory.appendChild(responseLine);
                    }
                }

                // Reset and scroll down
                terminalInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });
    }


    /* ==========================================================================
       TECHNICAL PROJECT MODAL (DRAWER) DATA
       ========================================================================== */
    const projectDetails = {
        bonsens: {
            stack: "Docker &bull; Compose &bull; PostgreSQL &bull; PHP",
            title: "Fundación Bon Sens",
            text: "Orquestación completa del ambiente local de desarrollo y simulación para la plataforma web transaccional. Implementa contenedores separados y securizados que garantizan la consistencia de los datos.",
            codeHeader: "docker-compose.yml (Estructura de Orquestación)",
            code: `version: '3.8'

services:
  # Servidor Web Apache + PHP
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

  # Motor de Base de Datos PostgreSQL
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
        pos: {
            stack: "Django &bull; React &bull; SQLite &bull; Python",
            title: "Punto de Venta e Inventarios",
            text: "El sistema incorpora validación rápida de stock y control de existencias críticas. Escucha señales directas de lectores barcode configurados en emulación de teclado USB.",
            codeHeader: "views.py (Django REST Framework - Stock Alert)",
            code: `# -*- coding: utf-8 -*-
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product

@api_view(['POST'])
def registrar_venta(request, product_id):
    producto = get_object_or_404(Product, pk=product_id)
    cantidad = int(request.data.get('cantidad', 1))
    
    # Comprobar niveles críticos antes de decrementar
    if producto.stock - cantidad <= producto.limite_critico:
        # Disparar alerta en dashboard / logs
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
        cleardose: {
            stack: "C++ (Arduino) &bull; Bluetooth &bull; ESP32 Interrupts",
            title: "Automatización de Caudal IoT",
            text: "Firmware desarrollado en C++ utilizando interrupciones por hardware en el pin digital conectado al sensor de flujo. Permite medir el volumen exacto de caudal en mililitros sin interrumpir los hilos de comunicación Bluetooth.",
            codeHeader: "flow_control.ino (ESP32 Interrupt & Solenoid Control)",
            code: `// Control de electroválvula mediante pulsos de caudalímetro
#include "BluetoothSerial.h"

BluetoothSerial ESP_BT;
const byte FLOW_PIN = 18;      // Pin de interrupción física
const byte RELAY_PIN = 19;     // Control del relé de la electroválvula
volatile long pulsoCount = 0;
long targetPulsos = 0;

void IRAM_ATTR countPulses() {
  pulsoCount++;
}

void setup() {
  pinMode(FLOW_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_PIN), countPulses, FALLING);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Electroválvula cerrada inicialmente
  
  ESP_BT.begin("ESP32_Caudal");
}

void loop() {
  if (ESP_BT.available()) {
    String cmd = ESP_BT.readStringUntil('\\n');
    if (cmd.startsWith("START:")) {
      long ml = cmd.substring(6).toInt();
      targetPulsos = ml * 2.25; // Factor de conversión a pulsos
      pulsoCount = 0;
      digitalWrite(RELAY_PIN, HIGH); // Abrir electroválvula
    }
  }
  
  // Cerrar la válvula si se alcanza el caudal
  if (targetPulsos > 0 && pulsoCount >= targetPulsos) {
    digitalWrite(RELAY_PIN, LOW); // Cerrar solenoide
    ESP_BT.println("STATUS:COMPLETE");
    targetPulsos = 0;
  }
}`
        },
        qrsend: {
            stack: "Go (Golang) &bull; WebSockets &bull; LAN Networking",
            title: "QRSend (Servidor LAN)",
            text: "Un servidor de red inalámbrico escrito en Go. Escucha conexiones TCP y actualiza el buffer de datos mediante conexiones WebSocket directas, logrando transferencias locales de alta velocidad.",
            codeHeader: "stream.go (Go HTTP WebSocket Upgrader)",
            code: `package main

import (
	"fmt"
	"net/http"
	"os"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024 * 64,
	WriteBufferSize: 1024 * 64,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func handleFileStream(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer conn.Close()

	file, _ := os.OpenFile("received_file", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	defer file.Close()

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			break
		}
		if messageType == websocket.BinaryMessage {
			// Escribir el buffer binario directo al archivo
			file.Write(p)
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
        document.body.style.overflow = 'hidden'; // Block background scroll
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    function escapeHTML(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Attach click listeners to all details buttons
    document.querySelectorAll('.card-detail-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const projId = btn.getAttribute('data-project');
            openModal(projId);
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    // Close modal clicking outside the container
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }


    /* ==========================================================================
       CONTACT FORM SUBMITTER (FormSubmit.co AJAX Integration)
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

            // Set loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            // Send AJAX request
            fetch('https://formsubmit.co/ajax/4N63L@proton.me', {
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
                formFeedback.textContent = 'Error al enviar por AJAX. Escribe directamente a 4N63L@proton.me';
                formFeedback.className = 'form-feedback error';
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            });
        });
    }
});
