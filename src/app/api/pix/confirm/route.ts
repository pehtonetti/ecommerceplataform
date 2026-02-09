import { NextRequest, NextResponse } from "next/server";
import { confirmPixPayment } from "@/backend/actions/payment-actions";

/**
 * API Route para simular confirmação de pagamento PIX
 * 
 * ⚠️ APENAS PARA DESENVOLVIMENTO/TESTES
 * Em produção, esta rota deve ser substituída por um webhook real do banco/gateway
 * 
 * Uso:
 * POST /api/pix/confirm
 * Body: { "orderId": "uuid-do-pedido", "txId": "id-transacao-opcional" }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { orderId, txId } = body;

        if (!orderId) {
            return NextResponse.json(
                { error: "orderId é obrigatório" },
                { status: 400 }
            );
        }

        // Confirma o pagamento
        const result = await confirmPixPayment(orderId, txId);

        if (result.error) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Pagamento PIX confirmado com sucesso",
            orderId
        });
    } catch (error) {
        console.error("Erro ao confirmar pagamento PIX:", error);
        return NextResponse.json(
            { error: "Erro interno ao processar confirmação" },
            { status: 500 }
        );
    }
}
