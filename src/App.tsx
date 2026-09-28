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
import { DriverProfile, IgnitionState, SeatSensors, TelemetryLog, VehicleTelemetry, TrustedAlternativeDriver, DetectionMethod, ValidationStatus } from './types';
import { ShieldCheck, ShieldAlert, AlertTriangle, BookOpen, RotateCcw, UserCheck, BellRing, Hand, Wind, Sliders } from 'lucide-react';

const INITIAL_DRIVER: DriverProfile = {
  id: 'driver-carlos',
  name: 'Carlos Mendes',
  role: 'condutor_inicial',
  cnh: 'DEMO-CNH-001',
  lastTestBAC: null,
  testPassed: null,
  detectionMethodUsed: 'TOUCH_PALM_STEERING',
};

const INITIAL_TRUSTED_DRIVER: TrustedAlternativeDriver = {
  id: 'alt-driver-mariana',
  name: 'Mariana Silva',
  phone: '+55 (83) 90000-0000',
  relationship: 'Cônjuge / Amiga da Rodada',
  cnh: 'DEMO-CNH-002',
  pairedDeviceId: 'DEMO-BLE-001',
  pairedDeviceName: 'Dispositivo de demonstração (BLE)',
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
  const [trustedDriver, setTrustedDriver] = React.useState<TrustedAlternativeDriver>(INITIAL_TRUSTED_DRIVER);
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
  const [logs, setLogs] = React.useState<TelemetryLog[]>(INITIAL_LOGS);
  const [validationStatus, setValidationStatus] = React.useState<ValidationStatus>('PENDING');

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

  // Dados pessoais e logs permanecem apenas na sessão atual deste protótipo.

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

  // Helper to add log. O nome pode ser informado explicitamente para evitar
  // registrar o motorista anterior logo após uma troca de estado do React.
  const addLog = (
    eventType: TelemetryLog['eventType'],
    details: string,
    bacReading?: number,
    driverName: string = currentDriver.name
  ) => {
    const newLog: TelemetryLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      eventType,
      driverName,
      bacReading,
      details,
      vehicleStatus: ignitionState,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const formatSimulatedReading = (value: number, method: DetectionMethod) =>
    method === 'BREATHALYZER'
      ? `${value.toFixed(2)} mg/L (simulado)`
      : `${value.toFixed(2)} índice simulado`;

  // Perform Alcohol Test on the Driver's Seat
  const executeAlcoholTest = (targetBAC: number, method?: DetectionMethod) => {
    if (ignitionState === 'RUNNING') return;

    const activeMethod = method || selectedMethod;
    if (method && method !== selectedMethod) {
      setSelectedMethod(method);
    }

    setIsTesting(true);
    setTestProgress(0);
    setValidationStatus('TESTING');
    setIgnitionState('TESTING');

    if (activeMethod === 'TOUCH_PALM_STEERING') {
      addLog(
        'PALM_SCAN_STARTED',
        `Iniciando simulação de leitura óptica por toque inspirada em pesquisa de espectroscopia de tecido. Nenhum sensor físico real está conectado.`
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
    setValidationStatus(isSober ? 'APPROVED' : 'NOT_APPROVED');

    setCurrentDriver((prev) => ({
      ...prev,
      lastTestBAC: bac,
      lastTestTimestamp: Date.now(),
      testPassed: isSober,
      detectionMethodUsed: methodUsed,
    }));

    if (isSober) {
      setIgnitionState('UNLOCKED_READY');
      setValidationStatus('APPROVED');
      if (soundEnabled) {
        soundEffects.playUnlockChime();
      }
      if (methodUsed === 'TOUCH_PALM_STEERING') {
        addLog(
          'PALM_SCAN_PASSED',
          `SIMULAÇÃO APROVADA: banco ocupado + leitura por toque dentro do limite configurado (${formatSimulatedReading(bac, methodUsed)}). Partida simulada autorizada.`,
          bac
        );
      } else {
        addLog('TEST_PASSED', `Validação simulada aprovada (${formatSimulatedReading(bac, methodUsed)}). Partida simulada autorizada.`, bac);
      }
    } else {
      setIgnitionState('LOCKED');
      setValidationStatus('NOT_APPROVED');
      if (soundEnabled) {
        soundEffects.playLockoutAlarm();
      }
      if (methodUsed === 'TOUCH_PALM_STEERING') {
        addLog(
          'PALM_SCAN_FAILED_LOCKED',
          `SIMULAÇÃO NÃO APROVADA: leitura por toque acima do limite configurado (${formatSimulatedReading(bac, methodUsed)}). Partida simulada mantida bloqueada; sugerir condutor substituto.`,
          bac
        );
      } else {
        addLog(
          'TEST_FAILED_LOCKED',
          `SIMULAÇÃO NÃO APROVADA: leitura (${formatSimulatedReading(bac, methodUsed)}) acima do limite configurado (${safeThreshold.toFixed(2)}). Partida simulada bloqueada até nova validação.`,
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
    addLog('TEST_FAILED_LOCKED', `Tentativa de partida simulada impedida após validação não aprovada. Nenhuma conclusão clínica é feita pelo protótipo.`);
    setIsAltDriverAlertModalOpen(true);
  };

  // Pressing ignition while pending
  const handlePressWhenPendingTest = () => {
    if (soundEnabled) {
      soundEffects.playBeep(440, 0.1);
    }
    executeAlcoholTest(0.28);
  };

  const handleNonConclusiveResult = (status: 'INCONCLUSIVE' | 'SENSOR_UNAVAILABLE') => {
    setIsTesting(false);
    setTestProgress(0);
    setLastBAC(null);
    setIgnitionState('OFF');
    setValidationStatus(status);
    setCurrentDriver((prev) => ({
      ...prev,
      lastTestBAC: null,
      lastTestTimestamp: Date.now(),
      testPassed: null,
    }));
    addLog(
      status === 'INCONCLUSIVE' ? 'TEST_INCONCLUSIVE' : 'SENSOR_UNAVAILABLE',
      status === 'INCONCLUSIVE'
        ? 'Resultado inconclusivo na simulação. A partida permanece indisponível até uma nova validação.'
        : 'Sensor indisponível na simulação. A partida permanece indisponível até restabelecimento e nova validação.'
    );
  };
  // Trusted Alternative Driver Handlers
  const handleSaveTrustedDriver = (updated: TrustedAlternativeDriver) => {
    setTrustedDriver(updated);
    addLog(
      'TRUSTED_DRIVER_REGISTERED',
      `Cadastro de motorista alternativo atualizado. Telefone, CNH, dispositivo e PIN foram omitidos do log.`
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
      `Notificação simulada enviada ao motorista alternativo cadastrado. Dados de contato e localização foram omitidos do log.`
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
    setLastBAC(newDriverProfile.lastTestBAC);
    setValidationStatus(newDriverProfile.testPassed === true ? 'APPROVED' : 'PENDING');
    setIgnitionState(newDriverProfile.testPassed === true ? 'UNLOCKED_READY' : 'OFF');
    if (soundEnabled) {
      soundEffects.playUnlockChime();
    }
    addLog(
      'ALTERNATIVE_DRIVER_CONFIRMED',
      `Presença e validação simuladas concluídas para o motorista substituto. ${newDriverProfile.testPassed ? 'Partida simulada autorizada.' : 'Nova validação necessária.'}`,
      newDriverProfile.lastTestBAC ?? undefined,
      newDriverProfile.name
    );
    setIsAltDriverAlertModalOpen(false);
  };

  // Generic Replacement Confirmation Flow
  const handleConfirmReplacement = (newDriver: DriverProfile) => {
    setCurrentDriver(newDriver);
    setLastBAC(newDriver.lastTestBAC);

    if (newDriver.lastTestBAC === 0) {
      setIgnitionState('UNLOCKED_READY');
      setValidationStatus('APPROVED');
      if (soundEnabled) {
        soundEffects.playUnlockChime();
      }
      addLog(
        'DRIVER_REPLACED',
        `Substituição concluída: novo condutor realizou validação simulada aprovada. Partida simulada liberada.`,
        0.00,
        newDriver.name
      );
    } else {
      setIgnitionState('LOCKED');
      setValidationStatus('NOT_APPROVED');
      if (soundEnabled) {
        soundEffects.playLockoutAlarm();
      }
      addLog(
        'DRIVER_REPLACED',
        `Substituição não liberada: a validação simulada do novo condutor não foi aprovada. Veículo permanece bloqueado.`,
        newDriver.lastTestBAC || 0.35,
        newDriver.name
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
    setValidationStatus('PENDING');
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
                  BLOQUEIO PREVENTIVO SIMULADO: VALIDAÇÃO NÃO APROVADA
                </h2>
                <p className="text-xs text-rose-200 mt-1 leading-relaxed">
                  <strong>A partida simulada está bloqueada após uma leitura acima do limite configurado para {currentDriver.name}.</strong> O protótipo não realiza diagnóstico clínico nem comprovação legal. Uma nova validação ou um motorista alternativo pode prosseguir no fluxo.
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
                <span>Volante Óptico (conceito)</span>
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
                      <span>Bloqueio de partida ativo na simulação</span>
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
                      Sensor de assento simulado ativo. Use o toque ou o bafômetro para executar uma validação demonstrativa.
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
              validationStatus={validationStatus}
              onSimulateNonConclusive={handleNonConclusiveResult}
            />
          </div>
        </div>

        {/* Footer Quick Reset & Compliance Note */}
        <div className="pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Protótipo acadêmico: referências legais e técnicas são informativas e não representam homologação ou conformidade certificada.</span>
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
