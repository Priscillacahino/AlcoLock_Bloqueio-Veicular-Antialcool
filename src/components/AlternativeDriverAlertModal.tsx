import React, { useState } from 'react';
import {
  X,
  PhoneCall,
  Send,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Bluetooth,
  Key,
  Hash,
  ShieldCheck,
  UserCheck,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TrustedAlternativeDriver, DriverProfile } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trustedDriver: TrustedAlternativeDriver;
  currentBacReading: number;
  onNotifyDriver: () => void;
  onConfirmPresenceAndSwitchDriver: (newDriverProfile: DriverProfile) => void;
}

export const AlternativeDriverAlertModal: React.FC<Props> = ({
  isOpen,
  onClose,
  trustedDriver,
  currentBacReading,
  onNotifyDriver,
  onConfirmPresenceAndSwitchDriver,
}) => {
  const [activeStep, setActiveStep] = useState<'notify' | 'waiting' | 'presence_check' | 'alt_breath_test' | 'completed'>(
    trustedDriver.notificationStatus === 'accepted' ? 'presence_check' : 'notify'
  );
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isBleScanning, setIsBleScanning] = useState(false);
  const [bleDetected, setBleDetected] = useState(trustedDriver.isDeviceDetected);
  const [altTestProgress, setAltTestProgress] = useState(0);
  const [isAltTesting, setIsAltTesting] = useState(false);
  const [altTestPassed, setAltTestPassed] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (trustedDriver.notificationStatus === 'accepted') {
        setActiveStep('presence_check');
      } else {
        setActiveStep('notify');
      }
      setPinInput('');
      setPinError(false);
      setIsBleScanning(false);
      setAltTestProgress(0);
      setIsAltTesting(false);
      setAltTestPassed(false);
    }
  }, [isOpen, trustedDriver.notificationStatus]);

  if (!isOpen) return null;

  const handleSendNotification = () => {
    setActiveStep('waiting');
    onNotifyDriver();
  };

  const handleSimulateDriverAcceptance = () => {
    setActiveStep('presence_check');
  };

  const handleScanBle = () => {
    setIsBleScanning(true);
    setTimeout(() => {
      setIsBleScanning(false);
      setBleDetected(true);
    }, 1500);
  };

  const handleVerifyPin = () => {
    if (pinInput === trustedDriver.confirmationPin) {
      setPinError(false);
      setBleDetected(true);
    } else {
      setPinError(true);
    }
  };

  const handleStartAlternativeBreathTest = () => {
    setIsAltTesting(true);
    setAltTestProgress(0);
    const interval = setInterval(() => {
      setAltTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAltTesting(false);
          setAltTestPassed(true);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  const handleFinalizeHandover = () => {
    const newProfile: DriverProfile = {
      id: trustedDriver.id || 'alt-driver-01',
      name: trustedDriver.name,
      role: 'condutor_substituto',
      cnh: trustedDriver.cnh || '98471204938',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      lastTestBAC: 0.00,
      lastTestTimestamp: Date.now(),
      testPassed: true,
    };
    onConfirmPresenceAndSwitchDriver(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-800/80 text-amber-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white flex items-center gap-2">
                Sistema de Motorista Alternativo Confiável
                <span className="px-2 py-0.5 rounded text-[10px] bg-red-950/80 border border-red-800 text-red-400 font-mono">
                  IGNIÇÃO BLOQUEADA
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                O veículo só será liberado após a presença física e validação de {trustedDriver.name}
              </p>
            </div>
          </div>
          <button
            id="btn-close-alt-driver-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Progress Indicator */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800 grid grid-cols-3 gap-2 text-center text-[11px]">
          <div
            className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 ${
              activeStep === 'notify' || activeStep === 'waiting'
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>1. Notificação</span>
          </div>
          <div
            className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 ${
              activeStep === 'presence_check'
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>2. Presença no Veículo</span>
          </div>
          <div
            className={`py-1.5 px-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 ${
              activeStep === 'alt_breath_test' || activeStep === 'completed'
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <span>3. Bafômetro & Partida</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
          {/* STEP 1: NOTIFY TRUSTED DRIVER */}
          {activeStep === 'notify' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-red-200">
                    Álcool detectado ({currentBacReading.toFixed(2)} mg/L) — Partida Inibida
                  </p>
                  <p className="text-slate-300 text-[11px]">
                    Conforme protocolo de segurança veicular, o motorista atual não pode conduzir. Você possui um motorista alternativo cadastrado para assumir o controle com segurança.
                  </p>
                </div>
              </div>

              {/* Registered Driver Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Motorista de Confiança Cadastrado
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Habilitação Ativa
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-300 font-bold text-lg">
                    {trustedDriver.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{trustedDriver.name}</h4>
                    <p className="text-xs text-slate-400">{trustedDriver.relationship} • {trustedDriver.phone}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Bluetooth className="w-3 h-3 text-cyan-400" />
                      Dispositivo: {trustedDriver.pairedDeviceName}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Localização enviada via GPS:
                  </div>
                  <p className="text-slate-400 font-mono text-[10px]">
                    Lat: -23.550520, Long: -46.633308 (Av. Paulista, São Paulo - SP)
                  </p>
                </div>
              </div>

              {/* Action */}
              <button
                id="btn-send-notification-trusted"
                type="button"
                onClick={handleSendNotification}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Notificar {trustedDriver.name.split(' ')[0]} Agora (SMS + Push + GPS)</span>
              </button>
            </div>
          )}

          {/* STEP 1.5: WAITING / SIMULATED PHONE RECEIPT */}
          {activeStep === 'waiting' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-center space-y-1">
                <div className="inline-flex p-2 rounded-full bg-cyan-900/60 text-cyan-300 mb-1 animate-pulse">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-white">Notificação Enviada com Sucesso</h4>
                <p className="text-xs text-slate-300">
                  Um alerta sonoro prioritário com a localização e rota do veículo foi transmitido para o smartphone de {trustedDriver.name}.
                </p>
              </div>

              {/* Interactive Phone Screen Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-700 shadow-inner space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-mono flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    Telefone de {trustedDriver.name}
                  </span>
                  <span className="text-[10px] text-slate-400">Agora mesmo</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-amber-600/40 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4" />
                    ALERTA ALCOLOCK VEICULAR
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    "Olá {trustedDriver.name}! O veículo foi imobilizado devido a teste de álcool positivo do motorista. Como você é o(a) <strong>{trustedDriver.relationship}</strong> cadastrado(a), sua presença é solicitada para assumir o volante com segurança."
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Distância estimada: 2 min a pé</span>
                    <button
                      id="btn-simulate-driver-accept"
                      type="button"
                      onClick={handleSimulateDriverAcceptance}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition shadow"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{trustedDriver.name.split(' ')[0]}: "Estou a caminho / Cheguei"</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Aguardando aproximação do motorista alternativo...</span>
                <button
                  type="button"
                  onClick={() => setActiveStep('presence_check')}
                  className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>Avançar para confirmação de presença</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PRESENCE CONFIRMATION (DEVICE PAIRING / PIN / NFC) */}
          {activeStep === 'presence_check' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Etapa de Autenticação Obrigatória
                </span>
                <h4 className="text-sm font-bold text-white">
                  Confirmar Presença Física de {trustedDriver.name} no Banco
                </h4>
                <p className="text-xs text-slate-300">
                  O veículo exige confirmação de proximidade através do dispositivo BLE pareado ou do PIN de segurança de 4 dígitos.
                </p>
              </div>

              {/* Bluetooth / Key Detection Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bluetooth className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-white">
                      Sensor BLE de Proximidade do Banco
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      bleDetected
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {bleDetected ? 'DETECTADO NO BANCO' : 'PROCURANDO...'}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  Dispositivo pareado: <strong>{trustedDriver.pairedDeviceName}</strong> ({trustedDriver.deviceType === 'bluetooth_key' ? 'Chave BLE' : 'App Digital'})
                </p>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-scan-ble"
                    type="button"
                    onClick={handleScanBle}
                    disabled={isBleScanning}
                    className="flex-1 py-2 px-3 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Bluetooth className={`w-3.5 h-3.5 ${isBleScanning ? 'animate-spin' : ''}`} />
                    <span>{isBleScanning ? 'Escaneando RSSI...' : 'Detectar Proximidade da Chave'}</span>
                  </button>

                  <button
                    id="btn-instant-ble-detect"
                    type="button"
                    onClick={() => setBleDetected(true)}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer"
                  >
                    Simular Aproximação
                  </button>
                </div>
              </div>

              {/* Or PIN Verification */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-white">
                      Ou Digite o PIN de Confirmação ({trustedDriver.confirmationPin})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="input-presence-pin"
                    type="text"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="PIN de 4 dígitos"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white font-mono tracking-widest text-center w-36 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    id="btn-confirm-pin"
                    type="button"
                    onClick={handleVerifyPin}
                    className="py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
                  >
                    Validar PIN
                  </button>
                  {pinError && (
                    <span className="text-xs text-red-400 font-semibold">PIN Incorreto</span>
                  )}
                </div>
              </div>

              {/* Confirmation status and next step */}
              {bleDetected ? (
                <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Presença de {trustedDriver.name} Confirmada no Banco do Motorista!
                  </div>
                  <p className="text-[11px] text-slate-300">
                    O sensor biométrico detectou que {trustedDriver.name} assumiu o banco. Agora, deve realizar o sopro no bafômetro veicular para comprovar sobriedade (0.00 mg/L) e liberar a ignição.
                  </p>
                  <button
                    id="btn-proceed-to-breath-test"
                    type="button"
                    onClick={() => setActiveStep('alt_breath_test')}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow transition"
                  >
                    <span>Prosseguir para Teste de Bafômetro de {trustedDriver.name.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-center text-[11px] text-slate-400">
                  Aproxime o dispositivo pareado do banco do motorista ou insira o PIN para avançar.
                </p>
              )}
            </div>
          )}

          {/* STEP 3: BREATHALYZER TEST FOR ALTERNATIVE DRIVER */}
          {activeStep === 'alt_breath_test' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Validação de Sobriedade
                </span>
                <h4 className="text-sm font-bold text-white">
                  Teste de Bafômetro do Motorista Alternativo: {trustedDriver.name}
                </h4>
                <p className="text-xs text-slate-300">
                  Para que a partida do motor seja autorizada, o bafômetro no banco deve registrar 0.00 mg/L no ar alveolar.
                </p>
              </div>

              {/* Simulated breath test box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="space-y-1">
                  <div className="text-3xl font-mono font-bold text-emerald-400">
                    {altTestPassed ? '0.00 mg/L' : isAltTesting ? 'SOPRANDO...' : '0.00 mg/L'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Limite Seguro: <strong>0.00 mg/L</strong> (Tolerância Zero - Lei Seca)
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${altTestProgress}%` }}
                  />
                </div>

                {!altTestPassed ? (
                  <button
                    id="btn-alt-driver-blow"
                    type="button"
                    onClick={handleStartAlternativeBreathTest}
                    disabled={isAltTesting}
                    className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow transition"
                  >
                    <Sparkles className={`w-4 h-4 ${isAltTesting ? 'animate-spin' : ''}`} />
                    <span>{isAltTesting ? 'Analisando Fluxo de Ar Alveolar...' : `Executar Teste de Sopro de ${trustedDriver.name.split(' ')[0]}`}</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Teste Aprovado! Sobriedade Verificada com Sucesso (0.00 mg/L).</span>
                    </div>

                    <button
                      id="btn-finalize-handover-ignite"
                      type="button"
                      onClick={handleFinalizeHandover}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950 transition"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Assumir Volante & Habilitar Ignição do Carro</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
