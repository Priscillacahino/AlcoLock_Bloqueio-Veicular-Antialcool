import React from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { InstrumentCluster } from './components/InstrumentCluster';
import { IgnitionButton } from './components/IgnitionButton';
import { DriverSeatStatus } from './components/DriverSeatStatus';
import { AlcoholTestPanel } from './components/AlcoholTestPanel';
import { SmartSteeringWheel } from './components/SmartSteeringWheel';
import { DriverReplacementModal } from './components/DriverReplacementModal';
import { TelemetryLogModal } from './components/TelemetryLogModal';
import { EmergencyRideModal } from './components/EmergencyRideModal';
import { TechnicalSpecsModal } from './components/TechnicalSpecsModal';
import { RegisterTrustedDriverModal } from './components/RegisterTrustedDriverModal';
import { AlternativeDriverAlertModal } from './components/AlternativeDriverAlertModal';
import { soundEffects } from './services/audioService';
import { DriverProfile, IgnitionState, SeatSensors, TelemetryLog, VehicleTelemetry, TrustedAlternativeDriver, DetectionMethod } from './types';
import { ShieldCheck, ShieldAlert, AlertTriangle, BookOpen, RotateCcw, UserCheck, BellRing, Hand, Wind, Sliders } from 'lucide-react';

const INITIAL_DRIVER: DriverProfile = {
  id: 'driver-carlos',
  name: 'Carlos Mendes',
  role: 'condutor_inicial',
  cnh: '04829103942',
  lastTestBAC: null,
  testPassed: null,
  detectionMethodUsed: 'TOUCH_PALM_STEERING',
};

const INITIAL_TRUSTED_DRIVER: TrustedAlternativeDriver = {
  id: 'alt-driver-mariana',
  name: 'Mariana Silva',
  phone: '+55 (11) 98765-4321',
  relationship: 'Cônjuge / Amiga da Rodada',
  cnh: '98471204938',
  pairedDeviceId: 'BLE-DEV-4A8F',
  pairedDeviceName: 'iPhone 15 Pro de Mariana (BLE)',
  deviceType: 'bluetooth_key',
  confirmationPin: '2489',
  isDeviceDetected: false,
  notificationStatus: 'idle',
  presenceConfirmed: false,
};

const INITIAL_LOGS: TelemetryLog[] = [
  {
    id: 'log-1',
    timestamp: Date.now() - 1000 * 60 * 5,
    eventType: 'SEAT_OCCUPIED',
    driverName: 'Carlos Mendes',
    details: 'Sensor de peso do banco do motorista detectou condutor (72 kg). Cinto acionado.',
    vehicleStatus: 'OFF',
  },
];

