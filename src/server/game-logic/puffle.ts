// Importamos StaticDataTable, que probablemente es una clase personalizada para manejar tablas de datos estáticos.
// Está ubicada en '../../common/static-table', posiblemente definida para facilitar el acceso y la validación de datos en tiempo de ejecución.
import { StaticDataTable } from "../../common/static-table";

// Definimos el tipo (estructura) de datos para un objeto de tipo 'Puffle'
type Puffle = {
  id: number                         // Identificador único del puffle
  parentId: number | undefined      // ID del puffle "padre", si es una variación (ej. dinosaurios derivados de puffles originales)
  name: string                       // Nombre del puffle
  cost: number                       // Costo del puffle en monedas
  member: boolean                    // Indica si solo los miembros pueden adoptarlo (true = solo miembros)
  favouriteFood: number             // ID del ítem que representa su comida favorita
  favouriteToy: number | undefined  // ID del ítem que representa su juguete favorito (puede ser undefined)
  runawayPostcard: number | undefined // ID de la postal que se envía si se escapa (puede ser undefined)
};

// Creamos una instancia de la tabla de puffles con el tipo `Puffle` y los campos que componen cada entrada
export const PUFFLES = new StaticDataTable<Puffle, [
  'id',
  'parentId',
  'name',
  'cost',
  'member',
  'favouriteFood',
  'favouriteToy',
  'runawayPostcard'
]>(
  // Lista de claves (columnas) que tendrá cada entrada
  ['id', 'parentId', 'name', 'cost', 'member', 'favouriteFood', 'favouriteToy', 'runawayPostcard'],
  
  // Lista de entradas (cada una representa un puffle con sus datos)
  [
    // id, parentId, name, cost, member, favouriteFood, favouriteToy, runawayPostcard
    [0, undefined, 'Blue', 400, false, 105, 27, undefined],
    [1, undefined, 'Pink', 400, true, 107, 28, 101],
    [2, undefined, 'Black', 400, true, 112, 31, 102],
    [3, undefined, 'Green', 400, true, 109, 30, 103],
    [4, undefined, 'Purple', 400, true, 110, 35, 104],
    [5, undefined, 'Red', 400, false, 106, 29, 105],
    [6, undefined, 'Yellow', 400, true, 114, 32, 106],
    [7, undefined, 'White', 400, true, 111, 33, 169],
    [8, undefined, 'Orange', 400, true, 108, 34, 109],
    [9, undefined, 'Brown', 400, true, 113, 36, undefined],
    [10, undefined, 'Rainbow', 0, true, 115, 103, undefined], // Gratis, probablemente limitado a eventos
    [11, undefined, 'Gold', 0, true, 128, 125, undefined],

    // Puffles especiales derivados de otros (parentId ≠ undefined)

    [1000, 2, 'Black T-Rex', 0, true, 112, undefined, undefined],
    [1001, 4, 'Purple T-Rex', 0, true, 110, undefined, undefined],
    [1002, 5, 'Red Triceratops', 0, true, 106, undefined, undefined],
    [1003, 0, 'Blue Triceratops', 0, true, 105, undefined, undefined],
    [1004, 6, 'Yellow Stegasaurus', 0, true, 114, undefined, undefined],
    [1005, 1, 'Pink Stegasaurus', 0, true, 107, undefined, undefined],

    // Puffles edición especial o moderna (gatos, perros, mapaches, conejos, ciervos)

    [1006, 0, 'Blue Dog', 800, true, 105, 35, undefined],
    [1007, 8, 'Orange Cat', 800, true, 108, 35, undefined],
    [1008, 3, 'Green Raccoon', 800, true, 109, 35, undefined],
    [1009, 8, 'Orange Raccoon', 800, true, 108, 35, undefined],
    [1010, 1, 'Pink Raccoon', 800, true, 107, 35, undefined],
    [1011, 0, 'Blue Raccoon', 800, true, 105, 35, undefined],
    [1012, 3, 'Green Rabbit', 800, true, 109, 35, undefined],
    [1013, 1, 'Pink Rabbit', 800, true, 107, 35, undefined],
    [1014, 7, 'White Rabbit', 800, true, 111, 35, undefined],
    [1015, 5, 'Red Rabbit', 800, true, 106, 35, undefined],

    // Ciervos y unicornios
    [1016, 0, 'Blue Deer', 800, true, 105, undefined, undefined],
    [1017, 2, 'Black Deer', 800, true, 112, undefined, undefined],
    [1018, 5, 'Red Deer', 800, true, 106, undefined, undefined],
    [1019, 4, 'Purple Deer', 800, true, 110, undefined, undefined],
    [1020, 6, 'Yellow Unicorn', 800, true, 114, undefined, undefined],

    // Puffles temáticos de eventos
    [1021, 7, 'Snowman', 0, true, 111, undefined, undefined],
    [1022, 4, 'Ghost', 0, true, 110, undefined, undefined],
    [1023, 0, 'Crystal', 0, true, 105, undefined, undefined],
    [1024, 3, 'Green Alien', 0, false, 109, undefined, undefined],
    [1025, 8, 'Orange Alien', 0, true, 108, undefined, undefined],
    [1026, 6, 'Yellow Alien', 0, true, 114, undefined, undefined],
    [1027, 4, 'Purple Alien', 0, true, 110, undefined, undefined]
  ]
);
