'use server'

export async function sendEmailCampaign(subject: string, content: string) {
    // Stub implementation
    console.log(`Sending email campaign: ${subject}`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, recipients: 1250 };
}

export async function syncGoogleAds() {
    // Stub
    return { success: true, productsSynced: 150 };
}

export async function syncMetaAds() {
    // Stub
    return { success: true, productsSynced: 150 };
}
