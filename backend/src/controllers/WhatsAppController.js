'use strict';

const { AppError } = require('../errors/AppError');
const { toApi } = require('../mappers/toApi');

class WhatsAppController {
  constructor(useCase) {
    this.useCase = useCase;
  }

  status = async (req, res) => res.json({ data: toApi(this.useCase.status()) });

  verifyWebhook = async (req, res) => {
    const challenge = this.useCase.verifyWebhook(req.query);
    if (challenge === null) throw new AppError(403, 'WHATSAPP_WEBHOOK_FORBIDDEN', 'No fue posible verificar el webhook.');
    res.status(200).type('text/plain').send(challenge);
  };

  receiveWebhook = async (req, res) => {
    const result = await this.useCase.receiveWebhook(req.rawBody, req.get('x-hub-signature-256'), req.body);
    res.json({ data: { received: true, ...result } });
  };

  setConsent = async (req, res) => res.json({ data: toApi(await this.useCase.setConsent(req.params.id, req.body)) });

  listMessages = async (req, res) => res.json({ data: toApi(await this.useCase.listMessages(req.query, req.user)) });

  sendTest = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.sendTest(req.body, req.user)) });

  sendAppointment = async (req, res) => res.status(201).json({ data: toApi(await this.useCase.sendAppointment(req.params.id, req.body, req.user)) });
}

module.exports = { WhatsAppController };
