let createPayment;
let getPayment;

beforeAll(async () => {
    ({ createPayment, getPayment } = await import('./mollie.mjs'))
})

afterEach(() => {
    jest.restoreAllMocks()
    delete global.fetch
})

test('createPayment without expiresAt omits expiresAt from the request body', async () => {
    const paymentData = {
        id: 'tr_123',
        amount: { value: '10.00', currency: 'EUR' },
        description: 'Test order'
    }

    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(paymentData)
    })

    const result = await createPayment(
        'test_api_key',
        'Test order',
        'https://example.com/redirect',
        'https://example.com/webhook',
        '10.00'
    )

    expect(fetch).toHaveBeenCalledWith('https://api.mollie.com/v2/payments', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
            authorization: 'Bearer test_api_key',
            'content-type': 'application/json'
        }),
        body: JSON.stringify({
            amount: {
                value: '10.00',
                currency: 'EUR'
            },
            description: 'Test order',
            redirectUrl: 'https://example.com/redirect',
            webhookUrl: 'https://example.com/webhook'
        })
    }))
    expect(result).toEqual(paymentData)
})

test('createPayment with expiresAt adds the expiresAt field to the request body', async () => {
    const paymentData = {
        id: 'tr_456',
        amount: { value: '10.00', currency: 'EUR' },
        description: 'Test order'
    }

    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(paymentData)
    })

    const result = await createPayment(
        'test_api_key',
        'Test order',
        'https://example.com/redirect',
        'https://example.com/webhook',
        '10.00',
        'EUR',
        '2025-08-23T10:00:00+02:00'
    )

    expect(fetch).toHaveBeenCalledWith('https://api.mollie.com/v2/payments', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
            authorization: 'Bearer test_api_key',
            'content-type': 'application/json'
        }),
        body: JSON.stringify({
            amount: {
                value: '10.00',
                currency: 'EUR'
            },
            description: 'Test order',
            redirectUrl: 'https://example.com/redirect',
            webhookUrl: 'https://example.com/webhook',
            expiresAt: '2025-08-23T10:00:00+02:00'
        })
    }))
    expect(result).toEqual(paymentData)
})

test('getPayment returns undefined when fetch returns a non-ok response', async () => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'not found' })
    })

    const result = await getPayment('pay_123', 'test_api_key')

    expect(fetch).toHaveBeenCalledWith('https://api.mollie.com/v2/payments/pay_123', expect.objectContaining({
        headers: expect.objectContaining({ authorization: 'Bearer test_api_key' })
    }))
    expect(result).toBeUndefined()
})

test('getPayment logs error details when fetch returns a non-ok response', async () => {
    const consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => { })

    global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue({ error: 'not found' })
    })

    const result = await getPayment('pay_123', 'test_api_key')

    expect(result).toBeUndefined()
    expect(consoleInfoSpy).toHaveBeenCalledWith('mollie error:', JSON.stringify({ error: 'not found' }))
})
