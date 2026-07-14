'use strict';

class ReportUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  dashboard(user, query) {
    return this.repository.dashboard(user, query);
  }

  income(query, user) {
    return this.repository.incomeReport(user, query);
  }

  workOrders(query, user) {
    return this.repository.listWorkOrders(user, query.limit);
  }

  vehicleHistory(vehicleId) {
    return this.repository.listVehicleHistory(vehicleId);
  }
}

module.exports = { ReportUseCase };
