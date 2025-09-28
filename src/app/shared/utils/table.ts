import { TableLazyLoadEvent } from 'primeng/table';

export const getPageFromLazyLoadEvent = (event: TableLazyLoadEvent): number => {
  return event.first! / event.rows! + 1;
};
