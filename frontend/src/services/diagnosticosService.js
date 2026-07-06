import { apiRequest } from './api'

const DIAGNOSTICOS_ENDPOINT = ''

export function listarDiagnosticos() {
  return apiRequest(DIAGNOSTICOS_ENDPOINT)
}
