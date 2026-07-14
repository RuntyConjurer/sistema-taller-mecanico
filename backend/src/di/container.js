'use strict';

const models = require('../infrastructure/models');
const { env } = require('../config/env');
const { createResources } = require('./createResources');
const { createResourceController } = require('../controllers/createResourceController');

const { AuthRepository } = require('../repositories/AuthRepository');
const { AppointmentRepository } = require('../repositories/AppointmentRepository');
const { WorkOrderRepository } = require('../repositories/WorkOrderRepository');
const { BillingRepository } = require('../repositories/BillingRepository');
const { InventoryRepository } = require('../repositories/InventoryRepository');
const { ReportRepository } = require('../repositories/ReportRepository');
const { QuoteRepository } = require('../repositories/QuoteRepository');
const { UserRepository } = require('../repositories/UserRepository');
const { WhatsAppRepository } = require('../repositories/WhatsAppRepository');

const { AuthUseCase } = require('../domain/AuthUseCase');
const { AppointmentUseCase } = require('../domain/AppointmentUseCase');
const { WorkOrderUseCase } = require('../domain/WorkOrderUseCase');
const { BillingUseCase } = require('../domain/BillingUseCase');
const { InventoryUseCase } = require('../domain/InventoryUseCase');
const { ReportUseCase } = require('../domain/ReportUseCase');
const { QuoteUseCase } = require('../domain/QuoteUseCase');
const { UserUseCase } = require('../domain/UserUseCase');
const { WhatsAppUseCase } = require('../domain/WhatsAppUseCase');

const { AuthController } = require('../controllers/AuthController');
const { AppointmentController } = require('../controllers/AppointmentController');
const { WorkOrderController } = require('../controllers/WorkOrderController');
const { BillingController } = require('../controllers/BillingController');
const { InventoryController } = require('../controllers/InventoryController');
const { ReportController } = require('../controllers/ReportController');
const { WhatsAppController } = require('../controllers/WhatsAppController');

const { JwtService } = require('../services/JwtService');
const { WhatsAppCloudService } = require('../services/WhatsAppCloudService');

function buildContainer() {
  const resources = createResources(models);
  const jwtService = new JwtService();

  const authController = new AuthController(
    new AuthUseCase(new AuthRepository(), jwtService),
  );
  const appointmentController = new AppointmentController(
    new AppointmentUseCase(new AppointmentRepository(models), resources.citas.repository),
  );
  const workOrderController = new WorkOrderController(
    new WorkOrderUseCase(new WorkOrderRepository(models)),
  );
  const billingController = new BillingController(
    new BillingUseCase(new BillingRepository(models)),
  );
  const inventoryController = new InventoryController(
    new InventoryUseCase(new InventoryRepository(models)),
  );
  const reportController = new ReportController(
    new ReportUseCase(new ReportRepository(models, resources.ordenes.repository, resources.historial.repository)),
  );

  const whatsappCloudService = new WhatsAppCloudService(env.whatsapp);
  const whatsappController = new WhatsAppController(
    new WhatsAppUseCase(new WhatsAppRepository(models), whatsappCloudService),
  );

  resources.usuarios = {
    useCase: new UserUseCase(new UserRepository(models)),
  };
  resources.usuarios.controller = createResourceController(resources.usuarios.useCase);

  resources.cotizaciones = {
    useCase: new QuoteUseCase(new QuoteRepository(models)),
  };
  resources.cotizaciones.controller = createResourceController(resources.cotizaciones.useCase);

  return {
    resources,
    authController,
    appointmentController,
    workOrderController,
    billingController,
    inventoryController,
    reportController,
    whatsappController,
    jwtService,
    models,
  };
}

module.exports = { buildContainer };
