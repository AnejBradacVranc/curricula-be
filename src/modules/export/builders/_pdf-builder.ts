import { TDocumentDefinitions } from 'pdfmake/interfaces';

export interface PDFBuilder<TDetail, TListItem = TDetail> {
  buildDetail(detailDto: TDetail): TDocumentDefinitions;
  buildList(list: TListItem[]): TDocumentDefinitions;
}
