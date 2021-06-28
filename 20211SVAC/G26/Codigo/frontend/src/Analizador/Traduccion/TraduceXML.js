"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entorno_1 = require("../AST/Entorno");
const indexAnalizador_1 = __importDefault(require("../indexAnalizador"));
class TraduceXML {
    constructor() {
        this.contS = 0;
        this.contH = 0;
        this.indice = 0;
        this.heap = new Array();
        this.stack = new Array();
        this.strTraduccion = '';
        if (typeof TraduceXML._instance === "object") {
            return TraduceXML._instance;
        }
        TraduceXML._instance = this;
        return this;
    }
    getHeap() {
        return this.heap;
    }
    getStack() {
        return this.stack;
    }
    getContS() {
        return this.contS;
    }
    getContH() {
        return this.contS;
    }
    getStrTraduccion() {
        return this.strTraduccion;
    }
    getEncabezado() {
        let encabezado = '/*------HEADER------*/ \n'
            + '#include <stdio.h> \n'
            + '#include <math.h> \n'
            + '\n'
            + 'double heap[30101999]; \n'
            + 'double stack[30101999]; \n'
            + 'double S; \n'
            + 'double H; \n';
        return encabezado;
    }
    getMain(cuerpo) {
        let main;
        main = '/*------MAIN------*/ \n'
            + 'int main() { \n'
            + '    S = 0; \n'
            + '    H = 0; \n'
            + cuerpo + '\n'
            + '    return 0; \n'
            + '} \n';
        return main;
    }
    getCodeC() {
        var codigo3d;
        codigo3d = this.getEncabezado();
        codigo3d = codigo3d + this.getDeclaraTemps();
        codigo3d = codigo3d + this.getMain(this.strTraduccion);
        return codigo3d;
    }
    getDeclaraTemps() {
        let temps = 'double ';
        for (let c = 0; c < this.stack.length; c++) {
            temps = temps + 't' + c.toString();
            temps = temps + ((c == this.stack.length - 1) ? ';' : ', ');
            if ((c % 100) == 0) {
                temps = temps + '\n';
            }
        }
        temps = temps + '\n';
        temps = temps + '\n';
        return temps;
    }
    traducirXML() {
        console.log('/* Inicio Traduccion */');
        this.traducir(indexAnalizador_1.default.global);
        this.strTraduccion = this.getCodeC();
        console.log('/* Fin Traduccion */');
        return this.strTraduccion;
    }
    traducir(entrada) {
        let tabla = entrada.tsimbolos;
        tabla.forEach((elem) => {
            if (elem.valor.pade !== null || elem.valor.pade == undefined) {
                if (elem.valor.valor instanceof Entorno_1.Entorno) {
                    this.strTraduccion = this.strTraduccion + '\n /*--- SE AGREGA NUEVO NODO ---*/';
                    elem.valor.setPosicion(this.contS);
                    this.strTraduccion = this.strTraduccion + this.getIDAsignacionHeap(elem.valor.nombre.toString());
                    this.traducir(elem.valor.valor);
                }
                else {
                    if (elem.valor.valor !== false && elem.valor.valor !== false) {
                        this.strTraduccion = this.strTraduccion + '\n /*--- SE AGREGA NUEVO SIMBOLO ---*/';
                        elem.valor.setPosicion(this.contS);
                        //this.strTraduccion = this.strTraduccion + this.getIDAsignacionHeap(elem.valor.nombre.toString());
                        this.strTraduccion = this.strTraduccion + this.getVALAsignacionHeap(elem.valor.valor.toString());
                    }
                }
            }
        });
    }
    getIDAsignacionHeap(palabra) {
        let asignacion = '\n\t /* IDENTIFICADOR "' + palabra + '" EN HEAP*/ \n';
        asignacion = asignacion + '\t t' + this.contS + ' = H;\n';
        /* Descompone la palabra en caracteres y los asigna al Heap */
        palabra.split('').forEach((element) => {
            asignacion = asignacion
                + '\t heap[(int)H] = ' + element.charCodeAt(0) + '; \n'
                + '\t H = H + 1; \n';
            this.heap.push(element.charCodeAt(0));
            this.contH++;
        });
        /* Coloca un -1 para indicar que el valor es una cadena*/
        asignacion = asignacion
            + '\t heap[(int)H] = -1; \n'
            + '\t H = H + 1; \n';
        asignacion = asignacion
            + '\t stack[(int)' + this.contS + '] = t' + this.contS + '; \n';
        this.stack.push(this.contS);
        this.contS++;
        return asignacion;
    }
    getVALAsignacionHeap(palabra) {
        let asignacion = '\n\t /* VALOR "' + palabra + '" EN HEAP*/ \n';
        asignacion = asignacion + '\t t' + this.contS + ' = H;\n';
        /* Descompone la palabra en caracteres y los asigna al Heap */
        palabra.split('').forEach((element) => {
            asignacion = asignacion
                + '\t heap[(int)H] = ' + element.charCodeAt(0) + '; \n'
                + '\t H = H + 1; \n';
            this.heap.push(element.charCodeAt(0));
            this.contH++;
        });
        /* Coloca un -1 para indicar que el valor es una cadena*/
        asignacion = asignacion
            + '\t heap[(int)H] = -1; \n'
            + '\t H = H + 1; \n';
        asignacion = asignacion
            + '\t stack[(int)' + this.contS + '] = t' + this.contS + '; \n';
        this.stack.push(this.contS);
        this.contS++;
        return asignacion;
    }
}
const traductorXML = new TraduceXML();
exports.default = traductorXML;
