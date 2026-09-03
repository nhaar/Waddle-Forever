import { fromLE, parseSwf } from './parser';
import { emitSwf, TagType } from './emitter';
import { to2BytesLittleEndian } from './bytes';
import { Action } from './avm1';

/**
 * This function allows to replace the string constants of a SWF file. This is used to serve a SWF file but changing the value of certain strings when the server gives the file (dynamically changing)
 * Keep in mind for this to work you just have to make sure that you have a string in the constant pool starting with the given prefix below
 */
export function replaceConstants(binary: Buffer, constantValues: Record<string, string | undefined>): Buffer {
  const swf = parseSwf(new Uint8Array(binary));
  
  const PREFIX = "##";

  swf.tags.forEach(tag => {
    if (tag.type === TagType.DoAction) {
      if (tag.content[0] === Action.ConstantPool) {
        const content = [...tag.content];
        const length = fromLE(...content.splice(1, 2));
        const countLength = 2;
        const count = fromLE(...content.splice(1, countLength));
        const constantBytes = content.splice(1, length - countLength);

        const strings: string[] = [];
        let current: number[] = [];

        constantBytes.forEach(byte => {
          if (byte === 0) {
            strings.push( new TextDecoder().decode(new Uint8Array(current)));
            current = []
          } else {
            current.push(byte);
          }
        });
        
        for (let i = 0; i < strings.length; i++) {
          if (strings[i].startsWith(PREFIX)) {
            const key = strings[i].slice(PREFIX.length);
            const replacement = constantValues[key];
            if (replacement !== undefined) {
              strings[i] = replacement;
            }
          }
        }

        
        const constantPool: number[] = [...to2BytesLittleEndian(count)];
        strings.forEach(str => {
          constantPool.push(...new TextEncoder().encode(str), 0x0);
        });
        constantPool.splice(0, 0, ...to2BytesLittleEndian(constantPool.length));

        content.splice(1, 0, ...constantPool);
        tag.content = new Uint8Array(content);
      }
    }
  });

  return Buffer.from(emitSwf(swf));
}

export function changeFrameRate(binary: Buffer, framerate: number): Buffer {
  const parsed = parseSwf(new Uint8Array(binary));
  return Buffer.from(emitSwf({ ...parsed, header: { ...parsed.header, framerate } }));
}