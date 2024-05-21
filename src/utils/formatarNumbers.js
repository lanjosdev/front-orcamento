export function formatarNumero(numero, tamanho=3) {
    return numero.toString().padStart(tamanho, '0');
}