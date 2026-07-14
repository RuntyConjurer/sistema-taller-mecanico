'use strict';

class AuthController {
  constructor(useCase) { this.useCase = useCase; }
  login = async (req, res) => res.json({ data: await this.useCase.login(req.body) });
}

module.exports = { AuthController };
