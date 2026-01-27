'use server'

export async function createTicket(data: any) {
    // Stub
    console.log('Creating ticket', data);
    return { success: true, ticketId: Math.floor(Math.random() * 1000) };
}

export async function getTickets() {
    // Stub returns static data for now, ideally would fetch from DB if we had a Ticket model
    return [
        { id: 1, user: "Ana Silva", status: "open", subject: "Atraso na entrega", date: "Há 2 horas", priority: "high" },
        { id: 2, user: "Pedro Souza", status: "resolved", subject: "Dúvida sobre produto", date: "Há 1 dia", priority: "low" },
    ];
}
