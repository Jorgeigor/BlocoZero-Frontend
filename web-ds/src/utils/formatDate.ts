import { format, parseISO } from 'date-fns';

export function formatDate(dateString: string): string {
    try {
        const parsedDate = parseISO(dateString);

        if (isNaN(parsedDate.getTime())) {
            console.error('Data inválida:', dateString);
            return 'Data Inválida';
        }
        return format(parsedDate, 'dd/MM/yyyy');
    } catch (error) {
        console.error('Erro ao formatar a data:', error);
        return 'Erro na Data';
    }
}