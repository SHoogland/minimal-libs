const mollieApiBaseUrl = 'https://api.mollie.com/v2/'

const notOkResponse = async (response) => {
    const errorData = await response.json().catch(() => null)
    console.info('mollie error:', JSON.stringify(errorData ?? { status: response.status }))
}

// https://docs.mollie.com/reference/create-payment
const createPayment = async (
    apiKey,
    description,
    redirectUrl,
    webhookUrl,
    amountValue, // string '10.00'
    amountCurrency = 'EUR',
    expiresAt = null // '2025-08-23T10:00:00+02:00'
) => {
    let molliePayment;

    const body = {
        amount: {
            value: amountValue,
            currency: amountCurrency
        },
        description: description,
        redirectUrl: redirectUrl,
        webhookUrl: webhookUrl
    }

    if (expiresAt) {
        body.expiresAt = expiresAt;
    }

    const createPaymentResponse = await fetch(`${mollieApiBaseUrl}payments`, {
        method: 'POST',
        headers: {
            authorization: 'Bearer ' + apiKey,
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    if (!createPaymentResponse.ok) {
        await notOkResponse(createPaymentResponse)
        molliePayment = undefined
    } else {
        molliePayment = await createPaymentResponse.json()
    }
    return molliePayment;
}

// https://docs.mollie.com/reference/get-payment
const getPayment = async (
    paymentId,
    apiKey
) => {
    let molliePayment;
    const getPaymentResponse = await fetch(`${mollieApiBaseUrl}payments/${paymentId}`, {
        headers: {
            authorization: 'Bearer ' + apiKey,
            'content-type': 'application/json'
        }
    })
    if (!getPaymentResponse.ok) {
        await notOkResponse(getPaymentResponse)
        molliePayment = undefined
    } else {
        molliePayment = await getPaymentResponse.json()
    }
    return molliePayment;
}

export { createPayment, getPayment }