const send = async () => {

    // https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages/post-v3--domain-name--messages

    const form = new FormData();
    form.append("from", "string");
    form.append("to", "string");
    form.append("cc", "string");
    form.append("bcc", "string");
    form.append("subject", "string");
    form.append("text", "string");
    form.append("html", "string");
    form.append("attachment", "string");
    form.append("inline", "string");
    form.append("template", "string");
    form.append("t:version", "string");
    form.append("t:text", "yes");
    form.append("t:variables", "string");
    form.append("o:tag", "string");
    form.append("o:dkim", "yes");
    form.append("o:secondary-dkim", "string");
    form.append("o:secondary-dkim-public", "string");
    form.append("o:deliverytime", "string");
    form.append("o:deliver-within", "string");
    form.append("o:deliverytime-optimize-period", "string");
    form.append("o:time-zone-localize", "string");
    form.append("o:testmode", "yes");
    form.append("o:tracking", "yes");
    form.append("o:tracking-clicks", "yes");
    form.append("o:tracking-opens", "yes");
    form.append("o:require-tls", "yes");
    form.append("o:skip-verification", "yes");
    form.append("o:sending-ip", "string");
    form.append("o:sending-ip-pool", "string");
    form.append("o:tracking-pixel-location-top", "yes");
    form.append("o:archive-to", "string");
    form.append("o:suppress-headers", "string");
    form.append("h:X-My-Header", "string");
    form.append("v:my-var", "string");
    form.append("recipient-variables", "string");

    const domainName = 'YOUR_domain_name_PARAMETER';
    const resp = await fetch(
        `https://api.mailgun.net/v3/${domainName}/messages`,
        {
            method: 'POST',
            headers: {
                Authorization: 'Basic ' + btoa('<username>:<password>')
            },
            body: form
        }
    );

    const data = await resp.text();
    console.log(data);
}

export { send }