export default function App() {
  const [ignitionState, setIgnitionState] = React.useState<IgnitionState>('OFF');
  const [currentDriver, setCurrentDriver] = React.useState<DriverProfile>(INITIAL_DRIVER);
  const [trustedDriver, setTrustedDriver] = React.useState<TrustedAlternativeDriver>(() => {
    try {
      const saved = localStorage.getItem('alcolock_trusted_driver');
      return saved ? JSON.parse(saved) : INITIAL_TRUSTED_DRIVER;
    } catch {
      return INITIAL_TRUSTED_DRIVER;
    }
  });
  const [selectedMethod, setSelectedMethod] = React.useState<DetectionMethod>('TOUCH_PALM_STEERING');
  const [safeThreshold, setSafeThreshold] = React.useState<number>(0.00);

  const [seatSensors, setSeatSensors] = React.useState<SeatSensors>({
    seatOccupied: true,
    seatbeltFastened: true,
    handsOnSteeringWheel: true,
    cameraFaceDetected: true,
    palmOpticalContact: true,
  });

  const [telemetry, setTelemetry] = React.useState<VehicleTelemetry>({
    speedKmh: 0,
    rpm: 0,
    gear: 'P',
    fuelPercent: 85,
    batteryVolts: 12.6,
    coolantTempC: 88,
  });

  const [lastBAC, setLastBAC] = React.useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);
  const [logs, setLogs] = React.useState<TelemetryLog[]>(() => {
    try {
      const saved = localStorage.getItem('alcolock_telemetry_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  // Modals
  const [isReplacementModalOpen, setIsReplacementModalOpen] = React.useState<boolean>(false);
  const [isRegisterDriverModalOpen, setIsRegisterDriverModalOpen] = React.useState<boolean>(false);
  const [isAltDriverAlertModalOpen, setIsAltDriverAlertModalOpen] = React.useState<boolean>(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = React.useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = React.useState<boolean>(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = React.useState<boolean>(false);

  // Test animation
  const [isTesting, setIsTesting] = React.useState<boolean>(false);
  const [testProgress, setTestProgress] = React.useState<number>(0);

  // Save logs & trusted driver
  React.useEffect(() => {
    try {
      localStorage.setItem('alcolock_telemetry_logs', JSON.stringify(logs));
    } catch {
      // Storage safety
    }
  }, [logs]);

  React.useEffect(() => {
    try {
      localStorage.setItem('alcolock_trusted_driver', JSON.stringify(trustedDriver));
    } catch {
      // Storage safety
    }
  }, [trustedDriver]);

  // Telemetry loop when engine is running
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (ignitionState === 'RUNNING') {
      interval = setInterval(() => {
        // Subtle engine idle RPM oscillation (810 - 835 RPM)
        const jitter = Math.floor(Math.random() * 25) - 12;
        setTelemetry((prev) => ({
          ...prev,
          rpm: Math.max(780, Math.min(900, 820 + jitter)),
          batteryVolts: 14.1 + Math.random() * 0.2, // Alternator charging voltage
        }));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [ignitionState]);

  // Helper to add log
  const addLog = (
    eventType: TelemetryLog['eventType'],
    details: string,
    bacReading?: number
  ) => {
    const newLog: TelemetryLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      eventType,
      driverName: currentDriver.name,
      bacReading,
      details,
      vehicleStatus: ignitionState,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Perform Alcohol Test on the Driver's Seat
  const executeAlcoholTest = (targetBAC: number, method?: DetectionMethod) => {
    if (ignitionState === 'RUNNING') return;

    const activeMethod = method || selectedMethod;
    if (method && method !== selectedMethod) {
      setSelectedMethod(method);
    }

    setIsTesting(true);
    setTestProgress(0);
    setIgnitionState('TESTING');

    if (activeMethod === 'TOUCH_PALM_STEERING') {
      addLog(
        'PALM_SCAN_STARTED',
        `Iniciando leitura óptica NIR na palma da mão (1450 nm & 1680 nm). Verificando perfusão capilar dérmica e peso no assento (72 kg)...`
      );
      if (soundEnabled) {
        soundEffects.playRelayClick();
      }
    } else {
      if (soundEnabled) {
        soundEffects.playBreathAirflow();
      }
    }

    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishTest(targetBAC, activeMethod);
          return 100;
        }
        return prev + 20;
      });
    }, 250);
  };

  const finishTest = (bac: number, methodUsed: DetectionMethod = selectedMethod) => {
    setIsTesting(false);
    setLastBAC(bac);

    const isSober = bac <= safeThreshold;

    setCurrentDriver((prev) => ({
      ...prev,
      lastTestBAC: bac,
      lastTestTimestamp: Date.now(),
      testPassed: isSober,
      detectionMethodUsed: methodUsed,
    }));

    if (isSober) {
      setIgnitionState('UNLOCKED_READY');
      if (soundEnabled) {
        soundEffects.playUnlockChime();
      }
      if (methodUsed === 'TOUCH_PALM_STEERING') {
        addLog(
          'PALM_SCAN_PASSED',
          `DUPLA VALIDAÇÃO APROVADA: Banco do motorista ocupado + Leitura óptica da palma da mão limpa (0,00 g/L). Partida autorizada sem necessidade de sopro!`,
          bac
        );
      } else {
        addLog('TEST_PASSED', `Teste de sobriedade aprovado (${bac.toFixed(2)} mg/L). Partida autorizada.`, bac);
      }
    } else {
      setIgnitionState('LOCKED');
      if (soundEnabled) {
        soundEffects.playLockoutAlarm();
      }
      if (methodUsed === 'TOUCH_PALM_STEERING') {
        addLog(
          'PALM_SCAN_FAILED_LOCKED',
          `BLOQUEIO DADSS NO VOLANTE: Etanol detectado nos vasos capilares da palma (${bac.toFixed(2)} g/L). Corte elétrico da partida acionado. Sugira um condutor substituto.`,
          bac
        );
      } else {
        addLog(
          'TEST_FAILED_LOCKED',
          `BLOQUEIO DE PARTIDA: Teor de álcool detectado (${bac.toFixed(2)} mg/L) acima da tolerância (${safeThreshold.toFixed(2)} mg/L). Ignição desabilitada até substituição por condutor que não tenha ingerido álcool.`,
          bac
        );
      }
      // Automatically prompt the alternative driver notification modal
      setIsAltDriverAlertModalOpen(true);
    }
  };

  // Start Engine Action
  const handlePressStart = () => {
    if (ignitionState !== 'UNLOCKED_READY') return;

    setIgnitionState('STARTING');
    if (soundEnabled) {
      soundEffects.playStarterIgnition();
    }

    setTimeout(() => {
      setIgnitionState('RUNNING');
      setTelemetry((prev) => ({
        ...prev,
        rpm: 820,
        batteryVolts: 14.2,
      }));
      if (soundEnabled) {
        soundEffects.startEngineIdleSound();
      }
      addLog('IGNITION_START', `Motor ligado com sucesso pelo condutor sóbrio ${currentDriver.name}.`);
    }, 1400);
  };

  // Stop Engine Action
  const handlePressStop = () => {
    if (ignitionState !== 'RUNNING') return;

    if (soundEnabled) {
      soundEffects.stopEngineIdleSound();
      soundEffects.playRelayClick();
    }

    setIgnitionState('UNLOCKED_READY');
    setTelemetry((prev) => ({
      ...prev,
      rpm: 0,
      speedKmh: 0,
      batteryVolts: 12.6,
    }));
    addLog('IGNITION_STOP', `Motor desligado.`);
  };

  // Pressing ignition while locked
  const handlePressWhenLocked = () => {
    if (soundEnabled) {
      soundEffects.playRelayClick();
      soundEffects.playLockoutAlarm();
    }
    addLog('TEST_FAILED_LOCKED', `Tentativa de partida impedida. Condutor sob efeito de álcool. Ignição bloqueada.`);
    setIsAltDriverAlertModalOpen(true);
  };

  // Pressing ignition while pending
  const handlePressWhenPendingTest = () => {
    if (soundEnabled) {
      soundEffects.playBeep(440, 0.1);
    }
    executeAlcoholTest(0.28);
  };

  // Trusted Alternative Driver Handlers
  const handleSaveTrustedDriver = (updated: TrustedAlternativeDriver) => {
    setTrustedDriver(updated);
    addLog(
      'TRUSTED_DRIVER_REGISTERED',
      `Motorista alternativo de confiança cadastrado: ${updated.name} (${updated.relationship}, Tel: ${updated.phone}, Dispositivo: ${updated.pairedDeviceName}, PIN: ${updated.confirmationPin}).`
    );
  };

  const handleNotifyTrustedDriver = () => {
    setTrustedDriver((prev) => ({
      ...prev,
      notificationStatus: 'sent',
      lastNotifiedAt: Date.now(),
    }));
    if (soundEnabled) {
      soundEffects.playBeep(880, 0.2);
    }
    addLog(
      'ALTERNATIVE_DRIVER_NOTIFIED',
      `Alerta de emergência e rota GPS transmitidos para motorista alternativo cadastrado: ${trustedDriver.name} (${trustedDriver.phone}).`
    );
  };

  const handleConfirmPresenceAndSwitchDriver = (newDriverProfile: DriverProfile) => {
    setTrustedDriver((prev) => ({
      ...prev,
      notificationStatus: 'accepted',
      presenceConfirmed: true,
      isDeviceDetected: true,
    }));
    setCurrentDriver(newDriverProfile);
    setLastBAC(0.00);
    setIgnitionState('UNLOCKED_READY');
    if (soundEnabled) {
      soundEffects.playUnlockChime();
    }
    addLog(
      'ALTERNATIVE_DRIVER_CONFIRMED',
      `Presença de ${newDriverProfile.name} confirmada no banco via pareamento BLE/PIN. Bafômetro comprovou sobriedade (0,00 mg/L). Ignição autorizada!`
    );
    setIsAltDriverAlertModalOpen(false);
  };

  // Generic Replacement Confirmation Flow
  const handleConfirmReplacement = (newDriver: DriverProfile) => {
    setCurrentDriver(newDriver);
    setLastBAC(newDriver.lastTestBAC);

    if (newDriver.lastTestBAC === 0) {
      setIgnitionState('UNLOCKED_READY');
      if (soundEnabled) {
        soundEffects.playUnlockChime();
      }
      addLog(
        'DRIVER_REPLACED',
        `Substituição efetuada com sucesso: ${newDriver.name} assumiu o banco do motorista e comprovou sobriedade (0,00 mg/L). Partida liberada!`,
        0.00
      );
    } else {
      setIgnitionState('LOCKED');
      if (soundEnabled) {
        soundEffects.playLockoutAlarm();
      }
      addLog(
        'DRIVER_REPLACED',
        `Tentativa de substituição rejeitada: ${newDriver.name} também reprovou no teste de álcool (${newDriver.lastTestBAC?.toFixed(2)} mg/L). Veículo permanece bloqueado.`,
        newDriver.lastTestBAC || 0.35
      );
    }
  };

  // Reset entire simulation to initial state
  const handleResetSystem = () => {
    if (soundEnabled) {
      soundEffects.stopEngineIdleSound();
      soundEffects.playRelayClick();
    }
    setIgnitionState('OFF');
    setCurrentDriver(INITIAL_DRIVER);
    setLastBAC(null);
    setTelemetry({
      speedKmh: 0,
      rpm: 0,
      gear: 'P',
      fuelPercent: 85,
      batteryVolts: 12.6,
      coolantTempC: 88,
    });
    setTrustedDriver((prev) => ({
      ...prev,
      notificationStatus: 'idle',
      presenceConfirmed: false,
      isDeviceDetected: false,
    }));
    addLog('SEAT_OCCUPIED', 'Sistema reinicializado em estado de espera no banco do motorista.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Cockpit Header */}
      <DashboardHeader
        ignitionState={ignitionState}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenLogs={() => setIsLogsModalOpen(true)}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        driverName={currentDriver.name}
        trustedDriverName={trustedDriver.name}
        onOpenRegisterTrustedDriver={() => setIsRegisterDriverModalOpen(true)}
      />

      {/* Main Automotive Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Critical Alert Banner if Car is Locked */}
        {ignitionState === 'LOCKED' && (
          <div className="w-full p-4 rounded-xl bg-gradient-to-r from-rose-950/95 via-rose-900/70 to-slate-950 border-2 border-rose-600 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 animate-pulse shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-rose-300 uppercase tracking-wide">
                  BLOQUEIO VEICULAR ATIVO: INGESTÃO DE ÁLCOOL CONSTATADA NO BANCO DO MOTORISTA
                </h2>
                <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                  <strong>O carro não pode ser ligado devido à detecção de álcool no motorista ({currentDriver.name}).</strong> Sugerimos providenciar um motorista alternativo para conduzir o veículo. O carro permanecerá bloqueado até que o condutor seja substituído por outro sem álcool.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto">
              <button
                id="btn-banner-notify-trusted"
                type="button"
                onClick={() => setIsAltDriverAlertModalOpen(true)}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950 transition cursor-pointer"
              >
                <BellRing className="w-4 h-4" />
                <span>Notificar {trustedDriver.name.split(' ')[0]} (Motorista Confiável)</span>
              </button>

              <button
                id="btn-banner-replace-driver"
                type="button"
                onClick={() => setIsReplacementModalOpen(true)}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-lg bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg shadow-cyan-950"
              >
                Substituir Manualmente
              </button>
            </div>
          </div>
        )}

        {/* 1. Digital Instrument Cluster (HUD & Gauges) */}
        <InstrumentCluster
          ignitionState={ignitionState}
          telemetry={telemetry}
          lastBAC={lastBAC}
          driverName={currentDriver.name}
          onOpenDriverReplacement={() => setIsReplacementModalOpen(true)}
          onTriggerTest={() => executeAlcoholTest(0.28)}
        />

        {/* 2. Lower Cockpit Operations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Driver Seat & Hardware Status */}
          <div className="lg:col-span-4 space-y-4">
            <DriverSeatStatus
              currentDriver={currentDriver}
              ignitionState={ignitionState}
              seatSensors={seatSensors}
              onOpenDriverReplacement={() => setIsReplacementModalOpen(true)}
              onToggleSeatbelt={() =>
                setSeatSensors((prev) => ({
                  ...prev,
                  seatbeltFastened: !prev.seatbeltFastened,
                }))
              }
              trustedDriver={trustedDriver}
              onOpenAlertModal={() => setIsAltDriverAlertModalOpen(true)}
              onOpenRegisterTrustedDriver={() => setIsRegisterDriverModalOpen(true)}
            />

            {/* How it works button */}
            <button
              id="btn-open-specs"
              type="button"
              onClick={() => setIsSpecsModalOpen(true)}
              className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-xs text-slate-300 flex items-center justify-between transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">Arquitetura de Instalação no Carro</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Detalhes Técnicos &rarr;</span>
            </button>
          </div>

          {/* Center Column: Smart Steering Wheel / Physical Console Ignition Button */}
          <div className="lg:col-span-4 space-y-4">
            {/* Center View Selector Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                id="tab-center-steering"
                type="button"
                onClick={() => setSelectedMethod('TOUCH_PALM_STEERING')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedMethod === 'TOUCH_PALM_STEERING'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Hand className="w-3.5 h-3.5" />
                <span>Volante Óptico (DADSS)</span>
              </button>
              <button
                id="tab-center-ignition"
                type="button"
                onClick={() => setSelectedMethod('TOUCH_START_BUTTON')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  selectedMethod === 'TOUCH_START_BUTTON'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Botão Start / Stop</span>
              </button>
            </div>

            {selectedMethod === 'TOUCH_PALM_STEERING' ? (
              <SmartSteeringWheel
                ignitionState={ignitionState}
                seatOccupied={seatSensors.seatOccupied}
                palmContact={seatSensors.palmOpticalContact ?? true}
                isTesting={isTesting}
                testProgress={testProgress}
                lastBAC={lastBAC}
                onExecuteScan={(bac) => executeAlcoholTest(bac, 'TOUCH_PALM_STEERING')}
                onStartEngine={handlePressStart}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-xl min-h-[360px]">
                <IgnitionButton
                  ignitionState={ignitionState}
                  onPressStart={handlePressStart}
                  onPressStop={handlePressStop}
                  onPressWhenLocked={handlePressWhenLocked}
                  onPressWhenPendingTest={handlePressWhenPendingTest}
                />

                <div className="mt-6 text-center max-w-xs text-xs">
                  {ignitionState === 'LOCKED' ? (
                    <div className="text-rose-400 font-bold flex items-center justify-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>Corte elétrico da partida ativo pela ECU</span>
                    </div>
                  ) : ignitionState === 'UNLOCKED_READY' ? (
                    <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Relé liberado: Toque no botão para ligar o motor</span>
                    </div>
                  ) : ignitionState === 'RUNNING' ? (
                    <div className="text-cyan-300 font-bold">
                      Motor girando em 820 RPM • Alternador 14.2V
                    </div>
                  ) : (
                    <div className="text-slate-400">
                      Sensor no assento ativo (72 kg). Toque o anel óptico ou segure o volante para validar sobriedade.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: In-Seat Breathalyzer & Sensor Suite Simulator */}
          <div className="lg:col-span-4 space-y-4">
            <AlcoholTestPanel
              ignitionState={ignitionState}
              onExecuteTest={(bac) => executeAlcoholTest(bac, selectedMethod)}
              isTesting={isTesting}
              testProgress={testProgress}
              lastBAC={lastBAC}
              trustedDriver={trustedDriver}
              onOpenRegisterTrustedDriver={() => setIsRegisterDriverModalOpen(true)}
              onOpenAlertModal={() => setIsAltDriverAlertModalOpen(true)}
              safeThreshold={safeThreshold}
              onSetSafeThreshold={setSafeThreshold}
              selectedMethod={selectedMethod}
              onSelectMethod={setSelectedMethod}
            />
          </div>
        </div>

        {/* Footer Quick Reset & Compliance Note */}
        <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Em conformidade com a Lei 11.705 (Lei Seca) e normas automotivas Alcolock EN 50436.</span>
          </div>

          <button
            id="btn-reset-simulation"
            type="button"
            onClick={handleResetSystem}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Simulação</span>
          </button>
        </div>
      </main>

      {/* Modals */}
      <RegisterTrustedDriverModal
        isOpen={isRegisterDriverModalOpen}
        onClose={() => setIsRegisterDriverModalOpen(false)}
        trustedDriver={trustedDriver}
        onSave={handleSaveTrustedDriver}
      />

      <AlternativeDriverAlertModal
        isOpen={isAltDriverAlertModalOpen}
        onClose={() => setIsAltDriverAlertModalOpen(false)}
        trustedDriver={trustedDriver}
        currentBacReading={lastBAC ?? 0.28}
        onNotifyDriver={handleNotifyTrustedDriver}
        onConfirmPresenceAndSwitchDriver={handleConfirmPresenceAndSwitchDriver}
      />

      <DriverReplacementModal
        isOpen={isReplacementModalOpen}
        onClose={() => setIsReplacementModalOpen(false)}
        currentDriver={currentDriver}
        onConfirmReplacement={handleConfirmReplacement}
      />

      <TelemetryLogModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      <EmergencyRideModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        driverName={currentDriver.name}
      />

      <TechnicalSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />
    </div>
  );
}
