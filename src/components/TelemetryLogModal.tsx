import React from 'react';
import { X, Activity, ShieldAlert, ShieldCheck, UserCheck, Power, Download, Trash2 } from 'lucide-react';
import { TelemetryLog } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  logs: TelemetryLog[];
  onClearLogs: () => void;
}

export const TelemetryLogModal: React.FC<Props> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `alcolock-telemetria-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide uppercase text-white">
                Registro da Caixa-Preta (Telemetria AlcoLock)
              </h3>
              <p className="text-[11px] text-slate-400">
                Auditoria de testes de álcool, bloqueios e substituição de motoristas
              </p>
            </div>
          </div>
          <button
            id="btn-close-logs-modal"
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            Total de Registros: <strong className="text-slate-200">{logs.length}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              id="btn-export-logs"
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar JSON</span>
            </button>
            <button
              id="btn-clear-logs"
              type="button"
              onClick={onClearLogs}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {/* List of Events */}
        <div className="p-5 overflow-y-auto space-y-2 flex-1">
          {logs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Nenhum evento registrado até o momento.
            </div>
          ) : (
            logs.map((log) => {
              const dateStr = new Date(log.timestamp).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              let badgeColor = 'bg-slate-800 text-slate-300';
              let icon = <Activity className="w-4 h-4" />;

              if (log.eventType === 'TEST_FAILED_LOCKED') {
                badgeColor = 'bg-rose-950/80 border border-rose-700 text-rose-300';
                icon = <ShieldAlert className="w-4 h-4 text-rose-400" />;
              } else if (log.eventType === 'TEST_PASSED') {
                badgeColor = 'bg-emerald-950/80 border border-emerald-700 text-emerald-300';
                icon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;
              } else if (log.eventType === 'DRIVER_REPLACED') {
                badgeColor = 'bg-cyan-950/80 border border-cyan-700 text-cyan-300';
                icon = <UserCheck className="w-4 h-4 text-cyan-400" />;
              } else if (log.eventType === 'IGNITION_START') {
                badgeColor = 'bg-blue-950/80 border border-blue-700 text-blue-300';
                icon = <Power className="w-4 h-4 text-blue-400" />;
              }

              return (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 rounded-md bg-slate-900 shrink-0 mt-0.5">
                      {icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100">{log.driverName}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold ${badgeColor}`}>
                          {log.eventType}
                        </span>
                      </div>
                      <div className="text-slate-300 text-[11px] mt-0.5">{log.details}</div>
                      {log.bacReading !== undefined && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          Teor Alcoólico: <strong className={log.bacReading > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                            {log.bacReading.toFixed(2)} mg/L
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 shrink-0">
                    {dateStr}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
