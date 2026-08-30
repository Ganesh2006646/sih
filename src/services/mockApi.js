const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const dams = [
  { id: 'tehri', name: 'Tehri', river: 'Bhagirathi', state: 'Uttarakhand', type: 'Earth-rockfill', height: 260, capacity: 3.54, region: 'Himalayan' },
  { id: 'bhakra', name: 'Bhakra', river: 'Sutlej', state: 'Himachal Pradesh', type: 'Concrete gravity', height: 226, capacity: 9.34, region: 'Himalayan' },
  { id: 'rishiganga', name: 'Rishiganga (natural blockage site)', river: 'Rishiganga', state: 'Uttarakhand', type: 'Landslide/natural dam', height: 60, capacity: 0.02, region: 'Himalayan' },
  { id: 'hirakud', name: 'Hirakud', river: 'Mahanadi', state: 'Odisha', type: 'Composite earth+concrete', height: 61, capacity: 5.90, region: 'Peninsular' },
  { id: 'nagarjuna', name: 'Nagarjuna Sagar', river: 'Krishna', state: 'Telangana / AP', type: 'Masonry gravity', height: 124, capacity: 6.84, region: 'Peninsular' },
  { id: 'idukki', name: 'Idukki', river: 'Periyar', state: 'Kerala', type: 'Concrete arch', height: 169, capacity: 1.99, region: 'Peninsular' },
]

export async function fetchDams() { await pause(420); return dams }
export async function estimateBreachParams(dam, failureMode) { await pause(460); return { width: Math.round(Math.min(500, Math.max(40, dam.height * (failureMode === 'Instantaneous' ? 0.8 : 0.65)))), depth: Math.round(dam.height * 0.36), time: failureMode === 'Instantaneous' ? 12 : 45, slope: failureMode === 'Natural dam breach' ? 1.4 : 1, level: 92 } }
export async function runSimulation(_dam, _scenario, onProgress) { for (let progress = 0; progress <= 100; progress += 4) { await pause(560); onProgress?.(progress) } return { runId: 'RUN-2026-0428-014', status: 'complete' } }
export async function fetchValidationMetrics(_runId) { await pause(350); return { iou: 0.68, csi: 0.74, f1: 0.79, pod: 0.83, far: 0.27 } }
export async function fetchImpactAssessment(_runId) { await pause(350); return { population: [18200, 24700], buildings: [4180, 5920] } }
