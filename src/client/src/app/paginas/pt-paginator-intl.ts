import { MatPaginatorIntl } from '@angular/material';

const ptRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length == 0 || pageSize == 0) { return `0 de ${length}`; }

    // length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    // return `${startIndex + 1} - ${endIndex} de ${length}`;
    return `${startIndex + 1} - ${endIndex}`;
}

export function getPtPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'Itens por página:';
    paginatorIntl.firstPageLabel = 'Primeira página';
    paginatorIntl.nextPageLabel = 'Próxima página';
    paginatorIntl.lastPageLabel = 'Ùltima página';
    paginatorIntl.previousPageLabel = 'Voltar página';
    paginatorIntl.getRangeLabel = ptRangeLabel;

    return paginatorIntl;
}