import os
import sys

ARCHIVOS = [
    'src/server/game-data/parties.ts',
    'src/server/game-data/files.ts',
    'src/server/game-data/rooms.ts',
    'src/server/game-data/as3-static.ts'
]

def abrir_archivos_predeterminado(lista_archivos):
    raiz = os.path.dirname(os.path.abspath(__file__))
    for ruta_relativa in lista_archivos:
        ruta_completa = os.path.join(raiz, ruta_relativa)
        if os.path.exists(ruta_completa):
            try:
                os.startfile(ruta_completa)
                print(f"[OK] Abriendo '{ruta_relativa}' con la aplicación predeterminada...")
            except Exception as e:
                print(f"[Error] No se pudo abrir {ruta_relativa}: {e}")
        else:
            print(f"[Error] Archivo no encontrado: {ruta_relativa}")

if __name__ == "__main__":
    if sys.platform.startswith('win'):
        abrir_archivos_predeterminado(ARCHIVOS)
    else:
        print("Este script está diseñado para ejecutarse en Windows.")
