import { Action, PCodeRep } from "../src/common/flash/avm1";
import fs from 'fs';
import path from "path";

function convertPcode(pcode: string): PCodeRep {
  const lines = pcode.split('\n');

  let generatorCode = '';

  lines.forEach(line => {
    if (line.startsWith('Push')) {
      const args = line.trim().match(/^Push\s+(.*)$/);
      const processedArgs: Array<number | string | boolean> = [];
      let state: 'str' | 'num' | null = null;
      let num = 0;
      let str = '';
      if (args !== null) {
        const argString = args[1] + '+';
        for (let i = 0; i < argString.length; i++) {
          const c = argString[i];
          if (state === null) {
            if (c === '"') {
              state = 'str';
              str = '';
            } else if (c === ',') {
              i += 1;
            } else if (isNaN(Number(c))) {
              if (c === 'f') {
                processedArgs.push(false)
                i += 4;
              } else if (c === 't') {
                processedArgs.push(true);
                i += 3;
              }
            } else {
              state = 'num'
              num = Number(c);
            }
          } else if (state === 'str') {
            if (c === '\\') {
              const escapeChar = argString[i + 1];
              if (escapeChar === '"') {
                str += escapeChar;
                i += 1;
              } else if (escapeChar === "'") {
                str += escapeChar;
                i += 1;
              } else if (escapeChar === 'n') {
                str += '\n';
                i += 1;
              } else if (escapeChar === 'b') {
                str += '\b';
                i += 1;
              } else if(escapeChar === '\\') {
                str += '\\';
                i += 1;
              } else if (escapeChar === 't') {
                str += '\t';
                i += 1;
              } else {
                throw new Error('Undefined escape sequence: ' + escapeChar);
              }
            } else if (c === '"') {
              processedArgs.push(str);
              state = null;
            } else {
              str += c;
            }
          } else if (state === 'num') {
            if (isNaN(Number(c))) {
              state = null;
              processedArgs.push(num);
              i -= 1;
            } else {
              num *= 10;
              num += Number(c);
            }
          }
        }
        generatorCode += `[Action.Push, ${processedArgs.map(arg => {
          if (typeof arg === 'boolean') {
            return arg ? 'true' : 'false';
          } else if (typeof arg === 'number') {
            return arg;
          } else {
            return `"${arg.replaceAll('"', '\\"')}"`;
          }
        }).join(', ')}],\n`;
      }
    } else if (line.trim() !== '') {
      const action = {
        'GetVariable': Action.GetVariable,
        'CallMethod': Action.CallMethod,
        'DefineLocal': Action.DefineLocal,
        'Add2': Action.Add2,
        'NewObject': Action.NewObject,
        'SetMember': Action.SetMember,
        'InitObject': Action.InitObject,
        'GetMember': Action.GetMember,
        'InitArray': Action.InitArray,
        'Pop': Action.Pop,
        'CallFunction': Action.CallFunction
      }[line.trim()]
      generatorCode += `Action.${line.trim()},\n`;
      if (action === undefined) {
        throw new Error(`Unknown action: ${line}`);
      }
    }

  })

  fs.writeFileSync(path.join(__dirname, 'pcode_rep'), generatorCode);
  return [];
}

convertPcode(fs.readFileSync(path.join(__dirname, 'pcode'), { encoding: 'utf-8'}))