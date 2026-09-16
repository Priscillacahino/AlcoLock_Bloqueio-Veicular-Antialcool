import React from 'react';
import { X, ShieldCheck, Smartphone, Key, UserCheck, Bluetooth, Hash, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { TrustedAlternativeDriver } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  trustedDriver: TrustedAlternativeDriver;
  onSave: (updated: TrustedAlternativeDriver) => void;
}

export const RegisterTrustedDriverModal: React.FC<Props> = ({
  isOpen,
  onClose,
  trustedDriver,
  onSave,
}) => {
  const [name, setName] = React.useState(trustedDriver.name);
  const [phone, setPhone] = React.useState(trustedDriver.phone);
  const [relationship, setRelationship] = React.useState(trustedDriver.relationship);
  const [cnh, setCnh] = React.useState(trustedDriver.cnh);
  const [deviceType, setDeviceType] = React.useState<TrustedAlternativeDriver['deviceType']>(trustedDriver.deviceType);
  const [pairedDeviceName, setPairedDeviceName] = React.useState(trustedDriver.pairedDeviceName);
  const [confirmationPin, setConfirmationPin] = React.useState(trustedDriver.confirmationPin);
  const [isPairingTest, setIsPairingTest] = React.useState(false);
  const [pairingSuccess, setPairingSuccess] = React.useState(true);
  const [saveSuccessNotice, setSaveSuccessNotice] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setName(trustedDriver.name);
      setPhone(trustedDriver.phone);
      setRelationship(trustedDriver.relationship);
      setCnh(trustedDriver.cnh);
      setDeviceType(trustedDriver.deviceType);
      setPairedDeviceName(trustedDriver.pairedDeviceName);
      setConfirmationPin(trustedDriver.confirmationPin);
      setSaveSuccessNotice(false);
      setIsPairingTest(false);
    }
  }, [isOpen, trustedDriver]);

  if (!isOpen) return null;

  const handleTestPairing = () => {
    setIsPairingTest(true);
    setTimeout(() => {
      setIsPairingTest(false);
      setPairingSuccess(true);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: TrustedAlternativeDriver = {
      ...trustedDriver,
      name,
      phone,
      relationship,
      cnh,
      deviceType,
      pairedDeviceName,
      confirmationPin: confirmationPin || '2489',
    };
    onSave(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">
                Cadastro de Motorista Alternativo de Confiança
              </h3>
              <p className="text-[11px] text-slate-400">
                Pessoa autorizada a assumir o veículo caso o teste de álcool seja reprovado
              </p>
            </div>
          </div>
          <button
            id="btn-close-register-driver"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <strong className="text-white block mb-1">Como funciona este recurso de segurança:</strong>
            Se o sensor de bafômetro no banco do motorista acusar teor de álcool acima do limite seguro, o sistema entrará em contato automaticamente com este motorista alternativo e <strong>só permitirá a partida do carro após sua presença física e confirmação no veículo</strong>.
          </div>

          {/* Personal info */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Nome Completo do Motorista de Confiança:
              </label>
              <input
                id="input-trusted-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Telefone / WhatsApp:
                </label>
                <input
                  id="input-trusted-phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+55 (11) 98765-4321"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">
                  Grau de Parentesco / Relação:
                </label>
                <select
                  id="select-trusted-rel"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Cônjuge / Parceiro(a)">Cônjuge / Parceiro(a)</option>
                  <option value="Amigo(a) da Rodada">Amigo(a) da Rodada (Designated Driver)</option>
                  <option value="Familiar / Irmão / Pai">Familiar / Pai / Mãe / Irmão</option>
                  <option value="Colega de Confiança">Colega de Confiança</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                Número da CNH (Habilitação Válida):
              </label>
              <input
                id="input-trusted-cnh"
                type="text"
                value={cnh}
                onChange={(e) => setCnh(e.target.value)}
                placeholder="Ex: 98471204938"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          {/* Verification Method & Device Pairing */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block uppercase tracking-wider">
              Dispositivo Pareado & Confirmação de Presença
            </span>

            {/* Method choice */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDeviceType('bluetooth_key')}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  deviceType === 'bluetooth_key'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bluetooth className="w-4 h-4" />
                <span className="text-[10px] font-bold">Chave BLE</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceType('smartphone_app')}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  deviceType === 'smartphone_app'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[10px] font-bold">App Digital</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceType('nfc_token')}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  deviceType === 'nfc_token'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Key className="w-4 h-4" />
                <span className="text-[10px] font-bold">Token NFC / Tag</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Nome do Dispositivo Pareado:
                </label>
                <input
                  id="input-paired-device-name"
                  type="text"
                  value={pairedDeviceName}
                  onChange={(e) => setPairedDeviceName(e.target.value)}
                  placeholder="Ex: iPhone 15 Pro de Mariana"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  PIN de Segurança de Confirmação (4 dígitos):
                </label>
                <div className="relative">
                  <input
                    id="input-trusted-pin"
                    type="text"
                    maxLength={4}
                    value={confirmationPin}
                    onChange={(e) => setConfirmationPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="2489"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono tracking-widest pl-7"
                  />
                  <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
                </div>
              </div>
            </div>

            {/* Test connection */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] text-slate-300">
                  Status de Pareamento: <strong>{pairingSuccess ? 'Pareado e Autenticado' : 'Desconectado'}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleTestPairing}
                disabled={isPairingTest}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isPairingTest ? 'animate-spin' : ''}`} />
                <span>{isPairingTest ? 'Testando...' : 'Testar Pareamento'}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {saveSuccessNotice ? (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Cadastro salvo com sucesso!
              </span>
            ) : (
              <span className="text-[10px] text-slate-500">
                Dados gravados na memória segura do veículo
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-save-trusted-driver"
                type="submit"
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-emerald-950 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Motorista</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
