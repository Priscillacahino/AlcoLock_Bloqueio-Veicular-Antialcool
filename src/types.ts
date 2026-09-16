export type IgnitionState =
  | 'OFF'             // Desligado, aguardando teste obrigatório
  | 'TESTING'         // Testando amostra alveolar / biometria
  | 'LOCKED'          // Bloqueio de partida ativo - Álcool detectado!
  | 'UNLOCKED_READY'  // Teste aprovado 0.00 mg/L - Pronto para ligar
  | 'STARTING'        // Acionando motor de arranque
  | 'RUNNING';        // Motor em funcionamento

export type DetectionMethod =
  | 'TOUCH_PALM_STEERING' // Leitura óptica no volante pela palma da mão (DADSS NIR)
  | 'TOUCH_START_BUTTON'  // Leitura óptica no botão Start/Stop
  | 'BREATHALYZER';       // Bafômetro convencional por ar alveolar

export interface PalmScanDetails {
  wavelengthNm: number;             // Espectroscopia de Infravermelho Próximo (ex: 1450nm)
  capillaryPerfusionDetected: boolean; // Confirmação de tecido vivo com fluxo sanguíneo (anti-fraude)
  tissueAlcoholReading: number;     // Concentração estimada no sangue capilar (g/L ou mg/L)
  skinContactQuality: 'EXCELLENT' | 'GOOD' | 'POOR';
  contactLocation: 'STEERING_WHEEL' | 'START_BUTTON';
  dualValidationOk: boolean;        // Validação cruzada: Banco Ocupado + Palma no Sensor
}

export interface DriverProfile {
  id: string;
  name: string;
  role: 'condutor_inicial' | 'condutor_substituto';
  cnh: string;
  avatarUrl?: string;
  lastTestBAC: number | null; // mg/L ou g/L
  lastTestTimestamp?: number;
  testPassed: boolean | null;
  detectionMethodUsed?: DetectionMethod;
}

export interface SeatSensors {
  seatOccupied: boolean;      // Sensor piezoelétrico de peso no assento (40kg+)
  seatbeltFastened: boolean;  // Sensor de fecho do cinto de segurança
  handsOnSteeringWheel: boolean; // Sensor capacitivo e óptico de palma no volante
  cameraFaceDetected: boolean;  // Câmera do painel focada no motorista
  palmOpticalContact: boolean;  // Contato firme da palma da mão sobre os sensores infravermelhos
}

export interface AlcoholTestResult {
  bac: number;                 // em mg/L (miligramas de álcool por litro de ar alveolar)
  timestamp: number;
  passed: boolean;
  statusText: string;
  severity: 'safe' | 'low_risk' | 'infraction' | 'severe_crime';
  sensorBreakdown: {
    breathAir: number;         // sensor de fluxo de ar no volante/coluna
    dermalInfrared: number;    // sensor óptico dérmico na palma (DADSS)
    facialBiometricScore: number; // 0-100% de probabilidade de sobriedade
  };
}

export interface TrustedAlternativeDriver {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  cnh: string;
  pairedDeviceId: string;
  pairedDeviceName: string;
  deviceType: 'bluetooth_key' | 'nfc_token' | 'smartphone_app';
  confirmationPin: string;
  isDeviceDetected: boolean;
  notificationStatus: 'idle' | 'sending' | 'sent' | 'accepted' | 'declined';
  lastNotifiedAt?: number;
  presenceConfirmed: boolean;
}

export interface TelemetryLog {
  id: string;
  timestamp: number;
  eventType:
    | 'SEAT_OCCUPIED'
    | 'TEST_STARTED'
    | 'TEST_PASSED'
    | 'TEST_FAILED_LOCKED'
    | 'PALM_SCAN_STARTED'
    | 'PALM_SCAN_PASSED'
    | 'PALM_SCAN_FAILED_LOCKED'
    | 'DUAL_VALIDATION_COMPLETE'
    | 'ALTERNATIVE_DRIVER_NOTIFIED'
    | 'ALTERNATIVE_DRIVER_CONFIRMED'
    | 'DRIVER_REPLACED'
    | 'IGNITION_START'
    | 'IGNITION_STOP'
    | 'TRUSTED_DRIVER_REGISTERED'
    | 'EMERGENCY_ALERT';
  driverName: string;
  bacReading?: number;
  details: string;
  vehicleStatus: string;
}

export interface VehicleTelemetry {
  speedKmh: number;
  rpm: number;
  gear: 'P' | 'R' | 'N' | 'D';
  fuelPercent: number;
  batteryVolts: number;
  coolantTempC: number;
  engineStartedAt?: number;
}
