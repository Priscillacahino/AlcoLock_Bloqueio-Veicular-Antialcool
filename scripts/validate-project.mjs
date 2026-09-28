import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (message) => {
  console.error(`ERRO: ${message}`);
  process.exitCode = 1;
};

const pkg = JSON.parse(read('package.json'));
const app = read('src/App.tsx');
const panel = read('src/components/AlcoholTestPanel.tsx');
const docs = read('docs/analise-financeira-estatistica.md');

if (pkg.name !== 'alcolock-prototype') fail('package.json ainda possui nome genérico.');
if (app.includes("localStorage.setItem('alcolock_trusted_driver'")) fail('dados do motorista alternativo ainda são persistidos no localStorage.');
if (app.includes('PIN: ${updated.confirmationPin}')) fail('PIN ainda aparece no log de cadastro.');
if (panel.includes('PIN {trustedDriver.confirmationPin}')) fail('PIN ainda aparece em texto aberto na interface.');
if (app.includes('Em conformidade com a Lei')) fail('protótipo ainda declara conformidade legal/certificação não demonstrada.');
if (!docs.includes('Custo Total de Propriedade')) fail('documentação financeira não foi encontrada ou está incompleta.');

if (!process.exitCode) {
  console.log('Validação estrutural e de segurança: APROVADA');
}
